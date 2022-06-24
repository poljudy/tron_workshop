import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PlatformContext } from "../context/PlatformContext";
import { Loader, ActionControls } from "../components";

export default function Project() {
  const params = useParams();
  const { project, getProject, isLoading } = useContext(PlatformContext);
  const projectId = params.id;
  useEffect(() => {
    getProject(projectId);
  }, []);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto flex flex-row self-center items-start white-glassmorphism p-3">
        <div className="ml-5 flex flex-col flex-1">
          <h3 className="mt-2 text-white text-4xl">{project.title}</h3>
          <p className="mt-1 text-white text-2xl md:w-9/12">
            {project.description}
          </p>
          <p className="mt-1 text-white text-sm md:w-9/12">
            Type: {project.projectType}
          </p>
          <p className="mt-1 text-white text-sm md:w-9/12">
            Author: {project.author}
          </p>
          {project.projectType === "First Come First Serve" ? (
            <span />
          ) : (
            <p className="mt-1 text-white text-sm md:w-9/12">
              Candidates applied:{" "}
              {project.candidates ? project.candidates.length : 0}
            </p>
          )}

          <p className="mt-1 text-white text-sm md:w-9/12">
            Assignee: {project.assignee}
          </p>
          <p className="mt-1 text-white text-sm md:w-9/12">
            Result:{" "}
            {project.result ? (
              <a
                rel="noreferrer"
                className="text-[#6366f1]"
                href={project.result}
                target="_blank"
              >
                {project.result}
              </a>
            ) : (
              "Not submitted yet"
            )}
          </p>
          <p className="mt-1 italic text-white text-sm md:w-9/12">
            Ceated at: {project.createdAt}
          </p>
          <p className="mt-1 italic text-white text-sm md:w-9/12">
            Completed at: {project.completedAt}
          </p>

          {isLoading ? (
            <Loader />
          ) : (
            project.completedAt === "Not completed yet" && (
              <ActionControls project={project} />
            )
          )}
        </div>
        <div>
          <p className="mt-2 text-white text-2xl">{project.reward} MATIC</p>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}
