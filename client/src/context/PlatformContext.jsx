import { createContext, useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { AuthContext } from "./AuthContext";
import { contractAddress, ProjectTypes, address0, Statuses } from "../utils/constants";
import contractABI from "../utils/contractABI.json";

export const PlatformContext = createContext();

function MessageDisplay({ message, hash }) {
  return (
    <div className="w-full">
      <p>{message}</p>
      {hash && (
        <a
          className="text-[#6366f1]"
          href={`https://nile.tronscan.org/#/transaction/${hash}`}
          target="_blank"
          rel="noreferrer"
        >
          Check in tronscan
        </a>
      )}
    </div>
  );
}

export const PlatformProvider = ({ children }) => {
  const [formData, setformData] = useState({
    category: "Programming & Tech",
    title: "",
    description: "",
    projectType: "0",
    reward: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState("");
  const [project, setProject] = useState([]);
  const [fee, setFee] = useState(0);
  const [fetchedRating, setFetchedRating] = useState(0);
  // const [contract, setContract] = useState(undefined);
  const { currentAccount } = useContext(AuthContext);
  const { tronWeb } = window;

  const notify = (message, hash) => toast.success(<MessageDisplay message={message} hash={hash} />, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const createTronContract = async () => {
    const c = await tronWeb.contract(contractABI, contractAddress);
    return c;
  };

  const getAllProjects = async () => {
    try {
      if (tronWeb) {
        setIsLoading(true);
        const contract = await createTronContract();
        const availableProjects = await contract.getAllProjects().call();
        console.log(availableProjects);
        const structuredProjects = availableProjects
          .filter((item) => item.title && item.title !== "")
          .map((item) => ({
            id: item.id.toNumber(),
            category: item.category,
            title: item.title,
            description: item.description,
            projectType: ProjectTypes[item.projectType],
            createdAt: new Date(
              item.createdAt.toNumber() * 1000
            ).toLocaleString(),
            author: tronWeb.address.fromHex(item.author),
            candidates: item.candidates
              ? item.candidates.map((c) => tronWeb.address.fromHex(c.candidate))
              : [],
            assignee:
              item.assignee === address0
                ? "Unassigned"
                : tronWeb.address.fromHex(item.assignee),
            completedAt:
              item.completedAt > 0
                ? new Date(item.completedAt.toNumber() * 1000).toLocaleString()
                : "Not completed yet",
            reward: tronWeb.fromSun(item.reward),
            result: item.result,
            status: Statuses[item.status],
          }));
        setProjects(structuredProjects);
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

  const getPlatformFee = async () => {
    try {
      if (tronWeb) {
        const contract = await createTronContract();
        const fetchedFee = await contract.platformFeePercentage().call();
        setFee(fetchedFee);
      } else {
        console.log("Tron is not present");
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  const getRating = async (address) => {
    try {
      if (tronWeb && address) {
        const contract = await createTronContract();
        const r = await contract.getRating(address).call();
        setFetchedRating(r);
      } else {
        console.log("Tron is not present");
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  const getProject = async (id) => {
    if (tronWeb) {
      try {
        setIsLoading(true);
        const contract = await createTronContract();
        const fetchedProject = await contract.getProject(id).call();
        console.log(fetchedProject);
        const structuredProject = {
          id: fetchedProject.id.toNumber(),
          category: fetchedProject.category,
          title: fetchedProject.title,
          description: fetchedProject.description,
          projectType: ProjectTypes[fetchedProject.projectType],
          createdAt: new Date(
            fetchedProject.createdAt.toNumber() * 1000
          ).toLocaleString(),
          author: tronWeb.address.fromHex(fetchedProject.author),
          candidates:
            fetchedProject.candidates.length > 0
              ? fetchedProject.candidates.map((c) => tronWeb.address.fromHex(c))
              : [],
          assignee:
            fetchedProject.assignee === address0
              ? "Unassigned"
              : tronWeb.address.fromHex(fetchedProject.assignee),
          completedAt:
            fetchedProject.completedAt > 0
              ? new Date(
                fetchedProject.completedAt.toNumber() * 1000
              ).toLocaleString()
              : "Not completed yet",
          reward: tronWeb.fromSun(fetchedProject.reward),
          result: fetchedProject.result,
          status: Statuses[fetchedProject.status],
          lastStatusChangeAt: new Date(
            fetchedProject.lastStatusChangeAt.toNumber() * 1000
          ).toLocaleString(),
          changeRequests: fetchedProject.changeRequests,
        };
        setProject(structuredProject);
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

  const addProject = async () => {
    if (tronWeb) {
      try {
        const { category, title, description, projectType, reward } = formData;
        const feeAmount = (reward / 100) * fee;
        const totalAmount = parseFloat(reward) + parseFloat(feeAmount);
        const projectToSend = [
          category,
          title,
          description,
          projectType,
          tronWeb.toSun(reward),
        ];
        setIsLoading(true);
        const contract = await createTronContract();
        const transaction = await contract.addProject(projectToSend).send({
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

  const applyForProject = async (id) => {
    if (tronWeb) {
      try {
        setIsLoading(true);
        const bnId = ethers.BigNumber.from(id);
        const contract = await createTronContract();
        const transaction = await contract.applyForProject(bnId).send({
          feeLimit: 100_000_000,
          callValue: 0,
          shouldPollResponse: true,
        });
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        await getAllProjects();
        await getProject(id);
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
        await getAllProjects();
        await getProject(id);
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

  const deleteProject = async (id) => {
    if (tronWeb) {
      try {
        setIsLoading(true);
        const contract = await createTronContract();
        const transaction = await contract
          .deleteProject(ethers.BigNumber.from(id))
          .send({
            feeLimit: 100_000_000,
            callValue: 0,
            shouldPollResponse: true,
          });
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        await getAllProjects();
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

  const assignProject = async (id, candidate) => {
    if (tronWeb) {
      try {
        setIsLoading(true);
        const contract = await createTronContract();
        const transaction = await contract
          .assignProject(ethers.BigNumber.from(id), candidate)
          .send({
            feeLimit: 100_000_000,
            callValue: 0,
            shouldPollResponse: true,
          });
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        await getAllProjects();
        await getProject(id);
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

  const unassignProject = async (id) => {
    if (tronWeb) {
      try {
        setIsLoading(true);
        const contract = await createTronContract();
        const transaction = await contract
          .unassignProject(ethers.BigNumber.from(id))
          .send({
            feeLimit: 100_000_000,
            callValue: 0,
            shouldPollResponse: true,
          });
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        await getAllProjects();
        await getProject(id);
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
        await getAllProjects();
        await getProject(id);
        notify("Change reaquest submitted.");
      } catch (error) {
        console.log(error);
        alert(
          "Oops! Something went wrong. See the browser console for details."
        );
      }
    } else {
      console.log("No Tron object");
    }
  };

  const completeProject = async (id, newRating) => {
    try {
      if (tronWeb) {
        setIsLoading(true);
        const contract = await createTronContract();
        const transaction = await contract
          .completeProject(ethers.BigNumber.from(id), newRating)
          .send({
            feeLimit: 100_000_000,
            callValue: 0,
            shouldPollResponse: true,
          });
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        await getAllProjects();
        await getProject(id);
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
      await getAllProjects();
      await getPlatformFee();
    };
    fetchData().catch(console.error);
  }, []);

  useEffect(() => {
    getRating(currentAccount);
  }, [currentAccount]);

  // Events listeners

  // TODO Fix events listenenrs later

  const onTaskAdded = async () => {
    const contract = await createTronContract();
    if (tronWeb) {
      await contract.ProjectAdded().watch((err, eventResult) => {
        if (err) {
          return console.error('Error with "method" event:', err);
        }
        if (eventResult) {
          console.log("eventResult:", eventResult);
          const p = eventResult.result.project;
          setProjects((prevState) => [
            ...prevState,
            {
              id: p.id.toNumber(),
              category: p.category,
              title: p.title,
              description: p.description,
              projectType: ProjectTypes[p.projectType],
              createdAt: new Date(
                p.createdAt.toNumber() * 1000
              ).toLocaleString(),
              author: tronWeb.address.fromHex(p.author),
              candidates:
                p.candidates.length > 0
                  ? p.candidates.map((c) => tronWeb.address.fromHex(c))
                  : [],
              assignee:
                p.assignee === address0
                  ? "Unassigned"
                  : tronWeb.address.fromHex(p.assignee),
              completedAt:
                p.completedAt > 0
                  ? new Date(
                    p.completedAt.toNumber() * 1000
                  ).toLocaleString()
                  : "Not completed yet",
              reward: tronWeb.fromSun(p.reward),
              result: p.result,
              status: Statuses[p.status],
              lastStatusChangeAt: new Date(
                p.lastStatusChangeAt.toNumber() * 1000
              ).toLocaleString(),
              changeRequests: p.changeRequests,
            },
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
      await contract.ProjectUpdated().watch((err, eventResult) => {
        if (err) {
          return console.error('Error with "method" event:', err);
        }
        if (eventResult) {
          console.log("eventResult:", eventResult);
          const p = eventResult.result.project;
          const structuredProject = {
            id: p.id.toNumber(),
            category: p.category,
            title: p.title,
            description: p.description,
            projectType: ProjectTypes[p.projectType],
            createdAt: new Date(
              p.createdAt.toNumber() * 1000
            ).toLocaleString(),
            author: tronWeb.address.fromHex(p.author),
            candidates:
                p.candidates.length > 0
                  ? p.candidates.map((c) => tronWeb.address.fromHex(c))
                  : [],
            assignee:
                p.assignee === address0
                  ? "Unassigned"
                  : tronWeb.address.fromHex(p.assignee),
            completedAt:
                p.completedAt > 0
                  ? new Date(
                    p.completedAt.toNumber() * 1000
                  ).toLocaleString()
                  : "Not completed yet",
            reward: tronWeb.fromSun(p.reward),
            result: p.result,
            status: Statuses[p.status],
            lastStatusChangeAt: new Date(
              p.lastStatusChangeAt.toNumber() * 1000
            ).toLocaleString(),
            changeRequests: p.changeRequests,
          };
          setProject(structuredProject);
        }
      });
    }
  };

  useEffect(() => {
    onTaskUpdated().catch(console.error);
  }, []);

  const onFeeUpdated = async () => {
    const contract = await createTronContract();
    if (tronWeb) {
      await contract.FeeUpdated().watch((err, eventResult) => {
        if (err) {
          return console.error('Error with "method" event:', err);
        }
        if (eventResult) {
          console.log("eventResult:", eventResult);
          setFee(eventResult.result.fee.toNumber());
        }
      });
    }
  };

  useEffect(() => {
    onFeeUpdated().catch(console.error);
  }, []);

  const onTaskDeleted = async () => {
    const contract = await createTronContract();
    if (tronWeb) {
      await contract.ProjectDeleted().watch((err, eventResult) => {
        if (err) {
          return console.error('Error with "method" event:', err);
        }
        if (eventResult) {
          console.log("eventResult:", eventResult);
          const id = eventResult.result.id.toNumber();
          setProjects((current) => current.filter((p) => p.id !== id));
        }
      });
    }
  };

  useEffect(() => {
    onTaskDeleted().catch(console.error);
  }, []);

  return (
    <PlatformContext.Provider
      value={{
        fee,
        projects,
        ProjectTypes,
        project,
        currentAccount,
        isLoading,
        getAllProjects,
        getProject,
        addProject,
        applyForProject,
        submitResult,
        deleteProject,
        assignProject,
        unassignProject,
        requestChange,
        completeProject,
        handleChange,
        getRating,
        fetchedRating,
        formData,
        address0,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};
