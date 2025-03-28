import { ReactNode } from "react";
import Navbar, { LogoWebsite } from "./header";
import { useLocation } from "react-router-dom";
import CachedService from "Classes/cachedService";

const MobileDrawer = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();

  const checkIfActive = (route: string) => pathname === route;
  const moveToPage = (route: string) => {
    CachedService.navigation(route);
  };
  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <Navbar />
        {children}
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu bg-base-content text-accent min-h-full w-80 p-4">
          <div className="flex items-center justify-start gap-2 mb-16">
            <LogoWebsite />
          </div>
          <li
            className={
              "menu-item text-xl ml-2 my-3 cursor-pointer " +
              (checkIfActive("/") ? "text-accent underline" : "text-secondary")
            }
            onClick={() => moveToPage("/")}
          >
            Stake HIT
          </li>
          <li
            className={
              "menu-item text-xl ml-2 my-3 cursor-pointer " +
              (checkIfActive("/staking") ? "text-accent underline" : "text-secondary")
            }
            onClick={() => moveToPage("/staking")}
          >
            Node Staking
          </li>
          <li
            className={
              "menu-item text-xl ml-2 my-3 cursor-pointer " +
              (checkIfActive("/fund") ? "text-accent underline" : "text-secondary")
            }
            onClick={() => moveToPage("/fund")}
          >
            Funds
          </li>
          <li
            className={"menu-item text-xl ml-2 my-3 cursor-pointer text-secondary"}
            onClick={() => window.open("https://nodemanager.addix.meme")}
          >
            Node Manager
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MobileDrawer;
