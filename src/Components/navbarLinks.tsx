import CachedService from "Classes/cachedService";
import { useLocation } from "react-router-dom";
import { useSelector } from "Store";

const NavbarLinks = () => {
  const path = useLocation();
  const isOwner = useSelector((state) => state.staking.isOwner);
  const checkIfActive = (route: string) => path.pathname === route;
  const moveToPage = (route: string) => {
    CachedService.navigation(route);
  };
  return (
    <>
      {isOwner && (
        <p
          className={
            "cursor-pointer hover:underline hover:text-accent " +
            (checkIfActive("/admin") ? "text-accent underline" : "text-secondary")
          }
          onClick={() => moveToPage("/admin")}
        >
          Admin
        </p>
      )}
      <p
        className={
          "cursor-pointer hover:underline hover:text-accent " +
          (checkIfActive("/fund") || checkIfActive("/")
            ? "text-accent underline"
            : "text-secondary")
        }
        onClick={() => moveToPage("/")}
      >
        FOMO $HIT Fund
      </p>
      <p
        className={
          "cursor-pointer hover:underline hover:text-accent " +
          (checkIfActive("/hit-staking") ? "text-accent underline" : "text-secondary")
        }
        onClick={() => moveToPage("/hit-staking")}
      >
        Stake HIT
      </p>
      <p
        className={
          "cursor-pointer hover:underline hover:text-accent " +
          (checkIfActive("/node-staking") ? "text-accent underline" : "text-secondary")
        }
        onClick={() => moveToPage("/node-staking")}
      >
        Node Staking
      </p>
    </>
  );
};

export default NavbarLinks;
