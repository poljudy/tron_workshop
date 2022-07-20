import { useContext } from "react";
import { HiSearch } from "react-icons/hi";
import { useSearchParams } from "react-router-dom";
import { PlatformContext } from "../context/PlatformContext";
import ProjectCard from "./ProjectCard";

const Projects = () => {
  // const { currentAccount } = useContext(AuthContext);
  const { projects } = useContext(PlatformContext);
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <>
      {projects ? (
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
          No tasks yet
        </p>
      )}
      <div className="flex flex-wrap justify-center items-center mt-10">
        {projects &&
          [...projects]
            .reverse()
            .filter((p) => {
              const filter = searchParams.get("filter");
              if (!filter) return true;
              const title = p.title.toLowerCase();
              return title.includes(filter.toLowerCase());
            })
            .map((project, i) => <ProjectCard key={i} {...project} />)}
      </div>
    </>
  );
};

export default Projects;
