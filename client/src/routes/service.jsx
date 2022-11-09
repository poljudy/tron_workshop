import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ServiceContext } from "../context/ServiceContext";
import { PlatformContext } from "../context/PlatformContext";
import ActionControls from "../components/services/ActionControls";
import { Loader } from "../components";

export default function Service() {
  const params = useParams();
  // const { isLoading } = useContext(PlatformContext);
  const { service, getService } = useContext(ServiceContext);
  const { isLoading } = useContext(PlatformContext);
  const serviceId = params.id;
  useEffect(() => {
    getService(serviceId);
  }, []);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto flex flex-row self-center items-start white-glassmorphism p-3">
        <div className="ml-5 flex flex-col flex-1">
          <img alt="Service" className="w-6/12 self-center" src={service.image} />
          <div className="flex flex-row gap-2 items-center">
            <h3 className="mt-2 text-white text-4xl">{service.title}</h3>
            <div className="mt-2 text-center text-white white-glassmorphism w-3/12">{service.category}</div>
            <div className="mt-2 text-center text-white white-glassmorphism w-3/12 ">{service.status}</div>
          </div>
          <p className="mt-1 text-white text-sm md:w-9/12">
            Created at: {service.createdAt} by {service.author}
          </p>
          <p className="mt-1 text-white text-2xl">
            {service.description}
          </p>
          {isLoading ? (
            <Loader />
          ) : (
            <ActionControls service={service} />
          )}
        </div>
        <div>
          <p className="mt-2 text-white text-2xl">{service.price} TRX</p>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}
