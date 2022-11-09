import { useContext, useState } from "react";
import { TaskContext } from "../../context/TaskContext";

const AssigneeActions = () => {
  const { task, unassignTask, submitResult } =
    useContext(TaskContext);
  const [result, setResult] = useState("");
  const handleSubmit = (e) => {
    if (result === "") return;
    e.preventDefault();
    submitResult(task.id, result);
  };
  if (task.result) {
    return (
      <p className="mt-5 text-2xl text-white text-basetext-white">
        Result submitted. Waiting for completion from the author.
      </p>
    );
  }
  return (
    <div>
      <button
        type="button"
        className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 w-1/6 text-white rounded-full cursor-pointer hover:bg-[#2546bd]"
        onClick={() => unassignTask(task.id)}
      >
        Unassign
      </button>
      <input
        className="my-2 w-9/12 rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
        placeholder="Result Link"
        name="result"
        type="text"
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
