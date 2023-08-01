import { createContext, useEffect, useState, useContext } from "react";
import { ethers } from "ethers";
import { Web3Storage } from "web3.storage";
import contractABI from "../utils/contractABI.json";
import { TaskTypes, address0, TaskStatuses, Categories, contractAddress } from "../utils/constants";
import { PlatformContext } from "./PlatformContext";

export const TaskContext = createContext();

const shouldPollResponse = true;

const { tronWeb } = window;

export const TaskProvider = ({ children }) => {
  const [formData, setformData] = useState({
    category: Categories[0],
    title: "",
    description: "",
    taskType: 0,
    reward: 0,
    assignee: address0
  });

  const [tasks, setTasks] = useState("");
  const [task, setTask] = useState([]);
  const { notify, fee, setIsLoading } = useContext(PlatformContext);
  const [ipfsUrl, setIpfsUrl] = useState("");

  const createTronContract = async () => {
    let c;
    if (tronWeb) {
      tronWeb.setAddress(contractAddress);
      c = await tronWeb.contract(contractABI, contractAddress);
    }
    return c;
  };

  const onUploadHandler = async (event) => {
    const client = new Web3Storage({ token: import.meta.env.VITE_WEB3_STORAGE_TOKEN });
    event.preventDefault();
    const form = event.target;
    const { files } = form[0];
    if (!files || files.length === 0) {
      return alert("No files selected");
    }
    setIsLoading(true);
    const rootCid = await client.put(files);
    const info = await client.status(rootCid);
    const url = `https://${info.cid}.ipfs.w3s.link/${files[0].name}`;
    form.reset();
    setIpfsUrl(url);
    setIsLoading(false);
    notify("File successfully uploaded to IPFS.");
  };

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  function formatTask(t) {
    return ({
      id: t.id.toNumber(),
      category: t.category,
      title: t.title,
      description: t.description,
      taskType: TaskTypes[t.taskType],
      createdAt: new Date(
        t.createdAt.toNumber() * 1000
      ).toLocaleDateString(),
      author: tronWeb.address.fromHex(t.author),
      candidates:
        t.candidates.length > 0
          ? t.candidates.map((c) => tronWeb.address.fromHex(c))
          : [],
      assignee:
        t.assignee === address0
          ? "Unassigned"
          : tronWeb.address.fromHex(t.assignee),
      completedAt:
        t.completedAt > 0
          ? new Date(
            t.completedAt.toNumber() * 1000
          ).toLocaleDateString()
          : "Not completed yet",
      reward: tronWeb.fromSun(t.reward),
      result: t.result,
      status: TaskStatuses[t.status],
      lastStatusChangeAt: new Date(
        t.lastStatusChangeAt.toNumber() * 1000
      ).toLocaleDateString(),
      changeRequests: t.changeRequests,
    });
  }

  const formatUser = async (address) => {
    if (tronWeb && address) {
      try {
        const user = {};
        const contract = await createTronContract();
        const fetchedProfile = await contract.getProfile(address).call();
        user.profile = fetchedProfile;
        user.address = tronWeb.address.fromHex(address);
        const fetchedRating = await contract.getRating(address).call();
        user.rating = fetchedRating;
        return user;
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Tron is not present");
    }
  };

  const composeCandidateProfiles = async (candidates) => {
    const p = [];
    if (candidates) {
      for (let i = 0; i < candidates.candidates.length; i += 1) {
        const c = await formatUser(candidates.candidates[i]);
        p.push(c);
      }
      return p;
    }
  };

  const composeAuthorProfile = async (address) => {
    const p = await formatUser(address);
    return p;
  };

  const getAllTasks = async () => {
    try {
      if (tronWeb) {
        setIsLoading(true);
        const contract = await createTronContract();
        const availableTasks = await contract.getAllTasks().call();
        const structuredTasks = availableTasks
          .filter((item) => item.title && item.title !== "")
          .map((item) => (formatTask(item)));
        setTasks(structuredTasks);
        setIsLoading(false);
      } else {
        console.log("Tron is not present");
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const getTask = async (id) => {
    if (tronWeb) {
      try {
        setIsLoading(true);
        const contract = await createTronContract();
        const fetchedTask = await contract.getTask(id).call();
        setTask(formatTask(fetchedTask));
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    } else {
      console.log("Tron is not present");
    }
  };

  const addTask = async () => {
    if (tronWeb) {
      try {
        const { category, title, description, taskType, reward, assignee } = formData;
        const feeAmount = (reward / 100) * fee;
        const totalAmount = parseFloat(reward) + parseFloat(feeAmount);
        const taskToSend = [
          category,
          title,
          description,
          taskType,
          tronWeb.toSun(reward),
          assignee
        ];
        setIsLoading(true);
        const contract = await createTronContract();
        const transaction = await contract.addTask(taskToSend).send({
          feeLimit: 1000_000_000,
          callValue: tronWeb.toSun(totalAmount),
          shouldPollResponse
        });
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        window.location.replace("/tasks");
        notify("New task added successfully.");
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    } else {
      console.log("No Tron object");
    }
  };

  const applyForTask = async (id) => {
    if (tronWeb) {
      try {
        setIsLoading(true);
        const bnId = ethers.BigNumber.from(id);
        const contract = await createTronContract();
        const transaction = await contract.applyForTask(bnId).send({
          feeLimit: 100_000_000,
          callValue: 0,
          shouldPollResponse
        });
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        await getAllTasks();
        await getTask(id);
        notify("Successfully applied.");
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    } else {
      console.log("No Tron object");
    }
  };

  const submitResult = async (id, result) => {
    if (tronWeb) {
      try {
        setIsLoading(true);
        const contract = await createTronContract();
        const transaction = await contract
          .submitResult(ethers.BigNumber.from(id), result)
          .send({
            feeLimit: 100_000_000,
            callValue: 0,
            shouldPollResponse
          });
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        await getAllTasks();
        await getTask(id);
        notify("Result submitted successfully.");
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    } else {
      console.log("No Tron object");
    }
  };

  const deleteTask = async (id) => {
    if (tronWeb) {
      try {
        setIsLoading(true);
        const contract = await createTronContract();
        const transaction = await contract
          .deleteTask(ethers.BigNumber.from(id))
          .send({
            feeLimit: 100_000_000,
            callValue: 0,
            shouldPollResponse
          });
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        await getAllTasks();
        notify("Task deleted successfully.");
        window.location.replace("/tasks");
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    } else {
      console.log("No Tron object");
    }
  };

  const assignTask = async (id, candidate) => {
    if (tronWeb) {
      try {
        setIsLoading(true);
        const contract = await createTronContract();
        const transaction = await contract
          .assignTask(ethers.BigNumber.from(id), candidate)
          .send({
            feeLimit: 100_000_000,
            callValue: 0,
            shouldPollResponse
          });
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        await getAllTasks();
        await getTask(id);
        notify("Task assigned.");
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    } else {
      console.log("No TRon object");
    }
  };

  const unassignTask = async (id) => {
    if (tronWeb) {
      try {
        setIsLoading(true);
        const contract = await createTronContract();
        const transaction = await contract
          .unassignTask(ethers.BigNumber.from(id))
          .send({
            feeLimit: 100_000_000,
            callValue: 0,
            shouldPollResponse
          });
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        await getAllTasks();
        await getTask(id);
        notify("Task unassigned.");
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    } else {
      console.log("No Tron object");
    }
  };

  const requestChange = async (id, message) => {
    if (message.length === 0) return;
    if (tronWeb) {
      try {
        setIsLoading(true);
        const contract = await createTronContract();
        const transaction = await contract
          .requestChange(ethers.BigNumber.from(id), message)
          .send({
            feeLimit: 100_000_000,
            callValue: 0,
            shouldPollResponse
          });
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        await getAllTasks();
        await getTask(id);
        notify("Change reaquest submitted.");
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    } else {
      console.log("No Tron object");
    }
  };

  const completeTask = async (id, newRating) => {
    try {
      if (tronWeb) {
        setIsLoading(true);
        const contract = await createTronContract();
        const transaction = await contract
          .completeTask(ethers.BigNumber.from(id), newRating)
          .send({
            feeLimit: 100_000_000,
            callValue: 0,
            shouldPollResponse,
          });
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        await getAllTasks();
        await getTask(id);
        notify("Task completed.");
      } else {
        console.log("No Tron object");
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getAllTasks();
    };
    if (tronWeb) {
      fetchData().catch(console.error);
    }
  }, []);

  const onTaskAdded = async () => {
    if (tronWeb) {
      const contract = await createTronContract();
      await contract.TaskAdded().watch((err, eventResult) => {
        if (err) {
          return console.error('Error with "method" event:', err);
        }
        if (eventResult) {
          setTasks((prevState) => [
            ...prevState,
            formatTask(eventResult.result.task),
          ]);
        }
      });
    }
  };

  useEffect(() => {
    onTaskAdded().catch(console.error);
  }, []);

  const onTaskUpdated = async () => {
    if (tronWeb) {
      const contract = await createTronContract();
      await contract.TaskUpdated().watch((err, eventResult) => {
        if (err) {
          return console.error('Error with "method" event:', err);
        }
        if (eventResult) {
          setTask(formatTask(eventResult.result.task));
        }
      });
    }
  };

  useEffect(() => {
    onTaskUpdated().catch(console.error);
  }, []);

  const onTaskDeleted = async () => {
    if (tronWeb) {
      const contract = await createTronContract();
      await contract.TaskDeleted().watch((err, eventResult) => {
        if (err) {
          return console.error('Error with "method" event:', err);
        }
        if (eventResult) {
          const id = parseInt(eventResult.result._id, 10);
          setTasks((current) => current.filter((p) => p.id !== id));
        }
      });
    }
  };

  useEffect(() => {
    onTaskDeleted().catch(console.error);
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        TaskTypes,
        task,
        getAllTasks,
        getTask,
        addTask,
        applyForTask,
        submitResult,
        deleteTask,
        assignTask,
        unassignTask,
        requestChange,
        completeTask,
        handleChange,
        formData,
        onUploadHandler,
        ipfsUrl,
        composeCandidateProfiles,
        composeAuthorProfile
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
