import { createContext, useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "./AuthContext";
import { address0, contractAddress } from "../utils/constants";
import contractABI from "../utils/contractABI.json";

export const PlatformContext = createContext();

const { tronWeb } = window;

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
  const [isLoading, setIsLoading] = useState(false);
  const [fee, setFee] = useState(0);
  const [fetchedRating, setFetchedRating] = useState(0);
  const { currentAccount } = useContext(AuthContext);

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

  const createTronContract = async () => {
    let c;
    if (tronWeb) {
      tronWeb.setAddress(contractAddress);
      c = await tronWeb.contract(contractABI, contractAddress);
    }
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
      }
    } else {
      console.log("Tron is not present");
    }
  };

  const rateUser = async (address, rating) => {
    if (tronWeb && address) {
      try {
        setIsLoading(true);
        const dataToSend = [address, rating];
        console.log(dataToSend);
        const contract = await createTronContract();
        const transaction = await contract.rateUser(address, rating).send({
          feeLimit: 1000_000_000,
          callValue: 0,
          shouldPollResponse: true,
        });
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        notify("Rating saved successfully.");
      } catch (error) {
        console.log(error.message);
        setIsLoading(false);
      }
    } else {
      console.log("No Tron object");
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
      }
    } else {
      console.log("Tron is not present");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getPlatformFee();
    };
    if (tronWeb) {
      fetchData().catch(console.error);
    }
  }, []);

  useEffect(() => {
    if (tronWeb) {
      getRating(currentAccount);
    }
  }, [currentAccount]);

  const onFeeUpdated = async () => {
    if (tronWeb) {
      const contract = await createTronContract();
      await contract.FeeUpdated().watch((err, eventResult) => {
        if (err) {
          return console.error('Error with "method" event:', err);
        }
        if (eventResult) {
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
        rateUser,
        getRating,
        fetchedRating,
        address0,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};
