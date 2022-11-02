import { useContext } from "react";
import { PlatformContext } from "../context/PlatformContext";
import TaskCard from "./TaskCard";

const Tasks = () => {
  const { tasks } = useContext(PlatformContext);
  return (
    <>
      {!tasks && (
        <p className="text-white text-3xl text-center my-2">
          No tasks yet
        </p>
      )}
      <div className="list-none justify-center items-center mt-10">
        {tasks &&
          [...tasks]
            .reverse()
            .map((task, i) => <TaskCard key={i} {...task} />)}
      </div>
    </>
  );
};

export default Tasks;
