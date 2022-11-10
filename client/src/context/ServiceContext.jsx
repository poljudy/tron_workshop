import { createContext, useEffect, useState, useContext } from "react";
import { Web3Storage } from "web3.storage";
import { ethers } from "ethers";
import { AuthContext } from "./AuthContext";
import { contractAddress, ServiceStatuses, Categories } from "../utils/constants";
import contractABI from "../utils/contractABI.json";
import { PlatformContext } from "./PlatformContext";

export const ServiceContext = createContext();

export const ServiceProvider = ({ children }) => {
  const [formData, setformData] = useState({
    category: Categories[0],
    image: "",
    title: "",
    description: "",
    price: 0,
  });
  const [services, setServices] = useState([]);
  const [service, setService] = useState([]);
  const [ipfsUrl, setIpfsUrl] = useState(null);
  const { tronWeb } = useContext(AuthContext);
  // const { tronWeb } = window;
  const { notify, setIsLoading } = useContext(PlatformContext);

  const onUploadHandler = async (event) => {
    const client = new Web3Storage({ token: import.meta.env.VITE_WEB3_STORAGE_TOKEN });
    event.preventDefault();
    const form = event.target;
    const { files } = form[0];
    if (!files || files.length === 0) {
      return alert("No files selected");
    }
    setIsLoading(true);
    const rootCid = await client.put(files);
    const info = await client.status(rootCid);
    // const res = await client.get(rootCid);
    const url = `https://${info.cid}.ipfs.w3s.link/${files[0].name}`;
    form.reset();
    setIpfsUrl(url);
    setIsLoading(false);
    notify("File successfully uploaded to IPFS.");
  };

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
      image: t.image,
      category: t.category,
      title: t.title,
      description: t.description,
      createdAt: new Date(
        t.createdAt.toNumber() * 1000
      ).toLocaleString(),
      author: tronWeb.address.fromHex(t.author),
      price: tronWeb.fromSun(t.price),
      status: ServiceStatuses[t.status],
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
        console.log("availableServices: ", availableServices);
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
        const image = ipfsUrl || "";
        const serviceToSend = [
          image,
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
        window.location.replace("/services");
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

  const updateService = async () => {
    if (tronWeb) {
      try {
        const { category, title, description, price } = formData;
        const image = ipfsUrl || "";
        const serviceToSend = [
          image,
          category,
          title,
          description,
          tronWeb.toSun(price),
        ];
        setIsLoading(true);
        const contract = await createTronContract();
        const transaction = await contract.updateService(serviceToSend).send({
          feeLimit: 1000_000_000,
          callValue: 0,
          shouldPollResponse: true,
        });
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        window.location.reload();
        notify("Service updated successfully.");
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

  const pauseService = async (id) => {
    if (tronWeb) {
      try {
        setIsLoading(true);
        const contract = await createTronContract();
        const transaction = await contract
          .pauseService(ethers.BigNumber.from(id))
          .send({
            feeLimit: 100_000_000,
            callValue: 0,
            shouldPollResponse: true,
          });
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        await getAllServices();
        notify("Service paused successfully.");
        // window.location.reload();
        getAllServices();
        getService();
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

  const resumeService = async (id) => {
    if (tronWeb) {
      try {
        setIsLoading(true);
        const contract = await createTronContract();
        const transaction = await contract
          .resumeService(ethers.BigNumber.from(id))
          .send({
            feeLimit: 100_000_000,
            callValue: 0,
            shouldPollResponse: true,
          });
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        await getAllServices();
        notify("Service paused successfully.");
        window.location.reload();
        getAllServices();
        getService();
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

  const deleteService = async (id) => {
    if (tronWeb) {
      try {
        setIsLoading(true);
        const contract = await createTronContract();
        const transaction = await contract
          .deleteService(ethers.BigNumber.from(id))
          .send({
            feeLimit: 100_000_000,
            callValue: 0,
            shouldPollResponse: true,
          });
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        await getAllServices();
        notify("service deleted successfully.");
        window.location.replace("/services");
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

  const onServiceDeleted = async () => {
    const contract = await createTronContract();
    if (tronWeb) {
      await contract.ServiceDeleted().watch((err, eventResult) => {
        if (err) {
          return console.error('Error with "method" event:', err);
        }
        if (eventResult) {
          console.log("eventResult:", eventResult);
          const id = parseInt(eventResult.result._id, 10);
          setServices((current) => current.filter((p) => p.id !== id));
        }
      });
    }
  };

  useEffect(() => {
    onServiceDeleted().catch(console.error);
  }, []);

  return (
    <ServiceContext.Provider
      value={{
        services,
        service,
        getAllServices,
        getService,
        addService,
        updateService,
        deleteService,
        pauseService,
        resumeService,
        handleChange,
        formData,
        onUploadHandler,
        ipfsUrl,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};
