import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import tronLogo from "../../images/tronlogo.png";

const ConnectWalletButton = () => {
  const { connectWallet } = useContext(AuthContext);
  const { ethereum } = window;

  if (!ethereum) return <span>Wallet not found</span>;
  return (
    <button
      type="button"
      onClick={connectWallet}
      className="flex flex-row justify-center items-center gap-1 bg-[#2952e3] pt-1 pb-1 pl-3 pr-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
    >
      <img alt="Tron logo" className="w-4 h-4 self-center" src={tronLogo} />
      <p className="text-white text-base font-semibold">Connect Wallet</p>
    </button>
  );
};

export default ConnectWalletButton;
