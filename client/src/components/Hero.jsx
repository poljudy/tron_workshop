import { React } from "react";
import { useNavigate } from "react-router-dom";
import hero1 from "../../images/hero1.png";
import hero2 from "../../images/hero2.png";
import logo1 from "../../images/logo1.png";

function Hero() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/new", { replace: true });
  };
  return (
    <>
      <div className="flex flex-col items-center">
        <h1 className="text-white text-6xl">Meet our new brand</h1>
        <img alt="Brand logo" className="w-6/12 self-center" src={logo1} />
        <h2 className="mt-2 text-white text-4xl">formerly MeDo</h2>
      </div>
      <div className="wrapper flex items-center justify-between px-[5rem] rounded-b-[5rem] w-[100%] h-[35rem] relative z-[3]">
        {/* left side */}
        <div className="headings flex flex-1 flex-col text-white items-start justify-center h-[100%] text-[2rem]">
          <span>Need a professional? Create a task and enjoy!</span>
          <span>
            Or select them yourself from our highly skilled freelancers
          </span>
          <div className="flex flex-row gap-2">
            <button
              type="button"
              onClick={handleClick}
              className="flex flex-row justify-center items-center my-5 bg-[#2952e3] pt-1 pb-1 pl-3 pr-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
            >
              <p className="text-white text-base font-semibold">Add task</p>
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
          <img alt="Hero 1" className="w-10/12 self-center" src={hero2} />
        </div>
      </div>
      <div className="wrapper flex items-center justify-between px-[5rem] rounded-b-[5rem] w-[100%] h-[35rem] relative z-[3]">
        {/* left side */}
        <div className="headings flex flex-1 flex-col text-white items-start justify-center h-[100%] text-[2rem]">
          <img alt="Hero 2" className="w-11/12 self-center" src={hero1} />
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
                Add Service
              </p>
            </button>
            <button
              type="button"
              onClick={handleClick}
              className="flex flex-row justify-center items-center my-5 bg-[#2952e3] pt-1 pb-1 pl-3 pr-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
            >
              <p className="text-white text-base font-semibold">Find Tasks</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Hero;
