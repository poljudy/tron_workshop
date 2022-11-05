import { React, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillPlayCircle } from "react-icons/ai";
import { AuthContext } from "../context/AuthContext";
import hero1 from "../../images/hero1.png";
import hero2 from "../../images/hero2.png";
import logo1 from "../../images/logo1.png";

function Hero() {
  const navigate = useNavigate();
  const { connectWallet } = useContext(AuthContext);

  return (
    <>
      <div className="flex flex-col items-center">
        <h1 className="mt-10 text-white text-6xl">Meet our new brand</h1>
        <img alt="Brand logo" className="w-6/12 self-center" src={logo1} />
        <h2 className="mt-2 text-white text-4xl">formerly MeDo</h2>
        <p className="mt-2 text-white text-4xl">the best decentralized freelance platform</p>
      </div>
      <div className="wrapper flex items-center justify-between px-[5rem] rounded-b-[5rem] w-[100%] h-[35rem] relative z-[3]">
        {/* left side */}
        <div className="headings flex flex-1 flex-col text-white items-center justify-center h-[100%] text-[2rem]">
          <p>Need a professional? Create a task and enjoy!</p>
          <p className="pb-4">
            Or select them yourself from our highly skilled freelancers
          </p>
          <button
            type="button"
            onClick={connectWallet}
            className="flex flex-row justify-center items-center bg-[#2952e3] pt-1 pb-1 pl-2 pr-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
          >
            <AiFillPlayCircle className="text-white mr-2" />
            <p className="text-white text-base font-semibold">Connect Wallet</p>
          </button>
        </div>
        {/* right side */}
        <div className="headings flex flex-1 flex-col text-white items-start justify-center h-[100%] text-[2rem]">
          <img alt="Hero 1" className="md:w-10/12 lg:w-6/12 self-center" src={hero1} />
        </div>
      </div>
      <div className="wrapper flex items-center justify-between px-[5rem] rounded-b-[5rem] w-[100%] h-[35rem] relative z-[3]">
        {/* left side */}
        <div className="headings flex flex-1 flex-col text-white items-start justify-center h-[100%] text-[2rem]">
          <img alt="Hero 2" className="md:w-11/12 lg:w-8/12 self-center" src={hero2} />
        </div>
        {/* right side */}
        <div className="headings flex flex-1 flex-col text-white items-center justify-center h-[100%] text-[2rem]">
          <p>Have great skills? Create profile and earn crypto!</p>
          <p className="pb-4">Or select a task from active paid tasks</p>
          <button
            type="button"
            onClick={connectWallet}
            className="flex flex-row justify-center items-center bg-[#2952e3] pt-1 pb-1 pl-2 pr-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
          >
            <AiFillPlayCircle className="text-white mr-2" />
            <p className="text-white text-base font-semibold">Connect Wallet</p>
          </button>
        </div>
      </div>
    </>
  );
}

export default Hero;
