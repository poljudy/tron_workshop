import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { TaskContext } from "../../context/TaskContext";
import AuthorActions from "./AuthorActions";
import AssigneeActions from "./AssigneeActions";
import CandidateActions from "./CandidateActions";
import { TaskStatuses } from "../../utils/constants";

const ActionButton = (params) => {
  const { task } = params;
  const { currentAccount } = useContext(AuthContext);
  const { applyForTask } = useContext(TaskContext);
  const isCandidate = () => {
    for (let i = 0; i < task.candidates.length; i += 1) {
      if (task.candidates[i] === currentAccount) {
        return true;
      }
    }
    return false;
  };

  let button;

  if (task.author === currentAccount) {
    button = <AuthorActions task={task} />;
  } else if (
    task.assignee !== "Unassigned" &&
    task.assignee !== currentAccount
  ) {
    button = <p />;
  } else if (task.assignee === currentAccount) {
    button = <AssigneeActions task={task} />;
  } else if (isCandidate()) {
    button = <CandidateActions task={task} />;
  } else if (task.status !== TaskStatuses[4]) {
    button = (
      <div>
        <button
          type="button"
          onClick={() => applyForTask(task.id)}
          className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 w-1/6 text-white rounded-full cursor-pointer hover:bg-[#2546bd]"
        >
          Apply
        </button>
      </div>
    );
  }
  return button;
};

export default ActionButton;
