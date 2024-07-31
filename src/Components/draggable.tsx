import { useEffect, useState } from "react";
import Draggable from "react-draggable";

import lock from "Assets/Svgs/lock-white.svg";
import LockedHitsModal from "./Modals/lockedHits";

const SnappableDraggable = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    right: window.innerWidth,
    bottom: window.innerHeight,
  });

  const handleStop = (e: any, data: any) => {
    eventControl(e);
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const elementWidth = data.node.offsetWidth;
    const elementHeight = data.node.offsetHeight;
    setBounds({ ...bounds, bottom: screenHeight - elementHeight });

    const newX = data.x < screenWidth / 2 ? 0 : screenWidth - elementWidth;
    // const newY = data.y < screenHeight / 2 ? 0 : screenHeight - elementHeight;
    const newY = data.y;

    setPosition({ x: newX, y: newY });
  };

  useEffect(() => {
    const handleResize = () => {
      setBounds({
        left: 0,
        top: 0,
        right: window.innerWidth,
        bottom: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleClick = () => {
    if (!dragging) {
      (document.getElementById("my_modal_2") as HTMLDialogElement).showModal(); // Perform the desired action here
    }
  };

  const eventControl = (event: any) => {
    if (event.type === "mousemove" || event.type === "touchmove") {
      setDragging(true);
    }

    if (event.type === "mouseup" || event.type === "touchend") {
      setTimeout(() => {
        setDragging(false);
      }, 100);
    }
  };

  return (
    <>
      <div
        className="fixed z-40 "
        onClick={handleClick}
        // onMouseUp={() => (document.getElementById("my_modal_2") as HTMLDialogElement).showModal()}
        onTouchEnd={handleClick}
      >
        <Draggable position={position} onDrag={eventControl} onStop={handleStop} bounds={bounds}>
          <div
            className="w-[25vw] h-[25vw] max-w-[150px] max-h-[150px] bg-contain bg-center flex items-center justify-center cursor-pointer"
            style={{
              transition: "transform 0.1s linear",
              backgroundImage: `url(${lock})`,
              transform: `translate(${position.x}px, ${position.y}px)`,
              backgroundRepeat: "no-repeat",
            }}
          >
            <div
              className="text-center mt-[25%]"
              style={{
                fontSize:
                  window.innerWidth - 0.98 * window.innerWidth < 12
                    ? 12
                    : window.innerWidth - 0.98 * window.innerWidth > 20
                    ? 20
                    : window.innerWidth - 0.98 * window.innerWidth,
                //   fontSize: 20,
              }}
            >
              <p className="font-bold">45% HIT</p>
              <p className="font-bold">Locked!</p>
            </div>
            {/* <img src={lock} alt="lock" /> */}
          </div>
        </Draggable>
      </div>
      <LockedHitsModal />
    </>
  );
};

export default SnappableDraggable;
