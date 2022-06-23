import { useContext } from "react";
import { PlatformContext } from "../context/PlatformContext";

const CandidateActions = () => {
  const {
    project
  } = useContext(PlatformContext);

  if (project.assignee === "Unassigned") {
    return (
      <div>
        <p className="mt-5 text-2xl text-white text-basetext-white">
          You are in the candidates list. Please wait until an assignee selected.
        </p>
      </div>
    );
  }
  return (
    <div>
      <p className="mt-5 text-2xl text-white text-basetext-white">
        Unfortunately, you were not selected for this task. Good luck next time ;)
      </p>
    </div>
  );
};

export default CandidateActions;
