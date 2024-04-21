import { StakingTokens } from "Types/reducers";
import { generateExplorerTxLink } from "Utils/format";

import { conciseAddress } from "Utils/format";
import { ReactNode } from "react";

const BaseToast = ({
  heading,
  subHeading,
  explorerLink,
  txId,
  twSubHeadingClass = "",
  twHeadingClass = "",
}: {
  heading: string;
  subHeading?: string | ReactNode;
  explorerLink?: string;
  txId?: string;
  twSubHeadingClass?: string;
  twHeadingClass?: string;
}) => {
  return (
    <div>
      <p className={"font-extrabold " + twHeadingClass}>{heading}</p>
      {subHeading ? <p className={"text-sm " + twSubHeadingClass}>{subHeading}</p> : null}
      {txId ? (
        <p
          className="mt-2 text-sm font-extrabold w-fit text-base-content cursor-pointer"
          onClick={() => window.open(explorerLink ?? generateExplorerTxLink(txId), "_blank")}
          style={{ borderBottom: "1px solid #293a24" }}
        >
          View transaction
        </p>
      ) : null}
    </div>
  );
};

export const StakeSuccessToast = ({
  amount,
  token,
  txId,
}: {
  amount: string;
  token: StakingTokens;
  txId: string;
}) => {
  return (
    <BaseToast
      heading="Stake Transaction Successful"
      subHeading={
        <>
          <span className="font-semibold mr-1">
            {amount} <span className="mesh-text-gradient">${token}</span>
          </span>
          staked successfully.
        </>
      }
      twHeadingClass="text-base-content"
      twSubHeadingClass="text-base-content"
      txId={txId}
    />
  );
};

export const UnStakeSuccessToast = ({
  amount,
  token,
  txId,
}: {
  amount: string;
  token: StakingTokens;
  txId: string;
}) => {
  return (
    <BaseToast
      heading="Unstake Transaction Successful"
      subHeading={
        <>
          <span className="font-semibold mr-1">
            {amount} <span className="mesh-text-gradient">${token}</span>
          </span>
          unstaked successfully.
        </>
      }
      twHeadingClass="text-base-content"
      twSubHeadingClass="text-base-content"
      txId={txId}
    />
  );
};

// export const ClaimSuccessToast = ({
//   solAmount,
//   usdPrice,
//   txId,
// }: {
//   solAmount: string;
//   usdPrice: string;
//   txId: string;
// }) => {
//   return (
//     <BaseToast
//       heading="Claim Transaction Successful"
//       subHeading={`You have claimed ${solAmount} SOL (~${usdPrice}).`}
//       txId={txId}
//     />
//   );
// };

export const TxRejectedToast = () => {
  return (
    <BaseToast
      heading="Transaction Rejected"
      subHeading="Your transaction has been rejected."
      twHeadingClass="text-red-800"
      twSubHeadingClass="text-red-600"
    />
  );
};

export const TxCanceledToast = () => {
  return (
    <BaseToast
      heading="Transaction Canceled"
      subHeading="Your transaction has been canceled."
      twHeadingClass="text-red-800"
      twSubHeadingClass="text-red-600"
    />
  );
};

export const TxFailedToast = ({ txId }: { txId?: string }) => {
  return (
    <BaseToast
      heading="Transaction Failed"
      subHeading="Your transaction has failed."
      txId={txId}
      twHeadingClass="text-red-800"
      twSubHeadingClass="text-red-600"
    />
  );
};

export const TxProgressToast = () => {
  return <BaseToast heading="Processing Transaction" subHeading="Transaction is in processing." />;
};

// export const TxSignToast = () => {
//   return (
//     <BaseToast
//       heading="Sign Transaction on Wallet"
//       subHeading="Waiting for wallet to sign the transaction. "
//     />
//   );
// };

export const WalletDiconnectedToast = () => {
  return (
    <BaseToast
      heading={`Radix Wallet Disconnected`}
      subHeading="Your wallet has been disconnected"
      twHeadingClass="text-red-800"
      twSubHeadingClass="text-red-600"
    />
  );
};

export const WalletConnectedToast = ({ walletAddress }: { walletAddress: string }) => {
  return (
    <BaseToast
      heading={`Radix Wallet Connected`}
      subHeading={conciseAddress(walletAddress, 7, 10)}
      twHeadingClass="text-base-content"
      twSubHeadingClass="text-base-content"
    />
  );
};
