import { Environment } from "Types/misc";

export const TELEGRAM_LINK = "";
export const X_HANDLE = "";
export const HIT_WEBSITE = "";

export const AMOUNT_INPUT_REGEX = /^((\d+[.]?\d*)|(\.\d+))$/;

export const radixDashboardBaseUrl =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev
    ? "https://stokenet-dashboard.radixdlt.com"
    : "https://dashboard.radixdlt.com";
