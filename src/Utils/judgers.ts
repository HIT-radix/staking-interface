import { APY_EXPIRE_PERIOD } from "Constants/misc";
import { BN } from "./format";
import ApyCacheService from "Classes/apyCache";

export const calculateInputWidth = (str: string) => {
  // Check if the string contains a dot
  const containsDot = str.includes(".");

  // Count the number of '1's in the string
  const arrayedNum = str.split("");
  const countOfOnes = arrayedNum.filter((char) => char === "1").length;
  const countOfCommas = arrayedNum.filter((char) => char === ",").length;
  const totalLengthWithDot = containsDot ? str.length - 1 : str.length;

  const inputWidth =
    totalLengthWithDot -
    countOfOnes +
    countOfOnes * 1 +
    (containsDot ? 0.5 : 0) +
    countOfCommas * 1;

  return Number(inputWidth.toFixed(2)) + 2;
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

export function isObjectEmpty(obj: Object) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false; // Object is not empty
    }
  }
  return true; // Object is empty
}

export const shouldFetchAPYs = async (lastApyUpdated: number) => {
  const currentTime = Date.now();
  const apyListIsEmpty = isObjectEmpty(ApyCacheService.allAPYs);
  return currentTime - lastApyUpdated >= APY_EXPIRE_PERIOD || apyListIsEmpty;
};
