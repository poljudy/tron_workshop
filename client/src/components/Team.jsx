import { React } from "react";
import path318 from "../img/Path318.png";
import vad from "../../images/Vad.jpg";

function Team() {
  return (
    <div className="flex flex-col items-center justify-center text-white">
      <img src={path318} alt="" className="w-[5rem]" />
      <div className="mt-7 flex flex-col items-center text-4xl">
        <span className="pb-10">Meet the team</span>
        <img src={vad} alt="" className="w-1/12 rounded-[5rem]" />
        <b className="text-2xl">Vadym Kutsenko</b>
        <span className="text-sm">founder, fullstack web3 dev</span>
      </div>
    </div>
  );
}

export default Team;
