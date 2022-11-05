import { createContext, useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { contractAddress, Statuses, Categories } from "../utils/constants";
import contractABI from "../utils/contractABI.json";
import { PlatformContext } from "./PlatformContext";

export const ServiceContext = createContext();

export const ServiceProvider = ({ children }) => {
  const [formData, setformData] = useState({
    category: Categories[0],
    title: "",
    description: "",
    price: 0,
  });
  const [services, setServices] = useState([]);
  const [service, setService] = useState([]);
  const { tronWeb } = useContext(AuthContext);
  // const { tronWeb } = window;
  const { notify, setIsLoading } = useContext(PlatformContext);

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const createTronContract = async () => {
    const c = await tronWeb.contract(contractABI, contractAddress);
    return c;
  };

  function formatService(t) {
    return ({
      id: t.id.toNumber(),
      category: t.category,
      title: t.title,
      description: t.description,
      createdAt: new Date(
        t.createdAt.toNumber() * 1000
      ).toLocaleString(),
      author: tronWeb.address.fromHex(t.author),
      price: tronWeb.fromSun(t.price),
      status: Statuses[t.status],
      lastStatusChangeAt: new Date(
        t.lastStatusChangeAt.toNumber() * 1000
      ).toLocaleString(),
    });
  }

  const getAllServices = async () => {
    try {
      if (tronWeb) {
        setIsLoading(true);
        const contract = await createTronContract();
        const availableServices = await contract.getAllServices().call();
        console.log(availableServices);
        const structuredServices = availableServices
          .map((item) => (formatService(item)));
        setServices(structuredServices);
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

  const getService = async (id) => {
    if (tronWeb) {
      try {
        setIsLoading(true);
        const contract = await createTronContract();
        const fetchedService = await contract.getService(id).call();
        console.log(fetchedService);
        setService(formatService(fetchedService));
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

  const addService = async () => {
    if (tronWeb) {
      try {
        const { category, title, description, price } = formData;
        const serviceToSend = [
          category,
          title,
          description,
          tronWeb.toSun(price),
        ];
        console.log("serviceToSend", serviceToSend);
        setIsLoading(true);
        const contract = await createTronContract();
        const transaction = await contract.addService(serviceToSend).send({
          feeLimit: 1000_000_000,
          callValue: 0,
          shouldPollResponse: true,
        });
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        window.location.replace("/");
        notify("New service added successfully.");
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
      await getAllServices();
    };
    fetchData().catch(console.error);
  }, []);

  // Event listeners

  const onServiceAdded = async () => {
    const contract = await createTronContract();
    if (tronWeb) {
      await contract.ServiceAdded().watch((err, eventResult) => {
        if (err) {
          return console.error('Error with "method" event:', err);
        }
        if (eventResult) {
          setServices((prevState) => [
            ...prevState,
            formatService(eventResult.result.service),
          ]);
        }
      });
    }
  };

  useEffect(() => {
    onServiceAdded().catch(console.error);
  }, []);

  const onServiceUpdated = async () => {
    if (tronWeb) {
      const contract = await createTronContract();
      await contract.ServiceUpdated().watch((err, eventResult) => {
        if (err) {
          return console.error('Error with "method" event:', err);
        }
        if (eventResult) {
          setService(formatService(eventResult.result.service));
        }
      });
    }
  };

  useEffect(() => {
    onServiceUpdated().catch(console.error);
  }, []);

  return (
    <ServiceContext.Provider
      value={{
        services,
        service,
        getAllServices,
        getService,
        addService,
        handleChange,
        formData
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};
