import { createContext, useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
// import { ethers } from "ethers";
import { AuthContext } from "./AuthContext";
import { contractAddress, address0 } from "../utils/constants";
import contractABI from "../utils/contractABI.json";

export const PlatformContext = createContext();

const MessageDisplay = ({ message, hash }) => (
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

export const PlatformProvider = ({ children }) => {
  const [formData, setformData] = useState({
    category: "Programming & Tech",
    title: "",
    description: "",
    taskType: "0",
    reward: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  // const [tasks, setTasks] = useState("");
  const [fetchedProfile, setFetchedProfile] = useState([]);
  const [fee, setFee] = useState(0);
  const [fetchedRating, setFetchedRating] = useState(0);
  // const [contract, setContract] = useState(undefined);
  const { currentAccount, tronWeb } = useContext(AuthContext);
  // const { tronWeb } = window;

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

  // const handleChange = (e, name) => {
  //   setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  // };

  const createTronContract = async () => {
    const c = await tronWeb.contract(contractABI, contractAddress);
    return c;
  };

  const getPlatformFee = async () => {
    if (tronWeb) {
      try {
        const contract = await createTronContract();
        const fetchedFee = await contract.platformFeePercentage().call();
        setFee(fetchedFee);
      } catch (error) {
        console.log(error);
        alert(error.message);
      }
    } else {
      console.log("Tron is not present");
    }
  };

  const getRating = async (address) => {
    if (tronWeb && address) {
      try {
        const contract = await createTronContract();
        const r = await contract.getRating(address).call();
        setFetchedRating(r);
      } catch (error) {
        console.log(error);
        alert(error.message);
      }
    } else {
      console.log("Tron is not present");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await createTronContract();
      await getPlatformFee();
    };
    fetchData().catch(console.error);
  }, []);

  useEffect(() => {
    getRating(currentAccount);
  }, [currentAccount]);

  // Event listeners

  // TODO Fix events listenenrs later

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

  return (
    <PlatformContext.Provider
      value={{
        MessageDisplay,
        notify,
        fee,
        currentAccount,
        isLoading,
        setIsLoading,
        // handleChange,
        getRating,
        // getProfile,
        fetchedRating,
        formData,
        address0,
        fetchedProfile
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};
