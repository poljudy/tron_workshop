import React from "react";
import { SiDiscord } from "react-icons/si";
import { FaTelegramPlane, FaFacebook } from "react-icons/fa";
import { AiOutlineCopyright } from "react-icons/ai";
import logo1 from "../../images/logo1.png";

const Footer = () => (
  <div className="w-full flex md:justify-center justify-between items-center flex-col p-4 gradient-bg-footer">
    <div className="sm:w-[90%] w-full h-[0.25px] bg-gray-400 mt-5 " />
    <div className="sm:w-[90%] w-full flex flex-row justify-between mt-3">
      <div className="flex text-white text-left">
        <img alt="Brand logo" className="h-6" src={logo1} />
        <AiOutlineCopyright className="w-4 self-center" />
        <span className="text-xl">2022</span>
      </div>
      <div className="flex gap-2 text-white text-right">
        <a href="https://www.facebook.com/people/Hotskills/100088810601810" target="_blank" rel="noreferrer"><FaFacebook /></a>
        <a href="https://twitter.com/hotskillscrypto" target="_blank" rel="noreferrer"><FaTwitter /></a>
        <a href="https://discord.gg/Zk8MDnTjn5" target="_blank" rel="noreferrer"><SiDiscord /></a>
        <a href="https://t.me/hotskillscrypto" target="_blank" rel="noreferrer"><FaTelegramPlane /></a>
      </div>
    </div>
  </div>
);

export default Footer;
