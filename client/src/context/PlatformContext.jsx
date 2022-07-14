import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ethers } from "ethers";
// import { networks } from "../utils/networks";

import { contractAddress } from "../utils/constants";
import contractABI from "../utils/contractABI.json";

export const PlatformContext = React.createContext();

const { tronWeb, tronLink } = window;
const address0 = "0x0000000000000000000000000000000000000000";
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

// const createEthereumContract = () => {
//   const provider = new ethers.providers.Web3Provider(tronWeb);
//   const signer = provider.getSigner();
//   const platformContract = new ethers.Contract(
//     contractAddress,
//     contractABI,
//     signer
//   );
//   return platformContract;
// };

function MessageDisplay({ message, hash }) {
  return (
    <div className="w-full">
      <p>{message}</p>
      <p>Transaction hash: </p>
      <a
        className="text-[#6366f1]"
        href={`https://nile.tronscan.org/#/transaction/${hash}`}
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

  async function handleTronLink() {
    if (tronLink) {
      console.log("tronLink successfully detected!");
      const accounts = await tronLink.request({
        method: "tron_requestAccounts",
      });
      console.log(accounts);
      // Access the decentralized web!
    } else {
      console.log("Please install TronLink-Extension!");
    }
  }

  const checkIfWalletIsConnected = async () => {
    if (tronWeb && tronWeb.defaultAddress.base58) {
      const account = await tronWeb.defaultAddress.base58;
      console.log("Yes, catch it:", account);
      setCurrentAccount(account);
      // Tronlink Sending Code
      window.dispatchEvent(new Event("tronLink#initialized"));
      // Example
      // Suggested reception method
      if (tronLink) {
        handleTronLink();
      } else {
        window.addEventListener("tronLink#initialized", handleTronLink, {
          once: true,
        });
        // If the event is not dispatched by the end of the timeout,
        // the user probably doesn't have TronLink installed.
        setTimeout(handleTronLink, 3000); // 3 seconds
      }
    } else {
      console.log("No authorized accounts found");
    }
    //   const chainId = await tronWeb.request({ method: "eth_chainId" });
    //   setNetwork(networks[chainId]);
    //   // Reload the page when they change networks
    //   function handleChainChanged() {
    //     window.location.reload();
    //   }
    //   tronWeb.on("chainChanged", handleChainChanged);
  };

  // const checkIfWalletIsConnected = async () => {
  //   if (!tronWeb) {
  //     alert("Make sure you have TronLink! -> https://www.tronlink.org/");
  //     return;
  //   }
  //   console.log("We have the tron object", tronWeb);
  //   // Check if we're authorized to access the user's wallet
  //   const accounts = await tronWeb.request({ method: "eth_accounts" });
  //   // Users can have multiple authorized accounts, we grab the first one if its there!
  //   if (accounts.length !== 0) {
  //     const account = accounts[0];
  //     console.log("Found an authorized account:", account);
  //     setCurrentAccount(account);
  //   } else {
  //     console.log("No authorized accounts found");
  //   }
  //   const chainId = await tronWeb.request({ method: "eth_chainId" });
  //   setNetwork(networks[chainId]);
  //   // Reload the page when they change networks
  //   function handleChainChanged() {
  //     window.location.reload();
  //   }
  //   tronWeb.on("chainChanged", handleChainChanged);
  // };

  // const connectWallet = async () => {
  //   try {
  //     if (!tronWeb) {
  //       alert("Get MetaMask -> https://metamask.io/");
  //       return;
  //     }
  //     // Fancy method to request access to account.
  //     const accounts = await tronWeb.request({
  //       method: "eth_requestAccounts",
  //     });
  //     console.log("Connected", accounts[0]);
  //     setCurrentAccount(accounts[0]);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const switchNetwork = async () => {
  //   if (window.ethereum) {
  //     try {
  //       // Try to switch to the Mumbai testnet
  //       await window.ethereum.request({
  //         method: "wallet_switchEthereumChain",
  //         params: [{ chainId: "0x13881" }], // Check networks.js for hexadecimal network ids
  //       });
  //     } catch (error) {
  //       // This error code means that the chain we want has not been added to MetaMask
  //       // In this case we ask the user to add it to their MetaMask
  //       if (error.code === 4902) {
  //         try {
  //           await window.ethereum.request({
  //             method: "wallet_addEthereumChain",
  //             params: [
  //               {
  //                 chainId: "0x13881",
  //                 chainName: "Polygon Mumbai Testnet",
  //                 rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
  //                 nativeCurrency: {
  //                   name: "Mumbai Matic",
  //                   symbol: "MATIC",
  //                   decimals: 18,
  //                 },
  //                 blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
  //               },
  //             ],
  //           });
  //         } catch (err) {
  //           console.log(err);
  //         }
  //       }
  //       console.log(error);
  //     }
  //   } else {
  //     // If window.ethereum is not found then MetaMask is not installed
  //     alert(
  //       "MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html"
  //     );
  //   }
  // };

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
    // const provider = new ethers.providers.Web3Provider(tronWeb);
    // const fetchedBalance = await provider.getBalance(currentAccount);
    // const balanceInEth = ethers.utils.formatEther(fetchedBalance);
    setBalance(b / 1000000);
  };

  const getAllProjects = async () => {
    try {
      if (tronWeb) {
        const availableProjects = await contract.getAllProjects().call();
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
        const fetchedProject = await contract.getProject(id).call();
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
        const transactionHash = await contract.addProject(
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
        const transactionHash = await contract.applyForProject(
          ethers.BigNumber.from(id)
        );
        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);
        const projectsList = await contract.getAllProjects();
        setProjects(projectsList);
        await getProject(id);
        notify("Successfully applied.", transactionHash.hash);
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
        const transactionHash = await contract.submitResult(
          ethers.BigNumber.from(id),
          result
        );
        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);
        const projectsList = await contract.getAllProjects();
        setProjects(projectsList);
        await getProject(id);
        notify("Result submitted.", transactionHash.hash);
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
        const transactionHash = await contract.deleteProject(
          ethers.BigNumber.from(id)
        );
        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);
        const projectsList = await contract.getAllProjects();
        setProjects(projectsList);
        window.location.replace("/");
        notify("Task deleted.", transactionHash.hash);
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
        const transactionHash = await contract.assignProject(
          ethers.BigNumber.from(id),
          candidate
        );
        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);
        const projectsList = await contract.getAllProjects();
        setProjects(projectsList);
        await getProject(id);
        notify("Task assigned.", transactionHash.hash);
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
        const transactionHash = await contract.unassignProject(
          ethers.BigNumber.from(id)
        );
        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);
        const projectsList = await contract.getAllProjects();
        setProjects(projectsList);
        await getProject(id);
        notify("Task unassigned.", transactionHash.hash);
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
        const transactionHash = await contract.completeProject(
          ethers.BigNumber.from(id),
          newRating
        );
        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);
        const projectsList = await contract.getAllProjects();
        setProjects(projectsList);
        await getProject(id);
        notify("Task completed.", transactionHash.hash);
      } else {
        console.log("No Tron object");
      }
    } catch (error) {
      console.log(error);
      alert("Oops! Something went wrong. See the browser console for details.");
    }
  };

  // const handleProjectUpdatedEvent = () => {
  //   const platformContract = createTronContract();
  //   const onProjectUpdated = (p) => {
  //     const structuredProject = {
  //       id: p.id.toNumber(),
  //       title: p.title,
  //       description: p.description,
  //       projectType: ProjectType[p.projectType],
  //       createdAt: new Date(
  //         p.createdAt.toNumber() * 1000
  //       ).toLocaleString(),
  //       author: p.author.toString().toLowerCase(),
  //       candidates: p.candidates,
  //       assignee:
  //         p.assignee === address0
  //           ? "Unassigned"
  //           : p.assignee.toString().toLowerCase(),
  //       completedAt:
  //         p.completedAt > 0
  //           ? new Date(
  //             p.completedAt.toNumber() * 1000
  //           ).toLocaleString()
  //           : "Not completed yet",
  //       reward: parseInt(p.reward, 10) / 10 ** 18,
  //       result: p.result,
  //     };
  //     setProject(structuredProject);
  //   };
  //   if (tronWeb) {
  //     platformContract.on("ProjectUpdated", onProjectUpdated);
  //   }
  //   return () => {
  //     if (platformContract) {
  //       platformContract.off("ProjectUpdated", onProjectUpdated);
  //     }
  //   };
  // };

  // This will run any time currentAccount changed
  useEffect(() => {
    getTronWeb();
    // Wait a while to ensure tronweb object has already injected
    setTimeout(async () => {
      // init contract object
      await createTronContract();
      await getPlatformFee();
      await getBalance();
      // await getRating(currentAccount);
      // await getAllProjects();
    }, 500);
    checkIfWalletIsConnected();
  }, [currentAccount]);

  // useEffect(() => {
  //   const platformContract = createTronContract();
  //   const onNewTask = (task) => {
  //     setProjects((prevState) => [
  //       ...prevState,
  //       {
  //         id: task.id.toNumber(),
  //         title: task.title,
  //         description: task.description,
  //         projectType: ProjectType[task.projectType],
  //         createdAt: new Date(
  //           task.createdAt.toNumber() * 1000
  //         ).toLocaleString(),
  //         author: task.author,
  //         candidates: task.candidates,
  //         assignee:
  //           task.assignee === address0 ? "Unassigned" : task.assignee,
  //         completedAt:
  //           task.completedAt > 0
  //             ? new Date(task.completedAt.toNumber() * 1000).toLocaleString()
  //             : "Not completed yet",
  //         reward: parseInt(task.reward, 10) / 10 ** 18,
  //         result: task.result,
  //       },
  //     ]);
  //   };
  //   if (tronWeb) {
  //     // platformContract.on("ProjectAdded", onNewTask);
  //   }
  //   return () => {
  //     if (platformContract) {
  //       // platformContract.off("ProjectAdded", onNewTask);
  //     }
  //   };
  // }, []);

  // useEffect(() => {
  //   const platformContract = createTronContract();
  //   const onTaskDeleted = (id) => {
  //     setProjects((current) => current.filter((p) => p.id !== id));
  //   };
  //   if (tronWeb) {
  //     // platformContract.on("ProjectDeleted", onTaskDeleted);
  //   }
  //   return () => {
  //     if (platformContract) {
  //       // platformContract.off("ProjectDeleted", onTaskDeleted);
  //     }
  //   };
  // }, []);

  // useEffect(() => {
  //   const platformContract = createTronContract();
  //   const onTaskDeleted = (id) => {
  //     setProjects((current) => current.filter((p) => p.id !== id.toNumber()));
  //   };
  //   if (tronWeb) {
  //     // platformContract.on("ProjectDeleted", onTaskDeleted);
  //   }
  //   return () => {
  //     if (platformContract) {
  //       // platformContract.off("ProjectDeleted", onTaskDeleted);
  //     }
  //   };
  // }, []);

  return (
    <PlatformContext.Provider
      value={{
        // connectWallet,
        // switchNetwork,
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
        // handleProjectUpdatedEvent,
        formData,
        address0,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};
