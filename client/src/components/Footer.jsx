import React from "react";
import { FiTwitter } from "react-icons/fi";
import { SiDiscord } from "react-icons/si";
import { FaTelegramPlane, FaGithub } from "react-icons/fa";
import { AiOutlineCopyright } from "react-icons/ai";



import { Link } from "react-router-dom";

const Footer = () => (
  <div className="w-full flex md:justify-center justify-between items-center flex-col p-4 gradient-bg-footer">
    <div className="sm:w-[90%] w-full h-[0.25px] bg-gray-400 mt-5 " />
    <div className="sm:w-[90%] w-full flex flex-row justify-between mt-3">
      <div className="flex text-white text-left"><AiOutlineCopyright className="w-3 self-center" />2022 MeDo</div>
      <div className="flex gap-2 text-white text-right">
        <Link to="#"><FiTwitter /></Link>
        <Link to="#"><SiDiscord /></Link>
        <Link to="#"><FaTelegramPlane /></Link>
        <Link to="#"><FaGithub /></Link>
      </div>
    </div>
  </div>
);

export default Footer;
