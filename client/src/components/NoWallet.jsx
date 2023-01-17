import { React } from "react";

function NoWallet() {
  return (
    <div className="h-screen flex flex-col w-full justify-center items-center gap-3 text-xl">
      <p className="text-center text-white">
        Wallet not found. Please install TronLink to use this app: <a href="https://www.tronlink.org/" target="_blank" rel="noreferrer" className="text-blue-400">https://www.tronlink.org</a>
      </p>
    </div>
  );
}

export default NoWallet;
