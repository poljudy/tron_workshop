import { useContext } from "react";
import { PlatformContext } from "../context/PlatformContext";
import AuthorActions from "./AuthorActions";
import AssigneeActions from "./AssigneeActions";
import CandidateActions from "./CandidateActions";

const ActionButton = (params) => {
  const { currentAccount, applyForProject } = useContext(PlatformContext);
  const isCandidate = () => {
    for (let i = 0; i < params.project.candidates.length; i += 1) {
      if (params.project.candidates[i] === currentAccount) {
        return true;
      }
    }
    return false;
  };
  let button;
  if (params.project.author === currentAccount) {
    button = <AuthorActions />;
  } else if (
    params.project.assignee !== "Unassigned" &&
    params.project.assignee !== currentAccount
  ) {
    button = <p />;
  } else if (params.project.assignee === currentAccount) {
    button = <AssigneeActions />;
  } else if (isCandidate()) {
    button = <CandidateActions />;
  } else {
    button = (
      <div>
        <button
          type="button"
          onClick={() => applyForProject(params.project.id)}
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
