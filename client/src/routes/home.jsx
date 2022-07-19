import React, { useContext } from "react";
import { PlatformContext } from "../context/PlatformContext";
import { Projects, Loader } from "../components";

export default function Home() {
  const { isLoading } = useContext(PlatformContext);

  return (
    <div className="flex w-full justify-center items-start 2xl:px-20 gradient-bg-welcome min-h-screen">
      <div className="flex flex-col md:p-12 py-12 px-4">
        {isLoading ? <Loader /> : <Projects />}
      </div>
    </div>
  );
}
