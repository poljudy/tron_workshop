import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Welcome() {
  const { currentAccount } = useContext(AuthContext);

  return (
    <div className="mt-10 text-white text-center items-center">
      <p className="text-2xl">Welcome {currentAccount}!</p>
      <p className="rext-xl">Let us create your profile so the customers can know you better</p>
      <Link to="/profile">
        <button
          type="button"
          className="my-5 bg-[#2952e3] pt-1 pb-1 pl-3 pr-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
        >
          <p className="text-white font-semibold">
            Creatre Profile
          </p>
        </button>
      </Link>
    </div>
  );
}
