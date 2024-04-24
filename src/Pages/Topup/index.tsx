import { useMemo, useState } from "react";

import { AMOUNT_INPUT_REGEX } from "Constants/misc";
import { useSelector } from "Store";
import { StakingTokens } from "Types/reducers";
import { validateDecimalPlaces } from "Utils/judgers";
import { topupHIT } from "Utils/txSenders";
import { CONTRACT_OWNER_ADDRESS } from "Constants/address";

const Topup = () => {
  const [amount, setAmount] = useState("");
  const walletAddress = useSelector((state) => state.app.walletAddress);
  const txInProgress = useSelector((state) => state.loadings.txInProgress);
  const hitBalance = useSelector((state) => state.session.hitBalance);

  const isInSufficientBalance = useMemo(() => {
    return +amount > +hitBalance;
  }, [amount, hitBalance]);

  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    if (text.match(AMOUNT_INPUT_REGEX)) {
      if (validateDecimalPlaces(text, 18)) {
        setAmount(text);
      }
    } else {
      setAmount("");
    }
  };

  const isDisabled = useMemo(
    () => txInProgress || isInSufficientBalance || +hitBalance === 0 || Number(amount) === 0,
    [txInProgress, isInSufficientBalance, hitBalance, amount]
  );

  const BtnText = useMemo(
    () =>
      !walletAddress
        ? "Connect Wallet"
        : !amount
        ? "Enter an amount"
        : isInSufficientBalance
        ? `Insufficient ${StakingTokens.HIT}`
        : txInProgress
        ? "Processing"
        : "Topup",
    [amount, isInSufficientBalance, txInProgress, walletAddress]
  );

  const handleClick = async () => {
    if (!isDisabled) {
      await topupHIT(amount);
      setAmount("");
    }
  };
  return walletAddress === CONTRACT_OWNER_ADDRESS ? (
    <div className="w-full mt-4 flex flex-col items-center justify-center">
      <p className="text-accent text-center text-xl">Top Up HIT Rewards</p>
      <input
        value={amount}
        type="text"
        placeholder="Enter Topup HIT amountasdas"
        onChange={onValueChange}
        className="input input-accent w-full max-w-xs bg-base-200 text-accent focus:outline-none focus:border-none mt-4"
      />
      <div
        onClick={handleClick}
        className={`btn btn-accent mt-4 px-20 ${
          isDisabled ? "cursor-not-allowed opacity-30" : "cursor-pointer opacity-100"
        }`}
      >
        {BtnText}
      </div>
    </div>
  ) : null;
};

export default Topup;
