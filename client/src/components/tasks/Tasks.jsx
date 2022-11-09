import { useContext } from "react";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import { TaskContext } from "../../context/TaskContext";
import TaskCard from "./TaskCard";
import usePreventBodyScroll from "../usePreventBodyScroll";
import { LeftArrow, RightArrow } from "../Arrows";

function onWheel(apiObj, ev) {
  const isThouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;

  if (isThouchpad) {
    ev.stopPropagation();
    return;
  }

  if (ev.deltaY < 0) {
    apiObj.scrollNext();
  } else if (ev.deltaY > 0) {
    apiObj.scrollPrev();
  }
}

const Tasks = () => {
  const { tasks } = useContext(TaskContext);
  const { disableScroll, enableScroll } = usePreventBodyScroll();
  return (
    <>
      {tasks.length < 1 && (
        <p className="text-white text-2xl text-center my-2">No tasks yet</p>
      )}
      <div className="text-white pt-10">
        <div onMouseEnter={disableScroll} onMouseLeave={enableScroll}>
          <ScrollMenu
            LeftArrow={LeftArrow}
            RightArrow={RightArrow}
            onWheel={onWheel}
            className="pt-10"
          >
            {tasks &&
              [...tasks]
                .reverse()
                .slice(0, 3)
                .map((task, i) => <TaskCard key={i} {...task} />)}
          </ScrollMenu>
        </div>
      </div>
    </>
  );
};

export default Tasks;
