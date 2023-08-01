import { React } from "react";
import hero1 from "../../images/hero1.png";
import hero2 from "../../images/hero2.png";
import ConnectWalletButton from "./ConnectWalletButton";

function Hero() {
  return (
    <>
      <div className="flex flex-col items-center">
        <h1 className="mt-10 text-white text-6xl">Work-to-Earn Marketplace</h1>
        <h2 className="mt-2 text-white text-4xl">Multichain crypto platform for freelancers.</h2>
        <p className="mt-2 text-white text-4xl">Secure and fast payments. Low fees.</p>
      </div>
      <div className="wrapper flex items-center justify-between px-[5rem] rounded-b-[5rem] w-[100%] h-[35rem] relative z-[3]">
        <div className="headings flex flex-1 flex-col text-white items-center justify-center h-[100%] text-[2rem]">
          <p>Need a professional? Create a task and enjoy!</p>
          <p className="pb-4">
            Or select from a number of services our highly skilled freelancers offer
          </p>
          <ConnectWalletButton />
        </div>
        <div className="headings flex flex-1 flex-col text-white items-start justify-center h-[100%] text-[2rem]">
          <img alt="Hero 1" className="md:w-10/12 lg:w-8/12 self-center" src={hero1} />
        </div>
      </div>
      <div className="wrapper flex items-center justify-between px-[5rem] rounded-b-[5rem] w-[100%] h-[35rem] relative z-[3]">
        <div className="headings flex flex-1 flex-col text-white items-start justify-center h-[100%] text-[2rem]">
          <img alt="Hero 2" className="md:w-11/12 lg:w-8/12 self-center" src={hero2} />
        </div>
        <div className="headings flex flex-1 flex-col text-white items-center justify-center h-[100%] text-[2rem]">
          <p>Have great skills? Create profile and earn crypto!</p>
          <p className="pb-4">Or select a task from active paid tasks</p>
          <ConnectWalletButton />
        </div>
      </div>
    </>
  );
}

export default Hero;
