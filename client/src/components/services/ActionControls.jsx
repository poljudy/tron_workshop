import { useContext } from "react";
import { PlatformContext } from "../../context/PlatformContext";
import { AuthContext } from "../../context/AuthContext";
import { ServiceContext } from "../../context/ServiceContext";
import AuthorActions from "./AuthorActions";
// import AssigneeActions from "./AssigneeActions";
// import CandidateActions from "./CandidateActions";

const ActionButton = (params) => {
  const { currentAccount } = useContext(AuthContext);
  const { requestService } = useContext(ServiceContext);
  // const isCandidate = () => {
  //   for (let i = 0; i < params.task.candidates.length; i += 1) {
  //     if (params.task.candidates[i] === currentAccount) {
  //       return true;
  //     }
  //   }
  //   return false;
  // };
  let button;
  if (params.service.author === currentAccount) {
    button = <AuthorActions />;
  } else {
    button = (
      <div>
        <button
          type="button"
          onClick={() => requestService(params.service.id)}
          className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 w-1/6 text-white rounded-full cursor-pointer hover:bg-[#2546bd]"
        >
          Request Service
        </button>
      </div>
    );
  }
  return button;
};

export default ActionButton;
