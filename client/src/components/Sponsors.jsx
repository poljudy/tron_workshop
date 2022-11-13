import { React } from "react";
import path318 from "../../images/Path318.png";
import session2 from "../../images/session2.jpeg";

function Sponsors() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-white">
      <img src={path318} alt="" className="w-[5rem]" />
      <div className="mt-7 flex flex-col items-center text-4xl">
        <span>Sponsors</span>
        <img src={session2} alt="" className="pt-4 w-6/12 rounded-[5rem]" />
        <b className="text-2xl">Session 2: Potential Project Prize</b>
        <span className="mt-7 text-xl">Looking for a perspective project to invest in?</span>
        <span className="text-xl">We are open for funding!</span>
      </div>
    </div>
  );
}

export default Sponsors;
