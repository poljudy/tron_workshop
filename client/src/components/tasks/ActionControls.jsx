import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { TaskContext } from "../../context/TaskContext";
import AuthorActions from "./AuthorActions";
import AssigneeActions from "./AssigneeActions";
import CandidateActions from "./CandidateActions";

const ActionButton = (params) => {
  const { currentAccount } = useContext(AuthContext);
  const { applyForTask } = useContext(TaskContext);
  const isCandidate = () => {
    for (let i = 0; i < params.task.candidates.length; i += 1) {
      if (params.task.candidates[i] === currentAccount) {
        return true;
      }
    }
    return false;
  };

  let button;

  if (params.task.author === currentAccount) {
    button = <AuthorActions />;
  } else if (
    params.task.assignee !== "Unassigned" &&
    params.task.assignee !== currentAccount
  ) {
    button = <p />;
  } else if (params.task.assignee === currentAccount) {
    button = <AssigneeActions />;
  } else if (isCandidate()) {
    button = <CandidateActions />;
  } else {
    button = (
      <div>
        <button
          type="button"
          onClick={() => applyForTask(params.task.id)}
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
