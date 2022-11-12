import React, { useContext, createRef, useState } from "react";
import Select from "react-select";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Cropper } from "react-cropper";
import { PlatformContext } from "../context/PlatformContext";
import { AuthContext } from "../context/AuthContext";
import { ProfileContext } from "../context/ProfileContext";
import { Loader } from "../components";
import "cropperjs/dist/cropper.css";
import "./roundedCropper.css";
import AutoAvatar from "../components/AutoAvatar";
import languages from "../utils/languages.json";

// this transforms file to base64
const file2Base64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result?.toString() || "");
    reader.onerror = (error) => reject(error);
  });

const languageOptions = languages.map((l) => ({
  value: l.code,
  label: l.name,
}));

const FormField = ({ placeholder, name, type, value, handleChange }) => {
  if (name === "languages") {
    return (
      <Select
        options={languageOptions}
        closeMenuOnSelect={false}
        isMulti
        className="basic-multi-select"
        classNamePrefix="select"
        defaultValue={value}
        value={value}
        onChange={(e) => handleChange(e, name)}
        styles={{
          control: (styles) => ({
            ...styles,
            backgroundColor: "transparent",
          }),
          input: (styles) => ({
            ...styles,
            color: "white",
            outlineStyle: "none",
          }),
        }}
      />
    );
  }
  if (name === "skills") {
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
      step="0.5"
      min="0"
      value={value}
      onChange={(e) => handleChange(e, name)}
      className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border white-glassmorphism"
    />
  );
};

export default function Profile() {
  const { isLoading } = useContext(PlatformContext);
  const { currentAccount } = useContext(AuthContext);
  const {
    handleChange,
    formData,
    addProfile,
    profile,
    onUploadHandler,
    ipfsUrl,
  } = useContext(ProfileContext);

  const handleSubmit = (e) => {
    const { username } = formData;
    e.preventDefault();
    if (!username) return;
    addProfile();
  };

  // ref of the file input
  const fileRef = createRef();

  // the selected image
  const [uploaded, setUploaded] = useState(null);

  // the resulting cropped image
  const [cropped, setCropped] = useState(null);

  // the reference of cropper element
  const cropperRef = createRef();

  const [file, setFile] = useState(null);

  const onFileInputChange = (e) => {
    const f = e.target?.files?.[0];
    if (f) {
      setFile(e.target?.files);
      file2Base64(f).then((base64) => {
        setUploaded(base64);
      });
    }
  };

  const onCrop = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    setCropped(cropper.getCroppedCanvas().toDataURL());
  };

  return (
    <div className="flex w-full justify-center items-start  outline-none min-h-screen">
      <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
        <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
          <h1 className="text-3xl sm:text-5xl text-white py-1">Profile</h1>
          <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
            Let us know you better.
          </p>
        </div>

        <div className="flex flex-col flex-2 items-center justify-center w-full mf:mt-0 mt-10">
          <div className="p-5 w-full flex flex-col justify-center items-center blue-glassmorphism">
            <div className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism">
              {uploaded ? (
                <div>
                  {cropped ? (
                    <div>
                      <img
                        src={cropped}
                        alt="Cropped!"
                        style={{ borderRadius: "50%" }}
                      />
                      {isLoading ? (
                        <Loader />
                      ) : (
                        <>
                          <button
                            type="button"
                            className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                            onClick={() => setCropped(false)}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                            onClick={() => onUploadHandler(file)}
                          >
                            Upload to IPFS
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    <div>
                      <Cropper
                        src={uploaded}
                        style={{ height: 400, width: 400 }}
                        autoCropArea={1}
                        aspectRatio={1}
                        viewMode={3}
                        guides={false}
                        ref={cropperRef}
                      />
                      <button
                        type="button"
                        className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                        onClick={() => setUploaded(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                        onClick={onCrop}
                      >
                        Crop
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="box-border h-96 w-96 border-4 rounded-full white-glassmorphism">
                    {profile.avatar && profile.avatar.length > 0 ? (
                      <img alt="Avatar" src={profile.avatar} className="w-[36rem] mr-1 rounded-full" />
                    ) : (
                      <AutoAvatar userId={currentAccount} size={370} />
                    )}
                    {ipfsUrl && (
                      <img
                        alt="Profile"
                        className="self-center"
                        src={ipfsUrl}
                      />
                    )}
                  </div>
                  <input
                    type="file"
                    name="file"
                    style={{ display: "none" }}
                    ref={fileRef}
                    onChange={onFileInputChange}
                    accept="image/png,image/jpeg,image/gif"
                  />
                  <button
                    type="button"
                    className="text-white w-full mt-4 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                    onClick={() => fileRef.current?.click()}
                  >
                    Upload an Avatar
                  </button>
                </div>
              )}
            </div>
            <div className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism">
              <span
                className="block tracking-wide text-gray-20 text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Useranme
              </span>
              <div>
                <FormField
                  className="w-full bg-transparent white-glassmorphism"
                  name="username"
                  type="text"
                  placeholder="e.g. Elon Mask"
                  handleChange={handleChange}
                />
              </div>
            </div>
            <div className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism">
              <span
                className="block tracking-wide text-gray-20 text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Skills
              </span>
              <FormField
                className="w-full bg-transparent white-glassmorphism"
                placeholder="List your skills, comma separated..."
                name="skills"
                type="text"
                handleChange={handleChange}
              />
            </div>
            <div className="my-2 w-full rounded-sm p-2 outline-0">
              <span
                className="block tracking-wide text-white text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Languages
              </span>
              <FormField name="languages" handleChange={handleChange} />
            </div>
            <div className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism">
              <span
                className="block tracking-wide text-gray-20 text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Rate
              </span>
              <div className="flex flex-row gap-2">
                <span className="text-white self-center">$</span>
                <FormField
                  className="w-full bg-transparent white-glassmorphism"
                  placeholder="0"
                  name="rate"
                  type="number"
                  handleChange={handleChange}
                />
                <span className="text-white self-center">/hr</span>
              </div>
            </div>
            <div className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism">
              <span
                className="block tracking-wide text-gray-20 text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Availability
              </span>
              <div className="flex flex-row gap-2">
                <FormField
                  className="w-full bg-transparent white-glassmorphism"
                  placeholder="0"
                  name="availability"
                  type="number"
                  min="0"
                  handleChange={handleChange}
                />
                <span className="text-white self-center">hours per week</span>
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
                Save Profile
              </button>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
