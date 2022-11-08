import React, { useState, useContext, useEffect } from "react";
import { VisibilityContext } from "react-horizontal-scrolling-menu";
import { MdOutlineArrowForwardIos, MdOutlineArrowBackIos } from "react-icons/md";

function Arrow({
  children,
  disabled,
  onClick
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        right: "1%",
        opacity: disabled ? "0" : "1",
        userSelect: "none"
      }}
    >
      {children}
    </button>
  );
}

export function LeftArrow() {
  const {
    isFirstItemVisible,
    scrollPrev,
    visibleElements,
    initComplete
  } = useContext(VisibilityContext);

  const [disabled, setDisabled] = useState(
    !initComplete || (initComplete && isFirstItemVisible)
  );
  useEffect(() => {
    // NOTE: detect if whole component visible
    if (visibleElements.length) {
      setDisabled(isFirstItemVisible);
    }
  }, [isFirstItemVisible, visibleElements]);

  return (
    <Arrow disabled={disabled} onClick={() => scrollPrev()}>
      <MdOutlineArrowBackIos />
    </Arrow>
  );
}

export function RightArrow() {
  const { isLastItemVisible, scrollNext, visibleElements } = useContext(
    VisibilityContext
  );

  // console.log({ isLastItemVisible });
  const [disabled, setDisabled] = useState(
    !visibleElements.length && isLastItemVisible
  );
  useEffect(() => {
    if (visibleElements.length) {
      setDisabled(isLastItemVisible);
    }
  }, [isLastItemVisible, visibleElements]);

  return (
    <Arrow disabled={disabled} onClick={() => scrollNext()}>
      <MdOutlineArrowForwardIos />
    </Arrow>
  );
}
