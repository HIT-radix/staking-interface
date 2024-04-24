import { useSelector } from "Store";
import { topupHIT } from "Utils/txSenders";
import { CONTRACT_OWNER_ADDRESS } from "Constants/address";
import GeneralOwnerInterface from "Components/generalOwnerInterface";

const Topup = () => {
  const walletAddress = useSelector((state) => state.app.walletAddress);
  const hitBalance = useSelector((state) => state.session.hitBalance);

  return walletAddress === CONTRACT_OWNER_ADDRESS ? (
    <>
      <GeneralOwnerInterface
        balance={+hitBalance}
        onButtonClick={async (amount) => await topupHIT(amount)}
      />
    </>
  ) : null;
};

export default Topup;
