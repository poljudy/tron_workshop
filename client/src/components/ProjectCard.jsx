import { Link } from "react-router-dom";

const ProjectCard = ({
  id,
  title,
  createdAt,
  projectType,
  reward,
  status,
  category,
  candidates
}) => (
  <Link to={`/${id}`}>
    <div className="flex flex-row justify-center items-start white-glassmorphism p-3 m-2 cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300">
      <div className="ml-5 flex flex-col flex-1">
        <p className="mt-2 text-white text-3xl md:w-9/12">{title}</p>
        <p className="mt-1 italic text-white text-sm md:w-9/12">{projectType}</p>
        <p className="mt-1 italic text-white text-sm md:w-9/12">Created at: {createdAt}</p>
        <p className="mt-1 italic text-white text-sm md:w-9/12">Candidates: {candidates.length}</p>
        <div className="flex flex-row gap-2 items-center">
          <div className="mt-2 text-center text-white white-glassmorphism w-2/12 ">{status}</div>
          <div className="mt-2 text-center text-white white-glassmorphism w-3/12">{category}</div>
        </div>

        {/* <p className="mt-1 italic text-white text-sm md:w-9/12">Completed at: {completedAt}</p> */}
      </div>
      <div>
        <p className="mt-2 text-white text-xl">{reward} TRX</p>
      </div>
    </div>
  </Link>
);

export default ProjectCard;
