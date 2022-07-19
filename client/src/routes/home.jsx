import React, { useContext, useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
// import { HiSearch } from "react-icons/hi";
import { PlatformContext } from "../context/PlatformContext";
// import ProjectCard from "../components/ProjectCard";
import { Projects, Loader } from "../components";

export default function Home() {
  const {
    // projects,
    // currentAccount,
    isLoading,
    // network,
    // switchNetwork,
    // getAllProjects,
  } = useContext(PlatformContext);

  // useEffect(async () => {
  //   await getAllProjects();
  // });
  // const [searchParams, setSearchParams] = useSearchParams();

  // if (network !== "Polygon Mumbai Testnet") {
  //   return (
  //     <div className="flex flex-col w-full text-white justify-center items-center min-h-screen">
  //       <p>Please connect to Polygon Mumbai Testnet</p>
  //       <button
  //         className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
  //         type="button"
  //         onClick={switchNetwork}
  //       >
  //         <p className="text-white text-base font-semibold">Switch Network</p>
  //       </button>
  //     </div>
  //   );
  // }
  return (
    <div className="flex w-full justify-center items-start 2xl:px-20 gradient-bg-welcome min-h-screen">
      <div className="flex flex-col md:p-12 py-12 px-4">
        {isLoading ? <Loader /> : <Projects />}
      </div>
    </div>
  );
}
