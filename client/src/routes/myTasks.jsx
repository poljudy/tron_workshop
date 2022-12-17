import React, { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { TaskCard } from "../components";
import { AuthContext } from "../context/AuthContext";
import { TaskContext } from "../context/TaskContext";

const MyTasks = () => {
  const { currentAccount } = useContext(AuthContext);
  const { tasks, getAllTasks } = useContext(TaskContext);

  useEffect(() => {
    if (window.tronWeb) {
      getAllTasks();
    }
  }, []);

  function checkTask(task) {
    return task.author === currentAccount
    || task.assignee === currentAccount
    || task.candidates.includes(currentAccount);
  }
  return (
    <>
      <div className="flex w-full justify-center items-start 2xl:px-20 gradient-bg-welcome min-h-screen">
        <div className="flex flex-col w-9/12 md:p-12 py-12 px-4">
          {currentAccount ? (
            <h3 className="text-white text-3xl text-center my-2">Your Tasks</h3>
          ) : (
            <h3 className="text-white text-3xl text-center my-2">
              Connect your account to see the latest tasks
            </h3>
          )}

          <div className="flex flex-wrap justify-center items-center mt-10">
            {[...tasks]
              .reverse()
              .filter(
                (p) => checkTask(p)
              )
              .map((task, i) => (
                <TaskCard key={i} {...task} />
              ))}
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default MyTasks;
