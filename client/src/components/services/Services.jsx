import { useContext } from "react";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import usePreventBodyScroll from "../usePreventBodyScroll";
import { ServiceContext } from "../../context/ServiceContext";
import ServiceCard from "./ServiceCard";
import { LeftArrow, RightArrow } from "../Arrows";
import { ServiceStatuses } from "../../utils/constants";

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

const Services = () => {
  const { services } = useContext(ServiceContext);

  const { disableScroll, enableScroll } = usePreventBodyScroll();

  return (
    <>
      {services.length < 1 && (
        <p className="text-white text-2xl text-center my-2">No services yet</p>
      )}
      <div className="text-white pt-10">
        <div onMouseEnter={disableScroll} onMouseLeave={enableScroll}>
          <ScrollMenu
            LeftArrow={LeftArrow}
            RightArrow={RightArrow}
            onWheel={onWheel}
            className="pt-10"
          >
            {services &&
              [...services]
                .filter((p) => p.status === ServiceStatuses[0])
                .reverse()
                .slice(0, 5)
                .map((service, i) => (
                  <ServiceCard key={i} itemId={i} {...service} />
                ))}
          </ScrollMenu>
        </div>
      </div>
    </>
  );
};

export default Services;
