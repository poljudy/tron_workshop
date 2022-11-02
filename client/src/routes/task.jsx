import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PlatformContext } from "../context/PlatformContext";
import { Loader, ActionControls, Candidates } from "../components";

export default function Task() {
  const params = useParams();
  const { task, getTask, isLoading } = useContext(PlatformContext);
  const taskId = params.id;
  useEffect(() => {
    getTask(taskId);
  }, []);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto flex flex-row self-center items-start white-glassmorphism p-3">
        <div className="ml-5 flex flex-col flex-1">
          <h3 className="mt-2 text-white text-4xl">{task.title}</h3>
          <div className="flex flex-row gap-2 items-center">
            <div className="mt-2 text-center text-white white-glassmorphism w-3/12">{task.category}</div>
            <div className="mt-2 text-center text-white white-glassmorphism w-6/12 ">{task.status} since {task.lastStatusChangeAt}</div>
          </div>
          <p className="mt-1 text-white text-2xl md:w-9/12">
            {task.description}
          </p>
          <p className="mt-1 text-white text-sm md:w-9/12">
            Type: {task.taskType}
          </p>
          <p className="mt-1 text-white text-sm md:w-9/12">
            Author: {task.author}
          </p>
          {task.taskType === "First Come First Serve" ? (
            <span />
          ) : (
            <div className="mt-1 text-white text-sm md:w-9/12">
              Candidates applied ({task.candidates ? task.candidates.length : 0}):
              <Candidates candidates={task.candidates} />
            </div>
          )}

          <p className="mt-1 text-white text-sm md:w-9/12">
            Assignee: {task.assignee}
          </p>
          <p className="mt-1 text-white text-sm md:w-9/12">
            Result:{" "}
            {task.result ? (
              <a
                rel="noreferrer"
                className="text-[#6366f1]"
                href={task.result}
                target="_blank"
              >
                {task.result}
              </a>
            ) : (
              "Not submitted yet"
            )}
          </p>
          <p className="mt-1 italic text-white text-sm md:w-9/12">
            Ceated at: {task.createdAt}
          </p>
          <p className="mt-1 italic text-white text-sm md:w-9/12">
            Completed at: {task.completedAt}
          </p>
          <p className="mt-1 text-white text-sm md:w-9/12">Change Requests: {task.changeRequests}</p>

          {isLoading ? (
            <Loader />
          ) : (
            task.completedAt === "Not completed yet" && (
              <ActionControls task={task} />
            )
          )}
        </div>
        <div>
          <p className="mt-2 text-white text-2xl">{task.reward} TRX</p>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}
