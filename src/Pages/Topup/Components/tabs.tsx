import React from "react";
import { ChevronDown } from "lucide-react";

interface DropDownProps {
  stakingType: "Rug Proof" | "Airdrop Node Rewards" | "Hedge Fund Admin";
  setStakingType: (type: "Rug Proof" | "Airdrop Node Rewards" | "Hedge Fund Admin") => void;
}

const Dropdown: React.FC<DropDownProps> = ({ stakingType, setStakingType }) => {
  return (
    <div className="mb-5 flex flex-col items-center justify-center">
      <div className="font-bold text-accent text-lg mb-2">Admin Type:</div>
      <div className="dropdown w-full max-w-xs">
        <div
          tabIndex={0}
          className="border border-accent text-white cursor-pointer w-full bg-base-200 px-4 py-3 rounded-lg flex items-center justify-between"
        >
          {stakingType === "Rug Proof"
            ? "Rug Proof HIT Staking"
            : stakingType === "Airdrop Node Rewards"
              ? "Airdrop Node Rewards"
              : stakingType === "Hedge Fund Admin"
                ? "Hedge Fund Admin"
                : ""}
          <ChevronDown />
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content border border-base-content menu p-2 shadow bg-base-content text-secondary rounded-box w-full z-50 mt-1"
        >
          <li>
            <div
              className={`${
                stakingType === "Rug Proof"
                  ? "bg-accent text-base-100 hover:bg-accent hover:text-base-100"
                  : " hover:bg-base-200"
              }`}
              onClick={() => setStakingType("Rug Proof")}
            >
              Rug Proof HIT Staking
            </div>
          </li>
          <li>
            <div
              className={`${
                stakingType === "Hedge Fund Admin"
                  ? "bg-accent text-base-100 hover:bg-accent hover:text-base-100"
                  : " hover:bg-base-200"
              }`}
              onClick={() => setStakingType("Hedge Fund Admin")}
            >
              Hedge Fund Admin
            </div>
          </li>
          <li>
            <div
              className={`${
                stakingType === "Airdrop Node Rewards"
                  ? "bg-accent text-base-100 hover:bg-accent hover:text-base-100"
                  : " hover:bg-base-200"
              }`}
              onClick={() => setStakingType("Airdrop Node Rewards")}
            >
              Airdrop Node Rewards
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dropdown;
