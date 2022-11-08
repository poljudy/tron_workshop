import { Link } from "react-router-dom";

const TaskCard = ({
  id,
  title,
  createdAt,
  taskType,
  reward,
  status,
  category,
  candidates
}) => (
  <Link to={`/tasks/${id}`}>
    <div className="flex flex-row justify-center items-start white-glassmorphism p-3 m-2 cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-300">
      <div className="ml-5 flex flex-col flex-1">
        <p className="mt-2 text-white text-3xl md:w-9/12">{title}</p>
        <p className="text-center italic text-white text-sm white-glassmorphism">{taskType}</p>
        <p className="mt-1 italic text-white text-sm">Created at: {createdAt}</p>
        <p className="mt-1 italic text-white text-sm">Candidates: {candidates.length}</p>
        <div className="flex flex-row gap-2 items-center">
          <div className="mt-2 pl-2 pr-2 text-center text-white white-glassmorphism">{status}</div>
          <div className="mt-2 pl-2 pr-2 text-center text-white white-glassmorphism">{category}</div>
        </div>

        {/* <p className="mt-1 italic text-white text-sm md:w-9/12">Completed at: {completedAt}</p> */}
      </div>
      <div>
        <p className="mt-2 text-white text-xl">{reward} TRX</p>
      </div>
    </div>
  </Link>
);

export default TaskCard;
