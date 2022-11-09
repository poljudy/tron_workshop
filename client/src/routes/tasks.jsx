import { useContext } from "react";
import { HiSearch } from "react-icons/hi";
import { useSearchParams } from "react-router-dom";
import { TaskContext } from "../context/TaskContext";
import { TaskCard } from "../components";
import { Categories } from "../utils/constants";

const Tasks = () => {
  // const { currentAccount } = useContext(AuthContext);
  const { tasks } = useContext(TaskContext);
  const [searchParams, setSearchParams] = useSearchParams();
  console.log(tasks);
  return (
    <div className="min-h-screen">
      {tasks ? (
        <div>
          <p className="text-white text-3xl text-center my-2">
            {tasks.length === 0
              ? "No tasks yet"
              : `Recent Tasks (${tasks.length})`}
          </p>
          {tasks.length > 0 && (
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
              <div className="flex flex-row gap-2 justify-center items-center">
                {Categories.map((c, i) => <div className="p-2 text-center text-white white-glassmorphism" key={i}>{c}</div>)}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-white text-3xl text-center my-2">
          No tasks yet
        </p>
      )}
      <div className="list-none justify-center items-center mt-10">
        {tasks &&
          [...tasks]
            .reverse()
            .filter((p) => {
              const filter = searchParams.get("filter");
              if (!filter) return true;
              const title = p.title.toLowerCase();
              return title.includes(filter.toLowerCase());
            })
            .map((task, i) => <TaskCard key={i} {...task} />)}
      </div>
    </div>
  );
};

export default Tasks;
