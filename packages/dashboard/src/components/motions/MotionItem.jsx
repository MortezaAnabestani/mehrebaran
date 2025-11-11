import { useState } from "react";

const MotionItem = ({ name }) => {
  const [objectPosition, setObjectPosition] = useState(Math.random() * 100 * 8);
  const [itemOpacity, setitemOpacity] = useState("30%");

  const snowAnimation = () => {
    const randomNum = Math.random() * 100 * 8;
    setObjectPosition(randomNum);
    if (itemOpacity === "80%") {
      setitemOpacity("30%");
    } else {
      setitemOpacity("80%");
    }
  };

  return (
    <div
      onMouseMove={snowAnimation}
      style={{
        position: "absolute",
        top: "-63px",
        right: `${objectPosition}px`,
        fontSize: "50px",
        transition: "all 2s ease-in-out",
        width: "70px",
        padding: "5px",
        borderRadius: "12px",
        opacity: `${itemOpacity}`,
        cursor: "pointer",
      }}
    >
      <img loading="lazy" src={`/assets/images/site/sections/${name}.svg`} alt="brand image" />
    </div>
  );
};

export default MotionItem;
