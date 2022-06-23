import React from "react";

const Footer = () => (
  <div className="w-full flex md:justify-center justify-between items-center flex-col p-4 gradient-bg-footer">
    <div className="sm:w-[90%] w-full h-[0.25px] bg-gray-400 mt-5 " />
    <div className="sm:w-[90%] w-full flex justify-between items-center mt-3">
      <p className="text-white text-left text-xs">vadkutsen@gmail.com</p>
      <p className="text-white text-right text-xs">for Polygon Hackathon</p>
    </div>
  </div>
);

export default Footer;
