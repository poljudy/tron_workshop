import React, { useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { HiSearch } from "react-icons/hi";
import { PlatformContext } from "../context/PlatformContext";
import ProjectCard from "../components/ProjectCard";

export default function Home() {
  const { projects, currentAccount, network, switchNetwork } =
    useContext(PlatformContext);
  const [searchParams, setSearchParams] = useSearchParams();
  // if (network !== "Polygon Mumbai Testnet") {
  //   return (
  //     <div className="flex flex-col w-full text-white justify-center items-center min-h-screen">
  //       <p>Please connect to Polygon Mumbai Testnet</p>
  //       <button
  //         className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
  //         type="button"
  //         onClick={switchNetwork}
  //       >
  //         <p className="text-white text-base font-semibold">Switch Network</p>
  //       </button>
  //     </div>
  //   );
  // }
  return (
    <div className="flex w-full justify-center items-start 2xl:px-20 gradient-bg-welcome min-h-screen">
      <div className="flex flex-col md:p-12 py-12 px-4">
        {currentAccount ? (
          <div>
            <p className="text-white text-3xl text-center my-2">
              {projects.length === 0
                ? "No tasks yet"
                : `Latest Tasks (${projects.length})`}
            </p>
            {projects.length > 0 && (
              <div className="flex flex-row justify-center items-center">
                <input
                  className="my-2 w-4/12 rounded-sm p-2 outline-none bg-transparent text-white text-sm white-glassmorphism"
                  type="search"
                  placeholder="Search..."
                  value={searchParams.get("filter") || ""}
                  onChange={(event) => {
                    const filter = event.target.value;
                    if (filter) {
                      setSearchParams({ filter });
                    } else {
                      setSearchParams({});
                    }
                  }}
                />
                <span>
                  <HiSearch size={30} className="text-gray-500" />
                </span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-white text-3xl text-center my-2">
            Connect your account to see the latest projects
          </p>
        )}
        <div className="flex flex-wrap justify-center items-center mt-10">
          {[...projects]
            .reverse()
            .filter((p) => {
              const filter = searchParams.get("filter");
              if (!filter) return true;
              const title = p.title.toLowerCase();
              return title.startsWith(filter.toLowerCase());
            })
            .map((project, i) => (
              <ProjectCard key={i} {...project} />
            ))}
        </div>
      </div>
    </div>
  );
}
