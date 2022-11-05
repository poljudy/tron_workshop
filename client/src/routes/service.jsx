import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
// import { PlatformContext } from "../context/PlatformContext";
import { ServiceContext } from "../context/ServiceContext";
// import { Loader } from "../components";

export default function Service() {
  const params = useParams();
  // const { isLoading } = useContext(PlatformContext);
  const { service, getService } = useContext(ServiceContext);
  const serviceId = params.id;
  useEffect(() => {
    getService(serviceId);
  }, []);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto flex flex-row self-center items-start white-glassmorphism p-3">
        <div className="ml-5 flex flex-col flex-1">
          <h3 className="mt-2 text-white text-4xl">{service.title}</h3>
          <div className="flex flex-row gap-2 items-center">
            <div className="mt-2 text-center text-white white-glassmorphism w-3/12">{service.category}</div>
            <div className="mt-2 text-center text-white white-glassmorphism w-6/12 ">{service.status} since {service.lastStatusChangeAt}</div>
          </div>
          <p className="mt-1 text-white text-2xl md:w-9/12">
            {service.description}
          </p>
          <p className="mt-1 text-white text-sm md:w-9/12">
            Author: {service.author}
          </p>
          <p className="mt-1 italic text-white text-sm md:w-9/12">
            Ceated at: {service.createdAt}
          </p>
        </div>
        <div>
          <p className="mt-2 text-white text-2xl">{service.price} TRX</p>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}
