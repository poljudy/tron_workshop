import React, { useContext } from "react";
import { PlatformContext } from "../context/PlatformContext";
import { Projects, Profiles, Hero, Team, Sponsors, Loader } from "../components";
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
        <>
          <div className="flex flex-col w-9/12 md:p-12 py-12 px-4">
            {isLoading ? <Loader /> : <Projects />}
          </div>
          <div className="flex flex-col w-9/12 md:p-12 py-12 px-4">
            {isLoading ? <Loader /> : <Profiles />}
          </div>
        </>
      )}
    </div>
  );
}
