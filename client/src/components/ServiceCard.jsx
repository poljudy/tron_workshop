import { Link } from "react-router-dom";

const ServiceCard = ({
  id,
  title,
  createdAt,
  price,
  status,
  category
}) => (
  <Link to={`/services/${id}`}>
    <div className="flex flex-row justify-center items-start white-glassmorphism p-3 m-2 cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300">
      <div className="ml-5 flex flex-col flex-1">
        <p className="mt-2 text-white text-3xl">{title}</p>
        <p className="mt-1 italic text-white text-sm">Created at: {createdAt}</p>
        <div className="flex flex-row gap-2 items-center">
          <div className="mt-2 pl-2 pr-2 text-center text-white white-glassmorphism">{status}</div>
          <div className="mt-2 pl-2 pr-2 text-center text-white white-glassmorphism">{category}</div>
        </div>

        {/* <p className="mt-1 italic text-white text-sm md:w-9/12">Completed at: {completedAt}</p> */}
      </div>
      <div>
        <p className="mt-2 text-white text-xl">{price} TRX</p>
      </div>
    </div>
  </Link>
);

export default ServiceCard;
