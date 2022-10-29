import { React, useState } from "react";
import VisibilitySensor from "react-visibility-sensor";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import img1 from "../img/coins.png";
import img2 from "../img/contract.png";
import img3 from "../img/pencil.png";

function Hero() {
  const [elementIsVisible, setElementIsVisible] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/new", { replace: true });
  };
  const coins = {
    true: {
      left: "7rem",
    },
    false: {
      left: "19rem",
    },
  };
  const pencil = {
    true: {
      left: "225px",
    },
    false: {
      left: "125px",
    },
  };
  return (
    <VisibilitySensor
      onChange={(isVisible) => setElementIsVisible(isVisible)}
      minTopValue={300}
    >
      <>
      <div className="wrapper flex items-center justify-between px-[5rem] rounded-b-[5rem] w-[100%] h-[35rem] relative z-[3]">
        {/* left side */}
        <div className="headings flex flex-1 flex-col text-white items-start justify-center h-[100%] text-[2rem]">
          <span>Need a professional? Create a task and enjoy!</span>
          <span>Or select them yourself from our highly skilled freelancers</span>
          <div className="flex flex-row gap-2">
            <button
              type="button"
              onClick={handleClick}
              className="flex flex-row justify-center items-center my-5 bg-[#2952e3] pt-1 pb-1 pl-3 pr-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
            >
              <p className="text-white text-base font-semibold">
                Add task
              </p>
            </button>
            <button
              type="button"
              className="flex flex-row justify-center items-center my-5 bg-[#2952e3] pt-1 pb-1 pl-3 pr-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
            >
              <p className="text-white text-base font-semibold">
                Find Freelancers
              </p>
            </button>
          </div>
        </div>
        {/* right side */}
        <div className="headings flex flex-1 flex-col text-white items-start justify-center h-[100%] text-[2rem]">
        </div>
      </div>
      <div className="wrapper flex items-center justify-between px-[5rem] rounded-b-[5rem] w-[100%] h-[35rem] relative z-[3]">
        {/* left side */}
        <div className="headings flex flex-1 flex-col text-white items-start justify-center h-[100%] text-[2rem]">
        </div>
        {/* right side */}
        <div className="headings flex flex-1 flex-col text-white items-start justify-center h-[100%] text-[2rem]">
          <span>Have great skills? Create profile and earn crypto!</span>
          <span>Or select a task from active paid tasks</span>
          <div className="flex flex-row gap-2">
            <button
              type="button"
              className="flex flex-row justify-center items-center my-5 bg-[#2952e3] pt-1 pb-1 pl-3 pr-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
            >
              <p className="text-white text-base font-semibold">
                Create Profile
              </p>
            </button>
            <button
              type="button"
              onClick={handleClick}
              className="flex flex-row justify-center items-center my-5 bg-[#2952e3] pt-1 pb-1 pl-3 pr-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
            >
              <p className="text-white text-base font-semibold">
                Find Tasks
              </p>
            </button>
          </div>
        </div>
      </div>
      </>
    </VisibilitySensor>
  );
}

export default Hero;
