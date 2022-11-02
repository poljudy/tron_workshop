import React, { useContext } from "react";
import { PlatformContext } from "../context/PlatformContext";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const { isLoading } = useContext(PlatformContext);
  const { currentAccount } = useContext(AuthContext);

  return (
    <div className="flex flex-col w-full justify-center items-center 2xl:px-20 gradient-bg-welcome min-h-screen text-white  ">
      Profile
    </div>
  );
}
