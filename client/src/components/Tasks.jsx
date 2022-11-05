import { useContext } from "react";
import { PlatformContext } from "../context/PlatformContext";
import TaskCard from "./TaskCard";

const Tasks = () => {
  const { tasks } = useContext(PlatformContext);
  return (
    <>
      {tasks.length < 1 && (
        <p className="text-white text-2xl text-center my-2">
          No tasks yet
        </p>
      )}
      <div className="flex flex-row w-full justify-center items-center mt-10">
        {tasks &&
          [...tasks]
            .reverse()
            .map((task, i) => <TaskCard key={i} {...task} />)}
      </div>
    </>
  );
};

export default Tasks;
