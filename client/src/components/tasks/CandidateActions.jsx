
const CandidateActions = (params) => {
  const { task } = params;

  if (task.assignee === "Unassigned") {
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
