import React, { useContext, createRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Cropper } from "react-cropper";
import { PlatformContext } from "../context/PlatformContext";
// import { ProfileContext } from "../context/ProfileContext";
import { Loader } from "../components";
import "cropperjs/dist/cropper.css";
import "./roundedCropper.css";

// this transforms file to base64
const file2Base64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result?.toString() || "");
  reader.onerror = (error) => reject(error);
});

export default function Profile() {
  const { isLoading } = useContext(PlatformContext);

  // const FormField = () => null;
  // const { handleChange, formData, addProfile } = useContext(ProfileContext);

  // const handleSubmit = (e) => {
  //   // const { username, avatar, skills, interests } = formData;
  //   e.preventDefault();
  //   if (!username || !skills || !interests) return;
  //   addProfile();
  // };

  // ref of the file input
  const fileRef = createRef();

  // the selected image
  const [uploaded, setUploaded] = useState(null);

  // the resulting cropped image
  const [cropped, setCropped] = useState(null);

  // the reference of cropper element
  const cropperRef = createRef();

  const onFileInputChange = (e) => {
    const file = e.target?.files?.[0];
    if (file) {
      file2Base64(file).then((base64) => {
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
    <div className="flex w-full justify-center items-start min-h-screen">
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
                    onClick={onCrop}
                  >
                    Crop
                  </button>
                  {cropped && <img src={cropped} alt="Cropped!" style={{ borderRadius: "50%" }} />}
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="box-border h-96 w-96 border-4 rounded-full white-glassmorphism" />
                  <input
                    type="file"
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
                <input
                  className="w-full bg-transparent white-glassmorphism"
                  name="username"
                  type="text"
                  placeholder="e.g. Elon Mask"
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
              <textarea
                className="w-full bg-transparent white-glassmorphism"
                placeholder="List your skills..."
                name="title"
                type="text"
                // handleChange={handleChange}
              />
            </div>
            <div className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism">
              <span
                className="block tracking-wide text-gray-20 text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Interests
              </span>
              <textarea
                className="w-full bg-transparent white-glassmorphism"
                placeholder="Describe your interests"
                name="description"
                type="text"
                // handleChange={handleChange}
              />
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
                <input
                  className="w-full bg-transparent white-glassmorphism"
                  placeholder="0"
                  name="price"
                  type="number"
                  // handleChange={handleChange}
                />
                <span className="text-white self-center">/hr</span>
              </div>
            </div>
            <div className="h-[1px] w-full bg-gray-400 my-2" />
            {isLoading ? (
              <Loader />
            ) : (
              <button
                type="button"
                // onClick={handleSubmit}
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
