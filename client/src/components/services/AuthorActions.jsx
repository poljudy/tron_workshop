import { useContext, useState } from "react";
// import { FaStar } from "react-icons/fa";
import { ServiceContext } from "../../context/ServiceContext";
// import { shortenAddress } from "../utils/shortenAddress";
import { ServiceStatuses } from "../../utils/constants";

const AuthorActions = () => {
  const { service, deleteService, pauseService, resumeService } =
    useContext(ServiceContext);
  // const [rating, setRating] = useState(0);
  // const [hover, setHover] = useState(0);
  // const defaultSelectValue = "Select a candidate to assign";
  // const [selected, setSelected] = useState(defaultSelectValue);
  // const [message, setMessage] = useState("");

  // const handleAssign = (e) => {
  //   if (selected === "Select a candidate to assign") return;
  //   e.preventDefault();
  //   assignTask(task.id, selected);
  // };

  // const handleComplete = (e) => {
  //   if (rating === 0) return;
  //   e.preventDefault();
  //   completeTask(task.id, rating);
  // };

  // const handleRequestChange = (e) => {
  //   e.preventDefault();
  //   requestChange(task.id, message);
  // };

  // If the task is not assigned
  // if (service.status === "Active") {
  // if (task.candidates.length > 0) {
  //   return (
  //     <div>
  //       <select
  //         className="mt-4 block appearance-none bg-transparent border text-white py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500"
  //         id="select"
  //         name="candidate"
  //         type="select"
  //         defaultValue={selected}
  //         style={{
  //           color: selected === defaultSelectValue ? "gray" : "white",
  //         }}
  //         onChange={(e) => setSelected(e.target.value)}
  //       >
  //         <option value="">{defaultSelectValue}</option>
  //         {task.candidates.map((candidate, i) => (
  //           <option key={i} value={candidate.candidate}>
  //             {candidate.candidate} - rating: {candidate.rating === 0 ? "unrated" : `${candidate.rating}/5`}
  //           </option>
  //         ))}
  //       </select>
  //       <div className="flex flex-row">
  //         <button
  //           type="button"
  //           className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 w-1/6 text-white rounded-full cursor-pointer hover:bg-[#2546bd]"
  //           onClick={handleAssign}
  //         >
  //           Assign Candidate
  //         </button>
  //         <button
  //           type="button"
  //           className="flex flex-row justify-center items-center my-5 bg-[#831843] p-3 w-1/6 text-white rounded-full cursor-pointer hover:bg-[#2546bd]"
  //           onClick={() => deleteTask(task.id)}
  //         >
  //           Delete Task
  //         </button>
  //       </div>
  //       <p className="text-white">
  //         * NOTE: If you delete the task, only reward amount will be returned
  //         to your wallet.
  //       </p>
  //       <p className="text-white">
  //         Platform fee will not be returned in order to prevent spamming on
  //         the platform.
  //       </p>
  //     </div>
  //   );
  // }
  //   return (
  //     <div>
  //       <button
  //         type="button"
  //         className="flex flex-row justify-center items-center my-5 bg-[#831843] p-3 w-1/6 text-white rounded-full cursor-pointer hover:bg-[#2546bd]"
  //         onClick={() => deleteService(service.id)}
  //       >
  //         Delete Service
  //       </button>
  //       {/* <p className="text-white">
  //         * NOTE: If you delete the task, only reward amount will be returned to
  //         your wallet.
  //       </p> */}
  //       {/* <p className="text-white">
  //         Platform fee will not be returned in order to prevent spamming on the
  //         platform.
  //       </p> */}
  //     </div>
  //   );
  // }
  // If the task is assigned
  return (
    <div className="flex flex-row gap-2">
      {service.status === ServiceStatuses[0] ? (
        <button
          type="button"
          className="flex flex-row justify-center items-center my-5 bg-yellow-700 p-3 w-1/6 text-white rounded-full cursor-pointer hover:bg-[#2546bd]"
          onClick={() => pauseService(service.id)}
        >
          Pause Service
        </button>
      ) : (
        <button
          type="button"
          className="flex flex-row justify-center items-center my-5 bg-green-700 p-3 w-1/6 text-white rounded-full cursor-pointer hover:bg-[#2546bd]"
          onClick={() => resumeService(service.id)}
        >
          Resume Service
        </button>
      )}
      <button
        type="button"
        className="flex flex-row justify-center items-center my-5 bg-[#831843] p-3 w-1/6 text-white rounded-full cursor-pointer hover:bg-[#2546bd]"
        onClick={() => deleteService(service.id)}
      >
        Delete Service
      </button>
    </div>
  );
};

export default AuthorActions;
