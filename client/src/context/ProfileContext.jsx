import { createContext, useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { contractAddress } from "../utils/constants";
import contractABI from "../utils/contractABI.json";
import { PlatformContext } from "./PlatformContext";

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [formData, setformData] = useState({
    avatar: "",
    username: "",
    skills: "",
    languages: [],
    rate: 0,
    availability: 0
  });
  //   const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState([]);
  const { currentAccount, tronWeb } = useContext(AuthContext);
  // const { tronWeb } = window;
  const { notify, setIsLoading } = useContext(PlatformContext);

  const handleChange = (e, name) => {
    if (name === "languages") {
      setformData((prevState) => ({ ...prevState, [name]: e.map((item) => item.value) }));
    } else setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const createTronContract = async () => {
    const c = await tronWeb.contract(contractABI, contractAddress);
    return c;
  };

  const getProfile = async (account) => {
    if (tronWeb) {
      try {
        setIsLoading(true);
        const contract = await createTronContract();
        const fetchedProfile = await contract.getProfile(account).call();
        console.log(fetchedProfile);
        setProfile(fetchedProfile);
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

  const addProfile = async () => {
    if (tronWeb) {
      try {
        const { avatar, username, skills, langugages, rate, availability } = formData;
        setIsLoading(true);
        const contract = await createTronContract();
        const transaction = await contract.addProfile([avatar, username, skills, langugages, rate, availability]).send({
          feeLimit: 1000_000_000,
          shouldPollResponse: true,
        });
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        window.location.replace("/");
        notify("Profile saved successfully.");
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

  useEffect(() => {
    const fetchData = async () => {
      await createTronContract();
      await getProfile(currentAccount);
    };
    fetchData().catch(console.error);
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        addProfile,
        getProfile,
        handleChange,
        profile
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
