import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { networks } from "../utils/networks";

import { contractABI, contractAddress } from "../utils/constants";

export const PlatformContext = React.createContext();

const { ethereum } = window;
const address0 = "0x0000000000000000000000000000000000000000";

const ProjectType = {
  0: "First Come First Serve",
  1: "Author Selected",
};

const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const platformContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
  return platformContract;
};

function MessageDisplay({ message, hash }) {
  return (
    <div className="w-full">
      <p>{message}</p>
      <p>Transaction hash: </p>
      <a
        className="text-[#6366f1]"
        href={`https://mumbai.polygonscan.com/tx/${hash}`}
        target="_blank"
        rel="noreferrer"
      >
        {hash}
      </a>
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
  const [network, setNetwork] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState([]);
  const [fee, setFee] = useState(0);
  const [balance, setBalance] = useState(0);
  const [fetchedRating, setFetchedRating] = useState(0);

  const checkIfWalletIsConnected = async () => {
    if (!ethereum) {
      alert("Make sure you have MetaMask! -> https://metamask.io/");
      return;
    }
    console.log("We have the ethereum object", ethereum);
    // Check if we're authorized to access the user's wallet
    const accounts = await ethereum.request({ method: "eth_accounts" });
    // Users can have multiple authorized accounts, we grab the first one if its there!
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized accounts found");
    }
    const chainId = await ethereum.request({ method: "eth_chainId" });
    setNetwork(networks[chainId]);
    // Reload the page when they change networks
    function handleChainChanged() {
      window.location.reload();
    }
    ethereum.on("chainChanged", handleChainChanged);
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) {
        alert("Get MetaMask -> https://metamask.io/");
        return;
      }
      // Fancy method to request access to account.
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const switchNetwork = async () => {
    if (window.ethereum) {
      try {
        // Try to switch to the Mumbai testnet
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x13881" }], // Check networks.js for hexadecimal network ids
        });
      } catch (error) {
        // This error code means that the chain we want has not been added to MetaMask
        // In this case we ask the user to add it to their MetaMask
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x13881",
                  chainName: "Polygon Mumbai Testnet",
                  rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
                  nativeCurrency: {
                    name: "Mumbai Matic",
                    symbol: "MATIC",
                    decimals: 18,
                  },
                  blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
                },
              ],
            });
          } catch (err) {
            console.log(err);
          }
        }
        console.log(error);
      }
    } else {
      // If window.ethereum is not found then MetaMask is not installed
      alert(
        "MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html"
      );
    }
  };

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

  const getBalance = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const fetchedBalance = await provider.getBalance(currentAccount);
    const balanceInEth = ethers.utils.formatEther(fetchedBalance);
    setBalance(balanceInEth);
  };

  const getAllProjects = async () => {
    try {
      if (ethereum) {
        const platformContract = createEthereumContract();
        const availableProjects = await platformContract.getAllProjects();
        const structuredProjects = availableProjects.map((item) => ({
          id: item.id.toNumber(),
          title: item.title,
          description: item.description,
          projectType: ProjectType[item.projectType],
          createdAt: new Date(
            item.createdAt.toNumber() * 1000
          ).toLocaleString(),
          author: item.author,
          candidates: item.candidates,
          assignee: item.assignee === address0 ? "Unassigned" : item.assignee,
          completedAt:
            item.completedAt > 0
              ? new Date(item.completedAt.toNumber() * 1000).toLocaleString()
              : "Not completed yet",
          reward: parseInt(item.reward, 10) / 10 ** 18,
          result: item.result,
        }));
        setProjects(structuredProjects);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  const getPlatformFee = async () => {
    try {
      if (ethereum) {
        const platformContract = createEthereumContract();
        const fetchedFee = await platformContract.platformFeePercentage();
        setFee(fetchedFee);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  const getRating = async (address) => {
    try {
      if (ethereum) {
        const platformContract = createEthereumContract();
        const r = await platformContract.getRating(address);
        setFetchedRating(r);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  const getProject = async (id) => {
    try {
      if (ethereum) {
        const platformContract = createEthereumContract();
        const fetchedProject = await platformContract.getProject(id);
        const structuredProject = {
          id: fetchedProject.id.toNumber(),
          title: fetchedProject.title,
          description: fetchedProject.description,
          projectType: ProjectType[fetchedProject.projectType],
          createdAt: new Date(
            fetchedProject.createdAt.toNumber() * 1000
          ).toLocaleString(),
          author: fetchedProject.author.toString().toLowerCase(),
          candidates: fetchedProject.candidates,
          assignee:
            fetchedProject.assignee === address0
              ? "Unassigned"
              : fetchedProject.assignee.toString().toLowerCase(),
          completedAt:
            fetchedProject.completedAt > 0
              ? new Date(
                fetchedProject.completedAt.toNumber() * 1000
              ).toLocaleString()
              : "Not completed yet",
          reward: parseInt(fetchedProject.reward, 10) / 10 ** 18,
          result: fetchedProject.result,
        };
        setProject(structuredProject);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  const addProject = async () => {
    try {
      if (ethereum) {
        const { title, description, projectType, reward } = formData;
        const platformContract = createEthereumContract();
        const feeAmount = (reward / 100) * fee;
        const totalAmount = parseFloat(reward) + parseFloat(feeAmount);
        const transactionHash = await platformContract.addProject(
          {
            title,
            description,
            projectType,
            reward: ethers.utils.parseEther(reward),
          },
          {
            value: ethers.utils.parseEther(totalAmount.toString()),
          }
        );
        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);
        window.location.replace("/");
        notify("New task added.", transactionHash.hash);
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);
      alert("Oops! Something went wrong. See the browser console for details.");
    }
  };

  const applyForProject = async (id) => {
    try {
      if (ethereum) {
        const platformContract = createEthereumContract();
        const transactionHash = await platformContract.applyForProject(
          ethers.BigNumber.from(id)
        );
        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);
        const projectsList = await platformContract.getAllProjects();
        setProjects(projectsList);
        await getProject(id);
        notify("Successfully applied.", transactionHash.hash);
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);
      alert("Oops! Something went wrong. See the browser console for details.");
    }
  };

  const submitResult = async (id, result) => {
    try {
      if (ethereum) {
        const platformContract = createEthereumContract();
        const transactionHash = await platformContract.submitResult(
          ethers.BigNumber.from(id),
          result
        );
        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);
        const projectsList = await platformContract.getAllProjects();
        setProjects(projectsList);
        await getProject(id);
        notify("Result submitted.", transactionHash.hash);
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);
      alert("Oops! Something went wrong. See the browser console for details.");
    }
  };

  const deleteProject = async (id) => {
    try {
      if (ethereum) {
        const platformContract = createEthereumContract();
        const transactionHash = await platformContract.deleteProject(
          ethers.BigNumber.from(id)
        );
        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);
        const projectsList = await platformContract.getAllProjects();
        setProjects(projectsList);
        window.location.replace("/");
        notify("Task deleted.", transactionHash.hash);
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);
      alert("Oops! Something went wrong. See the browser console for details.");
    }
  };

  const assignProject = async (id, candidate) => {
    try {
      if (ethereum) {
        const platformContract = createEthereumContract();
        const transactionHash = await platformContract.assignProject(
          ethers.BigNumber.from(id),
          candidate
        );
        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);
        const projectsList = await platformContract.getAllProjects();
        setProjects(projectsList);
        await getProject(id);
        notify("Task assigned.", transactionHash.hash);
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);
      alert("Oops! Something went wrong. See the browser console for details.");
    }
  };

  const unassignProject = async (id) => {
    try {
      if (ethereum) {
        const platformContract = createEthereumContract();
        const transactionHash = await platformContract.unassignProject(
          ethers.BigNumber.from(id)
        );
        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);
        const projectsList = await platformContract.getAllProjects();
        setProjects(projectsList);
        await getProject(id);
        notify("Task unassigned.", transactionHash.hash);
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);
      alert("Oops! Something went wrong. See the browser console for details.");
    }
  };

  const completeProject = async (id, newRating) => {
    try {
      if (ethereum) {
        const platformContract = createEthereumContract();
        const transactionHash = await platformContract.completeProject(
          ethers.BigNumber.from(id),
          newRating
        );
        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);
        const projectsList = await platformContract.getAllProjects();
        setProjects(projectsList);
        await getProject(id);
        notify("Task completed.", transactionHash.hash);
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);
      alert("Oops! Something went wrong. See the browser console for details.");
    }
  };

  const handleProjectUpdatedEvent = () => {
    const platformContract = createEthereumContract();
    const onProjectUpdated = (p) => {
      const structuredProject = {
        id: p.id.toNumber(),
        title: p.title,
        description: p.description,
        projectType: ProjectType[p.projectType],
        createdAt: new Date(
          p.createdAt.toNumber() * 1000
        ).toLocaleString(),
        author: p.author.toString().toLowerCase(),
        candidates: p.candidates,
        assignee:
          p.assignee === address0
            ? "Unassigned"
            : p.assignee.toString().toLowerCase(),
        completedAt:
          p.completedAt > 0
            ? new Date(
              p.completedAt.toNumber() * 1000
            ).toLocaleString()
            : "Not completed yet",
        reward: parseInt(p.reward, 10) / 10 ** 18,
        result: p.result,
      };
      setProject(structuredProject);
    };
    if (ethereum) {
      platformContract.on("ProjectUpdated", onProjectUpdated);
    }
    return () => {
      if (platformContract) {
        platformContract.off("ProjectUpdated", onProjectUpdated);
      }
    };
  };

  // This will run any time currentAccount or network are changed
  useEffect(() => {
    checkIfWalletIsConnected();
    if (network === "Polygon Mumbai Testnet") {
      getBalance();
      getPlatformFee();
      getRating(currentAccount);
      getAllProjects();
    }
  }, [currentAccount, network]);

  useEffect(() => {
    const platformContract = createEthereumContract();
    const onNewTask = (task) => {
      setProjects((prevState) => [
        ...prevState,
        {
          id: task.id.toNumber(),
          title: task.title,
          description: task.description,
          projectType: ProjectType[task.projectType],
          createdAt: new Date(
            task.createdAt.toNumber() * 1000
          ).toLocaleString(),
          author: task.author,
          candidates: task.candidates,
          assignee:
            task.assignee === address0 ? "Unassigned" : task.assignee,
          completedAt:
            task.completedAt > 0
              ? new Date(task.completedAt.toNumber() * 1000).toLocaleString()
              : "Not completed yet",
          reward: parseInt(task.reward, 10) / 10 ** 18,
          result: task.result,
        },
      ]);
    };
    if (ethereum) {
      platformContract.on("ProjectAdded", onNewTask);
    }
    return () => {
      if (platformContract) {
        platformContract.off("ProjectAdded", onNewTask);
      }
    };
  }, []);

  useEffect(() => {
    const platformContract = createEthereumContract();
    const onTaskDeleted = (id) => {
      setProjects((current) => current.filter((p) => p.id !== id));
    };
    if (ethereum) {
      platformContract.on("ProjectDeleted", onTaskDeleted);
    }
    return () => {
      if (platformContract) {
        platformContract.off("ProjectDeleted", onTaskDeleted);
      }
    };
  }, []);

  useEffect(() => {
    const platformContract = createEthereumContract();
    const onTaskDeleted = (id) => {
      setProjects((current) => current.filter((p) => p.id !== id.toNumber()));
    };
    if (ethereum) {
      platformContract.on("ProjectDeleted", onTaskDeleted);
    }
    return () => {
      if (platformContract) {
        platformContract.off("ProjectDeleted", onTaskDeleted);
      }
    };
  }, []);

  return (
    <PlatformContext.Provider
      value={{
        connectWallet,
        switchNetwork,
        network,
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
        handleProjectUpdatedEvent,
        formData,
        address0,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};
