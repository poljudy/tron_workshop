import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { PlatformContext } from "../context/PlatformContext";
import { Welcome, Tasks, Services, Hero, Loader, TestMode } from "../components";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const { isLoading } = useContext(PlatformContext);
  const { currentAccount } = useContext(AuthContext);

  return (
    <div className="flex flex-col w-full justify-center items-center 2xl:px-20 gradient-bg-welcome min-h-screen">
      {!currentAccount ? (
        <>
          <TestMode />
          <Hero />
        </>
      ) : (
        <div className="flex flex-col items-center w-full">
          <Welcome />
          <div className="flex flex-col w-9/12 py-12 px-4">
            <div className="flex flex-row justify-between text-3xl">
              <span className="text-left text-white">Recent Services</span>
              <Link to="/services" className="text-blue-400 text-xl">
                <i>View all</i>
              </Link>
            </div>
            <div>
              {isLoading ? <Loader /> : <Services />}
            </div>
          </div>
          <div className="flex flex-col w-9/12 py-12 px-4">
            <div className="flex flex-row justify-between text-3xl">
              <span className="text-left text-white">Recent Tasks</span>
              <Link to="/tasks" className="text-blue-400 text-xl">
                <i>View all</i>
              </Link>
            </div>
            <div>
              {isLoading ? <Loader /> : <Tasks />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
