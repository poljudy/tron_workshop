import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ethers } from "ethers";

import { contractAddress } from "../utils/constants";
import contractABI from "../utils/contractABI.json";

export const PlatformContext = createContext();

const { tronWeb } = window;
const address0 = "410000000000000000000000000000000000000000";
let contract;
const ProjectType = {
  0: "First Come First Serve",
  1: "Author Selected",
};

const getTronWeb = () => {
  // Obtain the tronweb object injected by tronLink
  const obj = setInterval(async () => {
    if (tronWeb && tronWeb.defaultAddress.base58) {
      clearInterval(obj);
      console.log("tronWeb successfully detected!");
    }
  }, 10);
};

const createTronContract = async () => {
  contract = await tronWeb.contract(contractABI, contractAddress);
};

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
    title: "",
    description: "",
    projectType: "0",
    reward: 0,
  });
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState("");
  const [project, setProject] = useState([]);
  const [fee, setFee] = useState(0);
  const [balance, setBalance] = useState(0);
  const [fetchedRating, setFetchedRating] = useState(0);

  const checkIfWalletIsConnected = async () => {
    if (tronWeb && tronWeb.defaultAddress.base58) {
      const account = await tronWeb.defaultAddress.base58;
      console.log("Yes, catch it:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized accounts found");
    }
  };

  const notify = (message, hash) =>
    toast.success(<MessageDisplay message={message} hash={hash} />, {
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

  const getBalance = async () => {
    const b = await tronWeb.trx.getBalance(currentAccount);
    setBalance(tronWeb.fromSun(b));
  };

  const getAllProjects = async () => {
    try {
      if (tronWeb) {
        setIsLoading(true);
        const availableProjects = await contract.getAllProjects().call();
        const structuredProjects = availableProjects
          .filter((item) => item.title && item.title !== "")
          .map((item) => ({
            id: item.id.toNumber(),
            title: item.title,
            description: item.description,
            projectType: ProjectType[item.projectType],
            createdAt: new Date(
              item.createdAt.toNumber() * 1000
            ).toLocaleString(),
            author: tronWeb.address.fromHex(item.author),
            candidates: item.candidates
              ? item.candidates.map((candidate) =>
                  tronWeb.address.fromHex(candidate)
                )
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
          }));
        setProjects(structuredProjects);
        // localStorage.setItem("projects", JSON.stringify(structuredProjects));
        setIsLoading(false);
      } else {
        console.log("Tron is not present");
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  const getPlatformFee = async () => {
    try {
      if (tronWeb) {
        console.log("contract: ", contract);
        const fetchedFee = await contract.platformFeePercentage().call();
        console.log("fee: ", fetchedFee);
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
      if (tronWeb) {
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
    try {
      if (tronWeb) {
        setIsLoading(true);
        const fetchedProject = await contract.getProject(id).call();
        const structuredProject = {
          id: fetchedProject.id.toNumber(),
          title: fetchedProject.title,
          description: fetchedProject.description,
          projectType: ProjectType[fetchedProject.projectType],
          createdAt: new Date(
            fetchedProject.createdAt.toNumber() * 1000
          ).toLocaleString(),
          author: tronWeb.address.fromHex(fetchedProject.author),
          candidates: fetchedProject.candidates
            ? fetchedProject.candidates.map((candidate) =>
                tronWeb.address.fromHex(candidate)
              )
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
        };
        setProject(structuredProject);
        // localStorage.setItem("project", JSON.stringify(structuredProject));
        setIsLoading(false);
      } else {
        console.log("Tron is not present");
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  const addProject = async () => {
    try {
      if (tronWeb) {
        const { title, description, projectType, reward } = formData;
        const feeAmount = (reward / 100) * fee;
        const totalAmount = parseFloat(reward) + parseFloat(feeAmount);
        const projectToSend = [
          title,
          description,
          projectType,
          tronWeb.toSun(reward),
        ];
        setIsLoading(true);
        const transaction = await contract.addProject(projectToSend).send({
          feeLimit: 1000_000_000,
          callValue: tronWeb.toSun(totalAmount),
          shouldPollResponse: true,
        });
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        window.location.replace("/");
        notify("New task added successfully.");
      } else {
        console.log("No Tron object");
      }
    } catch (error) {
      console.log(error);
      alert("Oops! Something went wrong. See the browser console for details.");
    }
  };

  const applyForProject = async (id) => {
    try {
      if (tronWeb) {
        setIsLoading(true);
        const transaction = await contract
          .applyForProject(ethers.BigNumber.from(id))
          .send({
            feeLimit: 100_000_000,
            callValue: 0,
            shouldPollResponse: true,
          });
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        const projectsList = await getAllProjects();
        setProjects(projectsList);
        await getProject(id);
        notify("Successfully applied.");
      } else {
        console.log("No Tron object");
      }
    } catch (error) {
      console.log(error);
      alert("Oops! Something went wrong. See the browser console for details.");
    }
  };

  const submitResult = async (id, result) => {
    try {
      if (tronWeb) {
        setIsLoading(true);
        const transaction = await contract
          .submitResult(ethers.BigNumber.from(id), result)
          .send({
            feeLimit: 100_000_000,
            callValue: 0,
            shouldPollResponse: true,
          });
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        const projectsList = await getAllProjects();
        setProjects(projectsList);
        await getProject(id);
        notify("Result submitted successfully.");
      } else {
        console.log("No Tron object");
      }
    } catch (error) {
      console.log(error);
      alert("Oops! Something went wrong. See the browser console for details.");
    }
  };

  const deleteProject = async (id) => {
    try {
      if (tronWeb) {
        setIsLoading(true);
        const transaction = await contract
          .deleteProject(ethers.BigNumber.from(id))
          .send({
            feeLimit: 100_000_000,
            callValue: 0,
            shouldPollResponse: true,
          });
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        const projectsList = await getAllProjects();
        setProjects(projectsList);
        window.location.replace("/");
        notify("Task deleted successfully.");
      } else {
        console.log("No Tron object");
      }
    } catch (error) {
      console.log(error);
      alert("Oops! Something went wrong. See the browser console for details.");
    }
  };

  const assignProject = async (id, candidate) => {
    try {
      if (tronWeb) {
        setIsLoading(true);
        const transaction = await contract
          .assignProject(ethers.BigNumber.from(id), candidate)
          .send({
            feeLimit: 100_000_000,
            callValue: 0,
            shouldPollResponse: true,
          });
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        const projectsList = await getAllProjects();
        setProjects(projectsList);
        await getProject(id);
        notify("Task assigned.");
      } else {
        console.log("No TRon object");
      }
    } catch (error) {
      console.log(error);
      alert("Oops! Something went wrong. See the browser console for details.");
    }
  };

  const unassignProject = async (id) => {
    try {
      if (tronWeb) {
        setIsLoading(true);
        const transaction = await contract
          .unassignProject(ethers.BigNumber.from(id))
          .send({
            feeLimit: 100_000_000,
            callValue: 0,
            shouldPollResponse: true,
          });
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        const projectsList = await getAllProjects();
        setProjects(projectsList);
        await getProject(id);
        notify("Task unassigned.");
      } else {
        console.log("No Tron object");
      }
    } catch (error) {
      console.log(error);
      alert("Oops! Something went wrong. See the browser console for details.");
    }
  };

  const completeProject = async (id, newRating) => {
    try {
      if (tronWeb) {
        setIsLoading(true);
        const transaction = await contract
          .completeProject(ethers.BigNumber.from(id), newRating)
          .send({
            feeLimit: 100_000_000,
            callValue: 0,
            shouldPollResponse: true,
          });
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        const projectsList = await getAllProjects();
        setProjects(projectsList);
        await getProject(id);
        notify("Task completed.");
      } else {
        console.log("No Tron object");
      }
    } catch (error) {
      console.log(error);
      alert("Oops! Something went wrong. See the browser console for details.");
    }
  };

  const handleProjectAddedEvent = async () => {
    await contract.ProjectAdded().watch((err, eventResult) => {
      if (err) {
        return console.error('Error with "method" event:', err);
      }
      if (eventResult) {
        console.log("eventResult:", eventResult);
        setProjects((prevState) => [
          ...prevState,
          {
            id: eventResult.id.toNumber(),
            title: eventResult.title,
            description: eventResult.description,
            projectType: ProjectType[eventResult.projectType],
            createdAt: new Date(
              eventResult.createdAt.toNumber() * 1000
            ).toLocaleString(),
            author: eventResult.author,
            candidates: eventResult.candidates,
            assignee: eventResult.assignee === address0 ? "Unassigned" : eventResult.assignee,
            completedAt:
            eventResult.completedAt > 0
                ? new Date(eventResult.completedAt.toNumber() * 1000).toLocaleString()
                : "Not completed yet",
            reward: parseInt(eventResult.reward, 10) / 10 ** 18,
            result: eventResult.result,
          },
        ]);
      }
    });
  };

  const handleProjectUpdatedEvent = async () => {
    await contract.ProjectUpdated().watch((err, eventResult) => {
      if (err) {
        return console.error('Error with "method" event:', err);
      }
      if (eventResult) {
        console.log("eventResult:", eventResult);
        const structuredProject = {
          id: eventResult.id.toNumber(),
          title: eventResult.title,
          description: eventResult.description,
          projectType: ProjectType[eventResult.projectType],
          createdAt: new Date(
            eventResult.createdAt.toNumber() * 1000
          ).toLocaleString(),
          author: tronWeb.address.fromHex(eventResult.author),
          candidates: eventResult.candidates
            ? eventResult.candidates.map((candidate) =>
                tronWeb.address.fromHex(candidate)
              )
            : [],
          assignee:
            eventResult.assignee === address0
              ? "Unassigned"
              : tronWeb.address.fromHex(eventResult.assignee),
          completedAt:
            eventResult.completedAt > 0
              ? new Date(
                  eventResult.completedAt.toNumber() * 1000
                ).toLocaleString()
              : "Not completed yet",
          reward: parseInt(eventResult.reward, 10) / 10 ** 18,
          result: eventResult.result,
        };
        setProject(structuredProject);
      }
    });
  };

  const handleProjectDeletedEvent = async () => {
    await contract.ProjectDeleted().watch((err, eventResult) => {
      if (err) {
        return console.error('Error with "method" event:', err);
      }
      if (eventResult) {
        console.log("eventResult:", eventResult);
        setProjects((current) => current.filter((p) => p.id !== eventResult.toNumber()));
      }
    });
  };

  const handleFeeUpdatedEvent = async () => {
    await contract.FeeUpdated().watch((err, eventResult) => {
      if (err) {
        return console.error('Error with "method" event:', err);
      }
      if (eventResult) {
        console.log("eventResult:", eventResult);
        setFee(eventResult.toNumber());
      }
    });
  };

  // This will run any time currentAccount changed
  useEffect(() => {
    getTronWeb();
    // Wait a while to ensure tronweb object has already injected
    setTimeout(async () => {
      // init contract object
      setIsLoading(true);
      await createTronContract();
      await checkIfWalletIsConnected();
      await getPlatformFee();
      await getBalance();
      await getRating(currentAccount);
      await getAllProjects();
      setIsLoading(false);
    }, 1000);
  }, [currentAccount]);

  useEffect(() => {
    setTimeout(async () => {
      await handleProjectAddedEvent();
      await handleProjectUpdatedEvent();
      await handleProjectDeletedEvent();
      await handleFeeUpdatedEvent();
    }, 100);
  }, []);

  return (
    <PlatformContext.Provider
      value={{
        fee,
        projects,
        project,
        currentAccount,
        balance,
        isLoading,
        getAllProjects,
        getProject,
        addProject,
        applyForProject,
        submitResult,
        deleteProject,
        assignProject,
        unassignProject,
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
