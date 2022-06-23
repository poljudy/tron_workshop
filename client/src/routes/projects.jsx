import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import { PlatformContext } from "../context/PlatformContext";

const Projects = () => {
  const { projects, currentAccount } = useContext(PlatformContext);

  return (
    <>
      <div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-welcome">
        <div className="flex flex-col md:p-12 py-12 px-4">
          {currentAccount ? (
            <h3 className="text-white text-3xl text-center my-2">
              Latest Projects
            </h3>
          ) : (
            <h3 className="text-white text-3xl text-center my-2">
              Connect your account to see the latest projects
            </h3>
          )}

          <div className="flex flex-wrap justify-start items-center mt-10">
            {[...projects].reverse().map((project, i) => (
              <ProjectCard key={i} {...project} />
            ))}
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Projects;
