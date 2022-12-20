import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import { AuthContext } from "../context/AuthContext";
import logo1 from "../../images/logo1.png";
import logo2 from "../../images/tronlogo.png";
import Wallet from "./Wallet";
import ConnectWalletButton from "./ConnectWalletButton";
import Notifications from "./Notifications";

const NavBarItem = ({ title, classprops }) => (
  <li className={`mx-4 cursor-pointer ${classprops}`}>{title}</li>
);

const Navbar = () => {
  const { currentAccount } = useContext(AuthContext);
  const [toggleMenu, setToggleMenu] = useState(false);
  const renderNotConnectedContainer = () => (
    <ConnectWalletButton />
  );

  const renderAccountInfo = () => (
    <div className="flex flex-row">
      <Wallet />
    </div>
  );

  return (
    <nav className="w-full flex md:justify-center justify-between items-center p-4">
      <div className="md:flex-[0.9] flex-initial justify-center items-center">
        <Link to="/">
          <div className="flex gap-2 text-white text-2xl cursor-pointer font-bold">
            <img alt="Brand logo" className="h-7 self-center" src={logo1} />
            <img alt="Network logo" className="h-5 self-center" src={logo2} />
          </div>
        </Link>
      </div>
      <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
        {currentAccount ? (
          <div className="flex flex-row">
            <Link to="/tasks">
              <NavBarItem title="Find Tasks" />
            </Link>
            <Link to="/services">
              <NavBarItem title="Find Freelancers" />
            </Link>
            <Link to="/services/new">
              <NavBarItem title="Add Service" />
            </Link>
            <Link to="/tasks/new">
              <NavBarItem title="Add Task" />
            </Link>
            <Notifications />
          </div>
        ) : (
          <li />
        )}
        <li>
          {!currentAccount && renderNotConnectedContainer()}
          {currentAccount && renderAccountInfo()}
        </li>
      </ul>
      <div className="flex relative">
        {!toggleMenu && (
          <HiMenuAlt4
            fontSize={28}
            className="text-white md:hidden cursor-pointer"
            onClick={() => setToggleMenu(true)}
          />
        )}
        {toggleMenu && (
          <AiOutlineClose
            fontSize={28}
            className="text-white md:hidden cursor-pointer"
            onClick={() => setToggleMenu(false)}
          />
        )}
        {toggleMenu && (
          <ul
            className="z-10 fixed -top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none
            flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in"
          >
            <li className="text-xl w-full my-2">
              <AiOutlineClose onClick={() => setToggleMenu(false)} />
            </li>
            {currentAccount && (
              <li>
                <Link to="/tasks">
                  <NavBarItem title="Find Tasks" />
                </Link>
                <Link to="/services">
                  <NavBarItem title="Find Freelancers" />
                </Link>
                <Link to="/services/new">
                  <NavBarItem title="Add Service" />
                </Link>
                <Link to="/tasks/new">
                  <NavBarItem title="Add Task" />
                </Link>
                <Notifications />
              </li>
            )}
            <li>
              {!currentAccount && renderNotConnectedContainer()}
              {currentAccount && renderAccountInfo()}
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
