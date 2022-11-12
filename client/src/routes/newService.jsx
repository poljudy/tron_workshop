import React, { useContext } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PlatformContext } from "../context/PlatformContext";
import { ServiceContext } from "../context/ServiceContext";
import { Loader } from "../components";
import { Categories } from "../utils/constants";

const FormField = ({ placeholder, name, type, value, handleChange }) => {
  if (name === "category") {
    return (
      <select
        className="appearance-none w-full white-glassmorphism text-white py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500 light:text-gray-800"
        value={value}
        type={type}
        onChange={(e) => handleChange(e, name)}
      >
        {Categories.map((c, i) => (
          <option className="white-glassmorphism" key={i} value={c}>
            {c}
          </option>
        ))}
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
        className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border white-glassmorphism"
      />
    );
  }
  return (
    <input
      placeholder={placeholder}
      type={type}
      step="0.1"
      min="0"
      value={value}
      onChange={(e) => handleChange(e, name)}
      className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border white-glassmorphism"
    />
  );
};

export default function NewService() {
  const { isLoading } = useContext(PlatformContext);

  const { handleChange, formData, addService, onUploadHandler, ipfsUrl } = useContext(ServiceContext);

  const handleSubmit = (e) => {
    const { title, description, price } = formData;
    e.preventDefault();
    if (!title || !description || !price) return;
    addService();
  };

  return (
    <div className="flex w-full justify-center items-start min-h-screen">
      <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
        <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
          <h1 className="text-3xl sm:text-5xl text-white py-1">Add Service</h1>
          <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
            Let your customers know what your services are.
          </p>
        </div>

        <div className="flex flex-col flex-2 items-center justify-start w-full mf:mt-0 mt-10">
          <div className="p-5 w-full flex flex-col justify-start items-center blue-glassmorphism">
            <div className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism">
              <span
                className="block tracking-wide text-gray-20 text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Category
              </span>
              <div className="relative">
                <FormField
                  name="category"
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
            <div className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism">
              <span
                className="block tracking-wide text-gray-20 text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Image
              </span>
              <div className="relative">
                <div>
                  <p className=" text-l text-white text-basetext-white">
                    Upload an image for your service to IPFS
                  </p>
                  {ipfsUrl && <img alt="Service" className="self-center" src={ipfsUrl} />}
                  <form onSubmit={onUploadHandler}>
                    <input
                      className="mt-5 text-l text-white text-basetext-white"
                      type="file"
                      name="file"
                    />
                    {isLoading ? (
                      <Loader />
                    ) : (
                      <button
                        className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                        id="upload-btn"
                        type="submit"
                      >
                        Upload File
                      </button>
                    )}
                  </form>
                </div>
              </div>
            </div>
            <div className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism">
              <span
                className="block tracking-wide text-gray-20 text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Title
              </span>
              <FormField
                placeholder="title..."
                name="title"
                type="text"
                handleChange={handleChange}
              />
            </div>
            <div className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism">
              <span
                className="block tracking-wide text-gray-20 text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Description
              </span>
              <FormField
                placeholder="Describe your services (e.g. I will...)"
                name="description"
                type="text"
                handleChange={handleChange}
              />
            </div>
            <div className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism">
              <span
                className="block tracking-wide text-gray-20 text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Price
              </span>
              <div className="flex flex-row gap-2">
                <FormField
                  placeholder="0"
                  name="price"
                  type="number"
                  handleChange={handleChange}
                />
                <span className="text-white self-center">TRX</span>
              </div>
            </div>
            <div className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism">
              <span
                className="block tracking-wide text-gray-20 text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Delivery Time
              </span>
              <div className="flex flex-row gap-2">
                <FormField
                  placeholder="0"
                  name="deliveryTime"
                  type="number"
                  handleChange={handleChange}
                />
                <span className="text-white self-center">days</span>
              </div>
            </div>
            <div className="h-[1px] w-full bg-gray-400 my-2" />
            {isLoading ? (
              <Loader />
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
              >
                Add Service
              </button>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
