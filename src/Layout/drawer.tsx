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
      <div className="drawer-side z-50">
        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu bg-base-content text-accent min-h-full w-80 p-4">
          <div className="flex items-center justify-start gap-2 mb-16">
            <LogoWebsite />
          </div>
          <li
            className={
              "menu-item text-xl ml-2 my-3 cursor-pointer " +
              (checkIfActive("/fund") || checkIfActive("/")
                ? "text-accent underline"
                : "text-secondary")
            }
            onClick={() => moveToPage("/")}
          >
            The FOMO $HIT Hedge Fund
          </li>
          <li
            className={
              "menu-item text-xl ml-2 my-3 cursor-pointer " +
              (checkIfActive("/node-staking") ? "text-accent underline" : "text-secondary")
            }
            onClick={() => moveToPage("/node-staking")}
          >
            Stake XRD
          </li>
          <li
            className={
              "menu-item text-xl ml-2 my-3 cursor-pointer " +
              (checkIfActive("/hit-staking") ? "text-accent underline" : "text-secondary")
            }
            onClick={() => moveToPage("/hit-staking")}
          >
            Stake $HIT
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MobileDrawer;
