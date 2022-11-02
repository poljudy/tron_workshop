import { useContext, useState } from "react";
import { FaStar } from "react-icons/fa";
import { PlatformContext } from "../context/PlatformContext";
// import { shortenAddress } from "../utils/shortenAddress";

const AuthorActions = () => {
  const {
    task,
    deleteTask,
    assignTask,
    unassignTask,
    requestChange,
    completeTask,
  } = useContext(PlatformContext);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const defaultSelectValue = "Select a candidate to assign";
  const [selected, setSelected] = useState(defaultSelectValue);
  const [message, setMessage] = useState("");

  const handleAssign = (e) => {
    if (selected === "Select a candidate to assign") return;
    e.preventDefault();
    assignTask(task.id, selected);
  };

  const handleComplete = (e) => {
    if (rating === 0) return;
    e.preventDefault();
    completeTask(task.id, rating);
  };

  const handleRequestChange = (e) => {
    e.preventDefault();
    requestChange(task.id, message);
  };

  // If the task is not assigned
  if (task.status === "Active") {
    if (task.candidates.length > 0) {
      return (
        <div>
          <select
            className="mt-4 block appearance-none bg-transparent border text-white py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500"
            id="select"
            name="candidate"
            type="select"
            defaultValue={selected}
            style={{
              color: selected === defaultSelectValue ? "gray" : "white",
            }}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">{defaultSelectValue}</option>
            {task.candidates.map((candidate, i) => (
              <option key={i} value={candidate.candidate}>
                {candidate.candidate} - rating: {candidate.rating === 0 ? "unrated" : `${candidate.rating}/5`}
              </option>
            ))}
          </select>
          <div className="flex flex-row">
            <button
              type="button"
              className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 w-1/6 text-white rounded-full cursor-pointer hover:bg-[#2546bd]"
              onClick={handleAssign}
            >
              Assign Candidate
            </button>
            <button
              type="button"
              className="flex flex-row justify-center items-center my-5 bg-[#831843] p-3 w-1/6 text-white rounded-full cursor-pointer hover:bg-[#2546bd]"
              onClick={() => deleteTask(task.id)}
            >
              Delete Task
            </button>
          </div>
          <p className="text-white">
            * NOTE: If you delete the task, only reward amount will be returned
            to your wallet.
          </p>
          <p className="text-white">
            Platform fee will not be returned in order to prevent spamming on
            the platform.
          </p>
        </div>
      );
    }
    return (
      <div>
        <button
          type="button"
          className="flex flex-row justify-center items-center my-5 bg-[#831843] p-3 w-1/6 text-white rounded-full cursor-pointer hover:bg-[#2546bd]"
          onClick={() => deleteTask(task.id)}
        >
          Delete Task
        </button>
        <p className="text-white">
          * NOTE: If you delete the task, only reward amount will be returned to
          your wallet.
        </p>
        <p className="text-white">
          Platform fee will not be returned in order to prevent spamming on the
          platform.
        </p>
      </div>
    );
  }
  // If the task is assigned
  return (
    <div>
      {task.result ? (
        <>
          <p className="mt-3 text-white">Please rate the assignee first</p>
          <p className="text-white">and then mark the task as complete.</p>
          <div className="flex flex-row">
            {[...Array(5)].map((star, i) => {
              const ratingValue = i + 1;
              return (
                <label>
                  <input
                    type="radio"
                    name="rating"
                    value={ratingValue}
                    style={{ display: "none" }}
                    onClick={() => setRating(ratingValue)}
                  />
                  <FaStar
                    color={
                      ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"
                    }
                    size={40}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(null)}
                  />
                </label>
              );
            })}
          </div>
          <button
            type="button"
            className="flex flex-row justify-center items-center my-5 bg-[#134e4a] p-3 w-1/6 text-white rounded-full cursor-pointer hover:bg-[#2546bd]"
            onClick={handleComplete}
          >
            Complete
          </button>
          <p className="mt-3 text-white">Not satisfied with the result?</p>
          <p className="text-white">Submit a change request (You can submit up to 3 change requests).</p>
          <textarea
            className="my-2 w-9/12 rounded-sm p-2 outline-none bg-transparent text-white text-sm white-glassmorphism"
            placeholder="Describe what exactly you'd like to change..."
            name="requestMessage"
            type="text"
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="button"
            className="flex flex-row justify-center items-center my-5 bg-[#9c3a06] p-3 w-1/6 text-white rounded-full cursor-pointer hover:bg-[#2546bd]"
            onClick={handleRequestChange}
          >
            Request Change
          </button>
        </>
      ) : (
        <button
          type="button"
          className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 w-1/6 text-white rounded-full cursor-pointer hover:bg-[#2546bd]"
          onClick={() => unassignTask(task.id)}
        >
          Unassign
        </button>
      )}
    </div>
  );
};

export default AuthorActions;
