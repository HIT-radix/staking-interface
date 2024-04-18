import { ReactNode } from "react";

import InfoIcon from "Assets/Svgs/info.svg";

type Props = {
  children: ReactNode;
  twClasses?: string;
  text: string;
};

export const Tooltip = ({ children, twClasses = "", text }: Props) => {
  return (
    <span
      className={`tooltip tooltip-bottom before:bg-[#2c2d30] before:text-accent w-fit before:max-w-[60vw] sm:before:max-w-[20rem] before:z-50 cursor-pointer ${twClasses}`}
      {...(text ? { "data-tip": text } : {})}
    >
      {children}
    </span>
  );
};

export const InfoTooltip = ({ text }: { text: string }) => {
  return (
    <Tooltip text={text} twClasses="font-normal">
      <img src={InfoIcon} alt="InfoIcon" className="ml-1" />
    </Tooltip>
  );
};
