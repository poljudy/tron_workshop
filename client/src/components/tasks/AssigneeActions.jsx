import { useContext, useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { TaskContext } from "../../context/TaskContext";
import { PlatformContext } from "../../context/PlatformContext";
import { TaskStatuses } from "../../utils/constants";
import IpfsForm from "./IpfsForm";

const AssigneeActions = () => {
  const { task, unassignTask, submitResult, ipfsUrl } = useContext(TaskContext);
  const { rateUser } = useContext(PlatformContext);
  const [result, setResult] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    setResult(ipfsUrl);
  }, [ipfsUrl]);

  const handleSubmit = (e) => {
    if (result === "") return;
    e.preventDefault();
    submitResult(task.id, result);
  };

  const handleClick = (e) => {
    if (rating === 0) return;
    e.preventDefault();
    rateUser(task.author, rating);
  };

  const calculateDaysLeft = (date) => {
    const currentTime = new Date();
    console.log(currentTime);
    const prevTime = new Date(date);
    console.log(date);
    console.log(prevTime);
    const differenceInTime = currentTime.getTime() - prevTime.getTime();
    const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24);
    return differenceInDays;
  };

  if (task.status === TaskStatuses[2]) {
    return (
      <>
        <p className="mt-5 text-2xl text-white text-basetext-white">
          Result submitted. Waiting for completion from the author.
        </p>
        <p>Feel free to request payment if you did not receive your reward within 10 days</p>
        <p>(Request Payment will be available in {calculateDaysLeft(task.lastStatusChangeAt)} days)</p>
        <button
          type="button"
          className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 w-1/6 text-white rounded-full cursor-pointer hover:bg-[#2546bd]"
        >
          Request Payment
        </button>
      </>
    );
  }

  if (task.status === TaskStatuses[4]) {
    return (
      <div>
        <p className="mt-5 text-2xl text-white text-basetext-white">
          Congrats! Your task is complete. The reward is sent to your wallet.
        </p>
        <p className="mt-3 text-white">Please rate the task author</p>
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
          className="flex flex-row justify-center items-center my-5 bg-[#134e4a] p-3 text-white rounded-full cursor-pointer hover:bg-[#2546bd]"
          onClick={handleClick}
        >
          Rate The Task Author
        </button>
      </div>
    );
  }
  return (
    <div>
      <button
        type="button"
        className="flex flex-row justify-center items-center my-5 bg-yellow-700 pl-3 w-1/6 text-white rounded-full cursor-pointer hover:bg-[#2546bd]"
        onClick={() => unassignTask(task.id)}
      >
        Unassign
      </button>
      <IpfsForm />
      <input
        className="my-2 w-9/12 rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
        placeholder="Result Link"
        name="result"
        type="text"
        value={result}
        onChange={(e) => setResult(e.target.value)}
      />
      <button
        type="button"
        className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 w-1/6 text-white rounded-full cursor-pointer hover:bg-[#2546bd]"
        onClick={handleSubmit}
      >
        Submit Result
      </button>
    </div>
  );
};

export default AssigneeActions;
