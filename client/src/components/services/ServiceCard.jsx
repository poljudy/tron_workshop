import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
// import { ProfileContext } from "../../context/ProfileContext";
// import { shortenAddress } from "../../utils/shortenAddress";
import AutoAvatar from "../AutoAvatar";
import { contractAddress } from "../../utils/constants";
import contractABI from "../../utils/contractABI.json";
import { AuthContext } from "../../context/AuthContext";

const ServiceCard = ({
  id,
  image,
  title,
  createdAt,
  author,
  price,
  status,
  category,
}) => {
  const [profile, setProfile] = useState(null);
  const { tronWeb } = useContext(AuthContext);

  const getProfile = async (address) => {
    if (tronWeb && address) {
      try {
        const contract = await tronWeb.contract(contractABI, contractAddress);
        const r = await contract.getProfile(address).call();
        setProfile(r);
      } catch (error) {
        console.log(error);
        alert(error.message);
      }
    } else {
      console.log("Tron is not present");
    }
  };
  useEffect(() => {
    getProfile(author);
  }, []);

  return (
    <Link to={`/services/${id}`}>
      <div className="w-[20rem] h-[30rem] flex flex-col justify-start text-white white-glassmorphism p-3 m-2 cursor-pointer transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-104 duration-300">
        <img alt="Service" className="self-center rounded-md" src={image} />
        {/* <div className="flex flex-row w-full"> */}
        <div className="flex flex-col w-full">
          <div className="mt-2 flex flex-row justify-between">
            <p className="text-3xl truncate ...">{title}</p>
            <p className="text-2xl text-left">{price} TRX</p>
          </div>
          <div className="flex flex-row items-center">
            {profile && profile.avatar ? (
              <img alt="Avatar" className="" src={profile.avatar} />
            ) : (
              <AutoAvatar userId={author} size={36} />
            )}
            {profile ? profile.username : author}
          </div>
          {createdAt}
          <div className="flex flex-row gap-2 items-center">
            <div className="mt-2 pl-2 pr-2 text-center white-glassmorphism">
              {category}
            </div>
            <div className="mt-2 pl-2 pr-2 text-center white-glassmorphism">
              {status}
            </div>
          </div>

          {/* <p className="mt-1 italic text-white text-sm md:w-9/12">Completed at: {completedAt}</p> */}
        </div>
        {/* </div> */}
      </div>
    </Link>
  );
};

export default ServiceCard;
