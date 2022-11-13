import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { FaStar } from "react-icons/fa";
import { ServiceContext } from "../context/ServiceContext";
import { PlatformContext } from "../context/PlatformContext";
import ActionControls from "../components/services/ActionControls";
import { Loader } from "../components";
import AutoAvatar from "../components/AutoAvatar";
import { contractAddress } from "../utils/constants";
import contractABI from "../utils/contractABI.json";
import { AuthContext } from "../context/AuthContext";
import { shortenAddress } from "../utils/shortenAddress";

export default function Service() {
  const params = useParams();
  const { tronWeb } = useContext(AuthContext);
  const { service, getService } = useContext(ServiceContext);
  const { isLoading } = useContext(PlatformContext);
  const serviceId = params.id;
  const [rating, setRating] = useState(0);
  const [profile, setProfile] = useState(null);

  const getRating = async (address) => {
    if (tronWeb && address) {
      try {
        const contract = await tronWeb.contract(contractABI, contractAddress);
        const r = await contract.getRating(address).call();
        setRating(r);
      } catch (error) {
        console.log(error);
        alert(error.message);
      }
    } else {
      console.log("Tron is not present");
    }
  };

  const getProfile = async (address) => {
    if (tronWeb && address) {
      try {
        const contract = await tronWeb.contract(contractABI, contractAddress);
        const r = await contract.getProfile(address).call();
        setProfile(r);
      } catch (error) {
        console.log(error);
        alert(error.message);
      }
    } else {
      console.log("Tron is not present");
    }
  };

  useEffect(() => {
    getService(serviceId);
    getRating(service.author);
    getProfile(service.author);
  }, [serviceId]);
  return (
    <div className="min-h-screen text-white">
      <div className="container mx-auto flex flex-col self-center items-center white-glassmorphism p-3">
        <div className="flex flex-col w-full">
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
            <p className="mt-1 text-xl">
              Delivery Time: {service.deliveryTime} days
            </p>
            <div className="pt-4 flex flex-row gap-2 items-center italic">
              <div className="flex flex-row items-center">
                {profile && profile.avatar ? (
                  <img alt="Avatar" className="" src={profile.avatar} />
                ) : (
                  <AutoAvatar userId={service.author} size={36} />
                )}
                {profile ? profile.username : shortenAddress(service.author)}
              </div>
              <div className="flex flex-row justify-center items-center">
                <FaStar color="#ffc107" />
                {rating.toFixed(1)}
              </div>
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
