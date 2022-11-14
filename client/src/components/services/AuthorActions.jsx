import { useContext } from "react";

import { ServiceContext } from "../../context/ServiceContext";
import { ServiceStatuses } from "../../utils/constants";

const AuthorActions = () => {
  const { service, deleteService, pauseService, resumeService } =
    useContext(ServiceContext);

  return (
    <div className="flex flex-row gap-2">
      {service.status === ServiceStatuses[0] ? (
        <button
          type="button"
          className="flex flex-row justify-center items-center my-5 bg-yellow-700 p-3 w-1/6 text-white rounded-full cursor-pointer hover:bg-[#2546bd]"
          onClick={() => pauseService(service.id)}
        >
          Pause Service
        </button>
      ) : (
        <button
          type="button"
          className="flex flex-row justify-center items-center my-5 bg-green-700 p-3 w-1/6 text-white rounded-full cursor-pointer hover:bg-[#2546bd]"
          onClick={() => resumeService(service.id)}
        >
          Resume Service
        </button>
      )}
      <button
        type="button"
        className="flex flex-row justify-center items-center my-5 bg-[#831843] p-3 w-1/6 text-white rounded-full cursor-pointer hover:bg-[#2546bd]"
        onClick={() => deleteService(service.id)}
      >
        Delete Service
      </button>
    </div>
  );
};

export default AuthorActions;
