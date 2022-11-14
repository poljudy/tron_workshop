import { Link } from "react-router-dom";
import AutoAvatar from "../AutoAvatar";
import { shortenAddress } from "../../utils/shortenAddress";
import { TaskTypes } from "../../utils/constants";

const TaskCard = ({
  id,
  title,
  description,
  author,
  createdAt,
  taskType,
  reward,
  status,
  category,
  // candidates
}) => (
  <Link to={`/tasks/${id}`}>
    <div className="w-[24rem] h-[16rem] flex flex-row justify-center items-start text-white white-glassmorphism p-3 m-2 cursor-pointer transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-104 duration-300">
      <div className="flex flex-col w-full justify-center">
        <div className="flex flex-row justify-between">
          <p className="text-3xl truncate ...">{title}</p>
        </div>
        <p className="mt-2 text-sm truncate ...">{description}</p>
        {/* {taskType !== TaskTypes[0] && <p className="mt-1 italic text-sm">Candidates: {candidates.length}</p>} */}
        <p className="mt-2 text-center italic text-sm white-glassmorphism">{taskType}</p>
        <div className="flex flex-row gap-2 items-center">
          <div className="mt-2 pl-2 pr-2 text-center white-glassmorphism">{category}</div>
          <div className="mt-2 pl-2 pr-2 text-center white-glassmorphism">{status}</div>
        </div>
        {/* <p className="mt-1 italic text-sm">Created at: {createdAt} by {shortenAddress(author)}</p> */}
        {/* {
            profile.avatar
            ?
              <img alt="Avatar" className="" src={profile.avatar} /> */}
        {/* : */}
        <div className=" mt-6 flex flex-row items-center">
          <AutoAvatar userId={author} size={36} /> {shortenAddress(author)}{" "}
          {createdAt}
        </div>
        {/* } */}
        <p className="text-2xl self-end">{reward} TRX</p>
        {/* <p className="mt-1 italic text-white text-sm md:w-9/12">Completed at: {completedAt}</p> */}
      </div>
    </div>
  </Link>
);

export default TaskCard;
