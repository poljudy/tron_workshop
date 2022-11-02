import React, { useContext } from "react";
import { PlatformContext } from "../context/PlatformContext";
import { Tasks, Services, Hero, Team, Sponsors, Loader } from "../components";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const { isLoading } = useContext(PlatformContext);
  const { currentAccount } = useContext(AuthContext);

  return (
    <div className="flex flex-col w-full justify-center items-center 2xl:px-20 gradient-bg-welcome min-h-screen">
      {!currentAccount ? (
        <>
          <Hero />
          <Team />
          <Sponsors />
        </>
      ) : (
        <div className="flex flex-col">
          <div className="flex flex-row w-full md:p-12 py-12 px-4">
            <p className="text-white">Recent Tasks <span>View all</span></p>
            {isLoading ? <Loader /> : <Tasks />}
          </div>
          <div className="flex flex-row w-full md:p-12 py-12 px-4">
            {isLoading ? <Loader /> : <Services />}
          </div>
        </div>
      )}
    </div>
  );
}
