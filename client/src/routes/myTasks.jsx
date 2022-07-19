import React, { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import { PlatformContext } from "../context/PlatformContext";

const MyTasks = () => {
  const { projects, getAllProjects, currentAccount } = useContext(PlatformContext);

  useEffect(() => {
    getAllProjects();
  }, []);

  function checkTask(task) {
    return task.author === currentAccount
    || task.assignee === currentAccount
    || task.candidates.includes(currentAccount);
  }
  return (
    <>
      <div className="flex w-full justify-center items-start 2xl:px-20 gradient-bg-welcome min-h-screen">
        <div className="flex flex-col md:p-12 py-12 px-4">
          {currentAccount ? (
            <h3 className="text-white text-3xl text-center my-2">Your Tasks</h3>
          ) : (
            <h3 className="text-white text-3xl text-center my-2">
              Connect your account to see the latest tasks
            </h3>
          )}

          <div className="flex flex-wrap justify-center items-center mt-10">
            {[...projects]
              .reverse()
              .filter(
                (p) => checkTask(p)
              )
              .map((project, i) => (
                <ProjectCard key={i} {...project} />
              ))}
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default MyTasks;
