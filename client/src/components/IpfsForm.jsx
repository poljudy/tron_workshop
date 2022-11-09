import { useContext } from "react";
import { ServiceContext } from "../context/ServiceContext";

const IpfsForm = () => {
  const { onUploadHandler } = useContext(ServiceContext);

  return (
    <div>
      <p className="mt-5 text-2xl text-white text-basetext-white">
        Upload file using IPFS or paste a link to your result on any other
        hosting (preferably BTTC).
      </p>
      <form onSubmit={onUploadHandler}>
        <input
          className="mt-5 text-l text-white text-basetext-white"
          type="file"
          name="file"
        />
        <button
          className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 w-1/6 text-white rounded-full cursor-pointer hover:bg-[#2546bd]"
          id="upload-btn"
          type="submit"
        >
          Upload File
        </button>
      </form>
    </div>
  );
};

export default IpfsForm;
