import { useContext } from "react";
import { PlatformContext } from "../context/PlatformContext";
import AuthorActions from "./AuthorActions";
import AssigneeActions from "./AssigneeActions";
import CandidateActions from "./CandidateActions";

const ActionButton = (params) => {
  const { currentAccount, applyForProject } =
    useContext(PlatformContext);
  const current = currentAccount.toString().toLowerCase();
  const isCandidate = (address) => {
    for (let i = 0; i < params.project.candidates.length; i++) {
      if (params.project.candidates[i].candidate.toLowerCase() === address) {
        return true;
      }
    }
    return false;
  };
  let button;
  if (params.project.author === current) {
    button = <AuthorActions />;
  } else if (params.project.assignee !== "Unassigned" && params.project.assignee !== current) {
    button = <p />;
  } else if (params.project.assignee === current) {
    button = <AssigneeActions />;
  } else if (isCandidate(current)) {
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
