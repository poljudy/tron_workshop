import { Link } from "react-router-dom";
import { shortenAddress } from "../../utils/shortenAddress";
import AutoAvatar from "../AutoAvatar";

const ServiceCard = ({
  id,
  image,
  title,
  description,
  createdAt,
  author,
  price,
  status,
  category,
}) => (
  <Link to={`/services/${id}`}>
    <div className="w-[20rem] h-[30rem] flex flex-col justify-start text-white white-glassmorphism p-3 m-2 cursor-pointer transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-104 duration-300">
      <img
        alt="Service"
        className="self-center rounded-md"
        src={image}
      />
      {/* <div className="flex flex-row w-full"> */}
      <div className="flex flex-col w-full">
        <div className="mt-2 flex flex-row justify-between">
          <p className="text-3xl truncate ...">{title}</p>
          <p className="text-2xl text-left">{price} TRX</p>
        </div>
        {/* <p className="mt-2 text-white text-3xl">{description}</p> */}
        {/* <p className="mt-1 italic text-white text-sm">Created at: {createdAt} by {shortenAddress(author)}</p> */}
        {/* {
            profile.avatar
            ?
              <img alt="Avatar" className="" src={profile.avatar} /> */}
        {/* : */}
        <div className="flex flex-row items-center">
          <AutoAvatar userId={author} size={36} /> {shortenAddress(author)}{" "}
          {createdAt}
        </div>
        {/* } */}
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

export default ServiceCard;
