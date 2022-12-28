import { React } from "react";
import ConnectWalletButton from "./ConnectWalletButton";
import TestMode from "./TestMode";

function Connect() {
  return (
    <div className="flex flex-col w-full justify-center items-center gap-3 text-xl m-6">
      <TestMode />
      <p className="text-center text-white">Please connect your wallet to continue</p>
      <ConnectWalletButton />
    </div>
  );
}

export default Connect;
