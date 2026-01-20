import axios from "axios";

import GeneralOwnerInterface from "Components/generalOwnerInterface";
import InfoTile from "Components/infoTile";
import {
  FOMO_RESOURCE_ADDRESS,
  HIT_RESOURCE_ADDRESS,
  REDDICKS_RESOURCE_ADDRESS,
} from "Constants/address";
import { HEDGE_FUND_SERVER_URL } from "Constants/endpoints";
import { dispatch, useSelector } from "Store";
import { setTxInProgress } from "Store/Reducers/loadings";
import { setBuybackAirdropModalData } from "Store/Reducers/session";
import { BuyBackAirdopResponse } from "Types/api";
import { StakingTokens } from "Types/reducers";
import { formatTokenAmount } from "Utils/format";

const ValidatorStaking = () => {
  const hitBalance = useSelector(
    (state) => state.session.botWallet.fungible?.[HIT_RESOURCE_ADDRESS]?.amount || "0"
  );
  const fomoBalance = useSelector(
    (state) => state.session.botWallet.fungible?.[FOMO_RESOURCE_ADDRESS]?.amount || "0"
  );
  const reddicksBalance = useSelector(
    (state) => state.session.botWallet.fungible?.[REDDICKS_RESOURCE_ADDRESS]?.amount || "0"
  );
  const balanceLoading = useSelector((state) => state.loadings.botBalanceLoading);

  const distribute = async (amount: string, tokenAddress: string) => {
    dispatch(setTxInProgress(true));
    const {
      data: { data },
    } = await axios.post<BuyBackAirdopResponse>(
      `${HEDGE_FUND_SERVER_URL}/airdrops/airdrop-buyback-tokens`,
      [
        {
          tokenAddress,
          amount,
        },
      ]
    );
    if (data) {
      dispatch(setBuybackAirdropModalData(data[0]));
      (document.getElementById("BuybackAirdropModal") as HTMLDialogElement).showModal();
    }
    dispatch(setTxInProgress(false));
  };

  return (
    <div>
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="min-w-[300px]">
          <InfoTile
            title="Bot HIT Balance"
            value={formatTokenAmount(+hitBalance)}
            isLoading={balanceLoading}
            tooltip={hitBalance}
          />
        </div>
        <div className="min-w-[300px]">
          <InfoTile
            title="Bot FOMO Balance"
            value={formatTokenAmount(+fomoBalance)}
            isLoading={balanceLoading}
            tooltip={fomoBalance}
          />
        </div>
        <div className="min-w-[300px]">
          <InfoTile
            title="Bot REDDICKS Balance"
            value={formatTokenAmount(+reddicksBalance)}
            isLoading={balanceLoading}
            tooltip={reddicksBalance}
          />
        </div>
      </div>
      <GeneralOwnerInterface
        heading="Take Snapshot and Distribute HIT"
        placeholder="Enter HIT amount to distribute"
        balance={hitBalance}
        onButtonClick={async (amount) => await distribute(amount, HIT_RESOURCE_ADDRESS)}
        btnText="Distribute HIT tokens"
        tokenSymbol={StakingTokens.HIT}
      />
      <GeneralOwnerInterface
        heading="Take Snapshot and Distribute FOMO"
        placeholder="Enter FOMO amount to distribute"
        balance={fomoBalance}
        onButtonClick={async (amount) => await distribute(amount, FOMO_RESOURCE_ADDRESS)}
        btnText="Distribute FOMO tokens"
        tokenSymbol={StakingTokens.FOMO}
      />
      <GeneralOwnerInterface
        heading="Take Snapshot and Distribute REDDICKS"
        placeholder="Enter REDDICKS amount to distribute"
        balance={reddicksBalance}
        onButtonClick={async (amount) => await distribute(amount, REDDICKS_RESOURCE_ADDRESS)}
        btnText="Distribute REDDICKS tokens"
        tokenSymbol={StakingTokens.REDDICKS}
      />
    </div>
  );
};

export default ValidatorStaking;
