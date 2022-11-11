import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { FaStar } from "react-icons/fa";
import { ServiceContext } from "../context/ServiceContext";
import { PlatformContext } from "../context/PlatformContext";
import ActionControls from "../components/services/ActionControls";
import { Loader } from "../components";
import { shortenAddress } from "../utils/shortenAddress";
import AutoAvatar from "../components/AutoAvatar";

export default function Service() {
  const params = useParams();
  // const { isLoading } = useContext(PlatformContext);
  const { service, getService } = useContext(ServiceContext);
  const { isLoading, getRating } = useContext(PlatformContext);
  const serviceId = params.id;
  const [rating, setRating] = useState(0);
  const fetchRating = async () => {
    const r = await getRating(service.author);
    setRating(r);
  };
  useEffect(() => {
    getService(serviceId);
    fetchRating();
  }, []);
  console.log(rating);
  return (
    <div className="min-h-screen text-white">
      <div className="container mx-auto flex flex-col self-center items-start white-glassmorphism p-3">
        <div className="flex flex-col">
          <img
            alt="Service"
            className="self-center rounded-md"
            src={service.image}
          />
          <div className="flex flex-col ">
            <div className="mt-2 text-center white-glassmorphism">
              {service.category}
            </div>
            <div className="mt-2 text-center white-glassmorphism">
              {service.status}
            </div>
            <div className="flex flex-row justify-between w-full">
              <p className="mt-2 text-4xl text-left">{service.title}</p>
              <p className="mt-2 text-3xl text-right">{service.price} TRX</p>
            </div>
            <p className="mt-1 text-2xl">{service.description}</p>
            <div className="pt-4 flex flex-row gap-1 items-center italic">
              <AutoAvatar userId={service.author} size={36} /> {service.author}{" "}
              <FaStar color="#ffc107" />
              {rating || "unrated"}
            </div>
            {service.createdAt}
          </div>
          {isLoading ? <Loader /> : <ActionControls service={service} />}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
