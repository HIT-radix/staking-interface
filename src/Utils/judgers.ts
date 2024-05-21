import { BN } from "./format";

export const calculateInputWidth = (str: string) => {
  // Check if the string contains a dot
  const containsDot = str.includes(".");

  // Count the number of '1's in the string
  const countOfOnes = str.split("").filter((char) => char === "1").length;
  const totalLengthWithDot = containsDot ? str.length - 1 : str.length;

  const inputWidth = totalLengthWithDot - countOfOnes + countOfOnes * 1 + (containsDot ? 0.5 : 0);

  return Number(inputWidth.toFixed(2)) + 1;
};

export function validateDecimalPlaces(numStr: string, maxDecimals: number) {
  // Regular expression to check if the number has more than maxDecimals places
  const regex = new RegExp(`^\\d+(\\.\\d{0,${maxDecimals}})?$`);
  return regex.test(numStr);
}

export const calculateStHitWorthInHIT = (
  amount: string,
  stakedHIT: string,
  stHIT_totalSupply: string
) => {
  return BN(amount).dividedBy(stHIT_totalSupply).multipliedBy(stakedHIT);
};
