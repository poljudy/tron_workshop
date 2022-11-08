import { useState } from "react";
import { Buffer } from "buffer";

const AutoAvatar = ({ userId, size, ...imgProps }) => {
  const [base64, setBase64] = useState(undefined);
  // using dynamic import to save some loading
  import("jdenticon").then(({ toSvg }) => {
    const svgString = toSvg(userId, size);
    const b64 = Buffer.from(svgString).toString("base64");
    setBase64(b64);
  });

  return base64 ? (
    <div style={{ backgroundColor: "transparent", display: "flex" }}>
      <img
        {...imgProps}
        src={`data:image/svg+xml;base64,${base64}`}
        alt="User Avatar"
      />
    </div>
  ) : (
    <div style={{ width: size, height: size, display: "inline-block" }}>
      ...
    </div>
  );
};

export default AutoAvatar;
