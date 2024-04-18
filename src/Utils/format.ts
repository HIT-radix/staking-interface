import { radixDashboardBaseUrl } from "Constants/misc";
import { parseUnits as parseUnitsEthers } from "ethers";
import numbro from "numbro";

export const formatDollarAmount = (num: number | undefined | null, digits = 2, round = true) => {
  if (num === 0) return "$0.00";
  if (!num) return "-";
  if (num < 0.001 && digits <= 3) {
    return "<$0.001";
  }
  if (num < 0.01 && digits <= 2) {
    return "<$0.01";
  }

  return numbro(num).formatCurrency({
    average: round,
    mantissa: num > 1000 ? 2 : digits,
    abbreviations: {
      million: "M",
      billion: "B",
    },
  });
};

export const formatTokenAmount = (num: number | undefined, digits = 2) => {
  if (num === 0) return "0";
  if (!num) return "-";
  if (num < 0.001 && digits <= 3) {
    return "<0.001";
  }
  if (num < 0.01 && digits <= 2) {
    return "<0.01";
  }

  let formattedAmount = numbro(num)
    .formatCurrency({
      average: true,
      mantissa: num >= 1000 ? 2 : digits,
      abbreviations: {
        million: "M",
        billion: "B",
      },
    })
    .replace("$", "");

  formattedAmount = formattedAmount.replace(".00", "");
  return formattedAmount;
};

export const exactAmountInDecimals = (amount: number) => {
  return Number.isInteger(amount) ? amount.toString() : amount.toFixed(9).replace(/0+$/, "");
};

export function parseUnits(_num: number) {
  return parseUnitsEthers(_num.toString(), 9).toString();
}

export function formatUnits(_num: number, decimals: number) {
  const divisor = 10 ** decimals;
  return _num / divisor;
}

export const generateExplorerTxLink = (txId?: string) => {
  return `${radixDashboardBaseUrl}/transaction/${txId}`;
};
