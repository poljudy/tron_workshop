import { createContext, useEffect, useState, useContext } from "react";
// import { toast } from "react-toastify";
import { ethers } from "ethers";
import { AuthContext } from "./AuthContext";
import { contractAddress, TaskTypes, address0, Statuses } from "../utils/constants";
import contractABI from "../utils/contractABI.json";
import { PlatformContext } from "./PlatformContext";
// import MessageDisplay from "./PlatformContext";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [formData, setformData] = useState({
    category: "Programming & Tech",
    title: "",
    description: "",
    taskType: "0",
    reward: 0,
  });
//   const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState("");
  const [task, setTask] = useState([]);
//   const [fee, setFee] = useState(0);
//   const [fetchedRating, setFetchedRating] = useState(0);
  // const [contract, setContract] = useState(undefined);
  const { currentAccount, tronWeb } = useContext(AuthContext);
  // const { tronWeb } = window;
  const { notify, fee, setIsLoading } = useContext(PlatformContext);

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const createTronContract = async () => {
    const c = await tronWeb.contract(contractABI, contractAddress);
    return c;
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
      ).toLocaleString(),
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
          ).toLocaleString()
          : "Not completed yet",
      reward: tronWeb.fromSun(t.reward),
      result: t.result,
      status: Statuses[t.status],
      lastStatusChangeAt: new Date(
        t.lastStatusChangeAt.toNumber() * 1000
      ).toLocaleString(),
      changeRequests: t.changeRequests,
    });
  }

  const getAllTasks = async () => {
    try {
      if (tronWeb) {
        setIsLoading(true);
        const contract = await createTronContract();
        const availableTasks = await contract.getAllTasks().call();
        console.log(availableTasks);
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
      alert(error.message);
      setIsLoading(false);
    }
  };

  const getTask = async (id) => {
    if (tronWeb) {
      try {
        setIsLoading(true);
        const contract = await createTronContract();
        const fetchedTask = await contract.getTask(id).call();
        console.log(fetchedTask);
        setTask(formatTask(fetchedTask));
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        alert(error.message);
        setIsLoading(false);
      }
    } else {
      console.log("Tron is not present");
    }
  };

  const addTask = async () => {
    if (tronWeb) {
      try {
        const { category, title, description, taskType, reward } = formData;
        const feeAmount = (reward / 100) * fee;
        const totalAmount = parseFloat(reward) + parseFloat(feeAmount);
        const taskToSend = [
          category,
          title,
          description,
          taskType,
          tronWeb.toSun(reward),
        ];
        setIsLoading(true);
        const contract = await createTronContract();
        const transaction = await contract.addTask(taskToSend).send({
          feeLimit: 1000_000_000,
          callValue: tronWeb.toSun(totalAmount),
          shouldPollResponse: true,
        });
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        window.location.replace("/");
        notify("New task added successfully.");
      } catch (error) {
        console.log(error);
        alert(
          "Oops! Something went wrong. See the browser console for details."
        );
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
          shouldPollResponse: true,
        });
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        await getAllTasks();
        await getTask(id);
        notify("Successfully applied.");
      } catch (error) {
        console.log(error);
        alert(
          "Oops! Something went wrong. See the browser console for details."
        );
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
            shouldPollResponse: true,
          });
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        await getAllTasks();
        await getTask(id);
        notify("Result submitted successfully.");
      } catch (error) {
        console.log(error);
        alert(
          "Oops! Something went wrong. See the browser console for details."
        );
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
            shouldPollResponse: true,
          });
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        await getAllTasks();
        notify("Task deleted successfully.");
        window.location.replace("/");
      } catch (error) {
        console.log(error);
        alert(
          "Oops! Something went wrong. See the browser console for details."
        );
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
            shouldPollResponse: true,
          });
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        await getAllTasks();
        await getTask(id);
        notify("Task assigned.");
      } catch (error) {
        console.log(error);
        alert(
          "Oops! Something went wrong. See the browser console for details."
        );
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
            shouldPollResponse: true,
          });
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        await getAllTasks();
        await getTask(id);
        notify("Task unassigned.");
      } catch (error) {
        console.log(error);
        alert(
          "Oops! Something went wrong. See the browser console for details."
        );
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
            shouldPollResponse: true,
          });
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        await getAllTasks();
        await getTask(id);
        notify("Change reaquest submitted.");
      } catch (error) {
        console.log(error);
        alert(
          "Oops! Something went wrong. See the browser console for details."
        );
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
            shouldPollResponse: true,
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
      alert("Oops! Something went wrong. See the browser console for details.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await createTronContract();
      await getAllTasks();
    };
    fetchData().catch(console.error);
  }, []);

  // Event listeners

  // TODO Fix events listenenrs later

  const onTaskAdded = async () => {
    const contract = await createTronContract();
    if (tronWeb) {
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
    const contract = await createTronContract();
    if (tronWeb) {
      await contract.TaskDeleted().watch((err, eventResult) => {
        if (err) {
          return console.error('Error with "method" event:', err);
        }
        if (eventResult) {
          console.log("eventResult:", eventResult);
          const id = eventResult.result.id.toNumber();
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
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
