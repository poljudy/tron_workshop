import { createContext, useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { AuthContext } from "./AuthContext";
import { contractAddress } from "../utils/constants";
import contractABI from "../utils/contractABI.json";

export const PlatformContext = createContext();

const address0 = "410000000000000000000000000000000000000000";
const ProjectType = {
  0: "First Come First Serve",
  1: "Author Selected",
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
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState("");
  const [project, setProject] = useState([]);
  const [fee, setFee] = useState(0);
  const [fetchedRating, setFetchedRating] = useState(0);
  // const [contract, setContract] = useState(undefined);
  const { tronWeb, currentAccount } = useContext(AuthContext);

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
            candidates: item[5]
              ? item[5].map((c) => {
                  const candidate = {
                    candidate: tronWeb.address.fromHex(c.candidate),
                    rating: c.rating,
                  };
                  return candidate;
                })
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
    try {
      if (tronWeb) {
        setIsLoading(true);
        const contract = await createTronContract();
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
          candidates: fetchedProject[5]
            ? fetchedProject[5].map((c) => {
                const candidate = {
                  candidate: tronWeb.address.fromHex(c.candidate),
                  rating: c.rating,
                };
                return candidate;
              })
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
      } else {
        console.log("No Tron object");
      }
    } catch (error) {
      console.log(error);
      alert("Oops! Something went wrong. See the browser console for details.");
      setIsLoading(false);
    }
  };

  const applyForProject = async (id) => {
    try {
      if (tronWeb) {
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
      } else {
        console.log("No Tron object");
      }
    } catch (error) {
      console.log(error);
      alert("Oops! Something went wrong. See the browser console for details.");
      setIsLoading(false);
    }
  };

  const submitResult = async (id, result) => {
    try {
      if (tronWeb) {
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
      } else {
        console.log("No Tron object");
      }
    } catch (error) {
      console.log(error);
      alert("Oops! Something went wrong. See the browser console for details.");
      setIsLoading(false);
    }
  };

  const deleteProject = async (id) => {
    try {
      if (tronWeb) {
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
      } else {
        console.log("No Tron object");
      }
    } catch (error) {
      console.log(error);
      alert("Oops! Something went wrong. See the browser console for details.");
      setIsLoading(false);
    }
  };

  const assignProject = async (id, candidate) => {
    try {
      if (tronWeb) {
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
      } else {
        console.log("No TRon object");
      }
    } catch (error) {
      console.log(error);
      alert("Oops! Something went wrong. See the browser console for details.");
      setIsLoading(false);
    }
  };

  const unassignProject = async (id) => {
    try {
      if (tronWeb) {
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
      } else {
        console.log("No Tron object");
      }
    } catch (error) {
      console.log(error);
      alert("Oops! Something went wrong. See the browser console for details.");
      setIsLoading(false);
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
    setTimeout(async () => {
      await createTronContract();
      await getAllProjects();
      await getPlatformFee();
    }, 100);
  }, []);

  useEffect(() => {
    getRating(currentAccount);
  }, [currentAccount]);

  // Events listeners

  // TODO Fix events listenenrs later
  // useEffect(() => {
  //   setInterval(async () => {
  //     const contract = await createTronContract();
  //     await contract.ProjectAdded().watch((err, eventResult) => {
  //       if (err) {
  //         return console.error('Error with "method" event:', err);
  //       }
  //       if (eventResult) {
  //         console.log("eventResult:", eventResult);
  //         setProjects((prevState) => [
  //           ...prevState,
  //           {
  //             id: eventResult.result._id.toNumber(),
  //             title: eventResult.result.title,
  //             description: eventResult.result.description,
  //             projectType: ProjectType[eventResult.result.projectType],
  //             createdAt: new Date(
  //               eventResult.result.createdAt.toNumber() * 1000
  //             ).toLocaleString(),
  //             author: eventResult.result.author,
  //             candidates: eventResult.result.candidates,
  //             assignee:
  //               eventResult.result.assignee === address0
  //                 ? "Unassigned"
  //                 : eventResult.result.assignee,
  //             completedAt:
  //               eventResult.result.completedAt > 0
  //                 ? new Date(
  //                     eventResult.result.completedAt.toNumber() * 1000
  //                   ).toLocaleString()
  //                 : "Not completed yet",
  //             reward: parseInt(eventResult.result.reward, 10) / 10 ** 18,
  //             result: eventResult.result.result,
  //           },
  //         ]);
  //       }
  //     });
  //   }, 1000);
  // }, []);

  // useEffect(async () => {
  //   const contract = await createTronContract();
  //   setInterval(async () => {
  //     await contract.ProjectUpdated().watch((err, eventResult) => {
  //       if (err) {
  //         return console.error('Error with "method" event:', err);
  //       }
  //       if (eventResult) {
  //         console.log("eventResult:", eventResult);
  //         const structuredProject = {
  //           id: eventResult.result.id.toNumber(),
  //           title: eventResult.result.title,
  //           description: eventResult.result.description,
  //           projectType: ProjectType[eventResult.result.projectType],
  //           createdAt: new Date(
  //             eventResult.result.createdAt.toNumber() * 1000
  //           ).toLocaleString(),
  //           author: tronWeb.address.fromHex(eventResult.result.author),
  //           candidates: eventResult.result.candidates
  //             ? eventResult.result.candidates.map((candidate) =>
  //                 tronWeb.address.fromHex(candidate)
  //               )
  //             : [],
  //           assignee:
  //             eventResult.result.assignee === address0
  //               ? "Unassigned"
  //               : tronWeb.address.fromHex(eventResult.result.assignee),
  //           completedAt:
  //             eventResult.result.completedAt > 0
  //               ? new Date(
  //                   eventResult.result.completedAt.toNumber() * 1000
  //                 ).toLocaleString()
  //               : "Not completed yet",
  //           reward: parseInt(eventResult.result.reward, 10) / 10 ** 18,
  //           result: eventResult.result.result,
  //         };
  //         setProject(structuredProject);
  //       }
  //     });
  //   }, 1000);
  // }, []);

  // useEffect(async () => {
  //   const contract = await createTronContract();
  //   setInterval(async () => {
  //     await contract.FeeUpdated().watch((err, eventResult) => {
  //       if (err) {
  //         return console.error('Error with "method" event:', err);
  //       }
  //       if (eventResult) {
  //         console.log("eventResult:", eventResult);
  //         setFee(eventResult.result.toNumber());
  //       }
  //     });
  //   }, 1000);
  // }, []);

  // useEffect(async () => {
  //   const contract = await createTronContract();
  //   setInterval(async () => {
  //     await contract.ProjectDeleted().watch((err, eventResult) => {
  //       if (err) {
  //         return console.error('Error with "method" event:', err);
  //       }
  //       if (eventResult) {
  //         console.log("eventResult:", eventResult);
  //         const id = eventResult.result._id.toNumber();
  //         setProjects((current) => current.filter((p) => p.id !== id));
  //       }
  //     });
  //   }, 1000);
  // }, []);

  return (
    <PlatformContext.Provider
      value={{
        fee,
        projects,
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
