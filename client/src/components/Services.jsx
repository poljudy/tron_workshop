import { useContext } from "react";
import { ServiceContext } from "../context/ServiceContext";
import ServiceCard from "./ServiceCard";

const Services = () => {
  const { services } = useContext(ServiceContext);

  return (
    <>
      {services.length < 1 && (
        <p className="text-white text-2xl text-center my-2">
          No services yet
        </p>
      )}
      <div className="flex flex-row w-full justify-center items-center mt-10">
        {services &&
          [...services]
            .reverse()
            .map((service, i) => <ServiceCard key={i} {...service} />)}
      </div>
    </>
  );
};

export default Services;
