import { FunctionComponent } from "react";

import XLogo from "Assets/Svgs/x.svg";
import TelegramLogo from "Assets/Svgs/telegram.svg";
import GitbookLogo from "Assets/Svgs/gitbook.svg";
import { HIT_WEBSITE, TELEGRAM_LINK, X_HANDLE } from "Constants/misc";

const Footer: FunctionComponent = () => {
  return (
    <div className="fixed bottom-5 w-full">
      <div className="flex justify-center md:justify-end p-0 lg:px-8 w-[97vw]">
        <div className="flex flex-row justify-evenly md:justify-between items-center w-1/2 lg:w-1/6 px-1 md:px-2 py-4">
          <a href={TELEGRAM_LINK} target="blank" className="cursor-pointer">
            <img src={TelegramLogo} width={20} height={20} alt="telegram-icon" />
          </a>
          <a href={X_HANDLE} target="blank" className="cursor-pointer">
            <img src={XLogo} width={20} height={20} alt="x-icon" />
          </a>
          <a href={HIT_WEBSITE} target="blank" className="cursor-pointer">
            <img src={GitbookLogo} width={22} height={22} alt="gitbook-icon" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
