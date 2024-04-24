import InfoTile from "Components/infoTile";
import { useSelector } from "Store";
import { LockHITRewards, distributeHITRewards } from "Utils/txSenders";
import { CONTRACT_OWNER_ADDRESS } from "Constants/address";
import GeneralOwnerInterface from "Components/generalOwnerInterface";
import { formatTokenAmount } from "Utils/format";

const AdminPanel = () => {
  const walletAddress = useSelector((state) => state.app.walletAddress);
  const hitBalance = useSelector((state) => state.session.hitBalance);
  const lockedHITRewards = useSelector((state) => state.staking.lockedHITRewards);
  const balanceLoading = useSelector((state) => state.loadings.balanceLoading);
  const componentDataLoading = useSelector((state) => state.loadings.componentDataLoading);

  return walletAddress === CONTRACT_OWNER_ADDRESS ? (
    <div>
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="min-w-[300px]">
          <InfoTile
            title="Your HIT Balance"
            value={formatTokenAmount(+hitBalance)}
            isLoading={balanceLoading}
          />
        </div>
        <div className="min-w-[300px]">
          <InfoTile
            title="Locked HITs for Rewards"
            value={formatTokenAmount(+lockedHITRewards)}
            isLoading={componentDataLoading}
          />
        </div>
      </div>
      <div className="mt-10">
        <GeneralOwnerInterface
          heading="Distribute HITs Reward"
          placeholder="Enter HIT amount to distribute"
          balance={hitBalance}
          onButtonClick={async (amount) => await distributeHITRewards(amount, false)}
          btnText="Distribute"
        />
        <GeneralOwnerInterface
          heading="Lock HITs for Future Rewards"
          placeholder="Enter HIT amount to lock"
          balance={hitBalance}
          onButtonClick={async (amount) => await LockHITRewards(amount)}
          btnText="Lock"
        />
        <GeneralOwnerInterface
          heading="Distribute Locked HITs reward"
          placeholder="Enter locked HIT amount to distribute"
          balance={hitBalance}
          onButtonClick={async (amount) => await distributeHITRewards(amount, true)}
          btnText="Distribute"
        />
      </div>
    </div>
  ) : null;
};

export default AdminPanel;
