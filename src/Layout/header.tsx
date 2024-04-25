import { useLocation } from "react-router-dom";

import HitLogo from "Assets/Images/hit-logo.png";
import CachedService from "Classes/cachedService";
import { useSelector } from "Store";

const Header = () => {
  const path = useLocation();
  const isOwner = useSelector((state) => state.staking.isOwner);

  const moveToPage = (route: string) => {
    CachedService.navigation(route);
  };

  const checkIfActive = (route: string) => path.pathname === route;

  return (
    <div
      className="flex flex-row justify-between items-center w-full p-4 px-2 sm:px-14 h-[90px]"
      style={{}}
    >
      <div className="flex gap-12 items-center">
        <LogoWebsite />
      </div>
      {isOwner && (
        <div className="flex flex-row items-center gap-8 text-xl">
          <p
            className={
              "cursor-pointer hover:underline hover:text-accent " +
              (checkIfActive("/admin") ? "text-accent underline" : "text-secondary")
            }
            onClick={() => moveToPage("/admin")}
          >
            Admin
          </p>
          <p
            className={
              "cursor-pointer hover:underline hover:text-accent " +
              (checkIfActive("/") ? "text-accent underline" : "text-secondary")
            }
            onClick={() => moveToPage("/")}
          >
            Stake HIT
          </p>
        </div>
      )}
      <div>
        <radix-connect-button></radix-connect-button>
      </div>
    </div>
  );
};

const LogoWebsite = ({ twContainerClass = "" }: { twContainerClass?: string }) => {
  return (
    <div className={"flex flex-row items-center " + twContainerClass}>
      <img src={HitLogo} alt="mesh-logo" className="w-10" />
      <p className="hidden sm:block text-accent text-2xl font-bold pl-2">ADDIX HIT</p>
    </div>
  );
};

export default Header;
