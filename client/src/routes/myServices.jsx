import React, { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { ServiceCard } from "../components";
import { ServiceContext } from "../context/ServiceContext";
import { AuthContext } from "../context/AuthContext";

const MyServices = () => {
  const { services, getAllServices } = useContext(ServiceContext);
  const { currentAccount } = useContext(AuthContext);
  useEffect(() => {
    getAllServices();
  }, []);

  function checkService(service) {
    return service.author === currentAccount;
  }
  return (
    <>
      <div className="flex w-full justify-center items-start 2xl:px-20 gradient-bg-welcome min-h-screen">
        <div className="flex flex-col w-9/12 md:p-12 py-12 px-4">
          {currentAccount ? (
            <h3 className="text-white text-3xl text-center my-2">Your Services</h3>
          ) : (
            <h3 className="text-white text-3xl text-center my-2">
              Connect your account to see the latest services
            </h3>
          )}

          <div className="list-none justify-center items-center mt-10">
            {[...services]
              .reverse()
              .filter(
                (s) => checkService(s)
              )
              .map((service, i) => (
                <ServiceCard key={i} {...service} />
              ))}
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default MyServices;
