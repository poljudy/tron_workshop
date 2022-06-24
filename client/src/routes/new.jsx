import React, { useContext } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PlatformContext } from "../context/PlatformContext";
import { Loader } from "../components";

const FormField = ({ placeholder, name, type, value, handleChange }) => {
  if (name === "projectType") {
    return (
      <select
        className="block appearance-none w-full bg-transparent border text-white py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500"
        value={value}
        type={type}
        onChange={(e) => handleChange(e, name)}
      >
        <option value="0">First Come First Serve</option>
        <option value="1">Author Selected</option>
      </select>
    );
  }
  if (name === "description") {
    return (
      <textarea
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={(e) => handleChange(e, name)}
        className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
      />
    );
  }
  return (
    <input
      placeholder={placeholder}
      type={type}
      step="0.01"
      min="0"
      value={value}
      onChange={(e) => handleChange(e, name)}
      className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
    />
  );
};

export default function NewProject() {
  const { handleChange, addProject, formData, isLoading, fee, balance } =
    useContext(PlatformContext);

  const handleSubmit = (e) => {
    const { title, description, reward } = formData;
    e.preventDefault();
    if (!title || !description || !reward) return;
    addProject();
  };

  const totalAmount = (
    parseFloat(formData.reward) + parseFloat((formData.reward / 100) * fee) || 0
  ).toFixed(4);

  return (
    <div className="flex w-full justify-center items-start min-h-screen">
      <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
        <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
          <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
            New Task
          </h1>
          <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
            Just add a task and enjoy how fast it will be executed.
          </p>
        </div>

        <div className="flex flex-col flex-2 items-center justify-start w-full mf:mt-0 mt-10">
          <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
            <FormField
              placeholder="Title"
              name="title"
              type="text"
              handleChange={handleChange}
            />
            <FormField
              placeholder="Description"
              name="description"
              type="text"
              handleChange={handleChange}
            />
            <div className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism">
              <span
                className="block tracking-wide text-gray-500 text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Type
              </span>
              <div className="relative">
                <FormField
                  name="projectType"
                  type="select"
                  handleChange={handleChange}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  />
                </div>
              </div>
            </div>
            <p className="text-white self-end">Balance: {balance} MATIC</p>
            <FormField
              placeholder="Reward (MATIC)"
              name="reward"
              type="number"
              handleChange={handleChange}
            />
            <div className="h-[1px] w-full bg-gray-400 my-2" />
            <p className="text-white text-center">
              Total amount to pay (including {fee}% portal fee): {totalAmount}{" "}
              MATIC
            </p>
            {isLoading ? (
              <Loader />
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
              >
                Add Task
              </button>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
