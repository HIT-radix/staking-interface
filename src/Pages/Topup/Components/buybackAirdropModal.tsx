import { useCallback } from "react";

import DialogStructure from "Components/dialogStructure";
import { useSelector } from "Store";

const BuybackAirdropModal = () => {
  const buybackData = useSelector((state) => state.session.buybackAirdropModalData);
  const failedAirdropCount = buybackData?.failedAirdrops.length ?? 0;

  const downloadFailedAirdropsCsv = useCallback(() => {
    if (!buybackData?.failedAirdrops.length) return;

    const filename = `failed-airdrops-${buybackData.tokenAddress}.csv`;

    const csvRows = [
      "Address,Amount",
      ...buybackData.failedAirdrops.map((item) => `${item.address},${item.amount}`),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, [buybackData]);

  return (
    <DialogStructure modalId="BuybackAirdropModal">
      {buybackData ? (
        <div className="space-y-5">
          <p className="text-secondary text-xl font-semibold text-center">
            Buyback Airdrop Summary
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-secondary uppercase">Token Address</p>
              <p className="text-sm break-all">{buybackData.tokenAddress}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-secondary uppercase">Total Accounts</p>
              <p className="text-sm">{buybackData.totalAccounts.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-secondary uppercase">Failed Airdrops</p>
              <p className="text-sm">{failedAirdropCount.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-secondary uppercase">Transaction IDs</p>
              <ul className="space-y-1 max-h-40 overflow-auto rounded bg-base-200 p-3 text-xs">
                {buybackData.transactionIds.length ? (
                  buybackData.transactionIds.map((id) => (
                    <li key={id} className="break-all">
                      {id}
                    </li>
                  ))
                ) : (
                  <li>No transactions recorded.</li>
                )}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-secondary uppercase">Accounts</p>
              <ul className="space-y-1 max-h-40 overflow-auto rounded bg-base-200 p-3 text-xs">
                {buybackData.accounts.length ? (
                  buybackData.accounts.map((address) => (
                    <li key={address} className="break-all">
                      {address}
                    </li>
                  ))
                ) : (
                  <li>No accounts processed.</li>
                )}
              </ul>
            </div>
          </div>

          {failedAirdropCount ? (
            <div>
              <p className="text-sm font-semibold text-secondary uppercase">Failed Airdrops</p>
              <div className="max-h-48 overflow-auto rounded bg-base-200 p-3 text-xs space-y-2">
                {buybackData.failedAirdrops.map(({ address, amount }) => (
                  <div key={`${address}-${amount}`} className="flex justify-between gap-4">
                    <span className="break-all">{address}</span>
                    <span>{amount}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-center">
                <button
                  className="btn bg-accent text-base-100 hover:bg-accent/50"
                  onClick={downloadFailedAirdropsCsv}
                >
                  Download failed airdrops (CSV)
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <p className="text-center text-sm">No buyback or airdrop data available.</p>
      )}
    </DialogStructure>
  );
};

export default BuybackAirdropModal;
