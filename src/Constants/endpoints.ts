import { Environment } from "Types/misc";

export const Ociswap_baseurl = "https://api.ociswap.com";

export const networkRPC =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev
    ? "https://stokenet.radixdlt.com"
    : "https://mainnet.radixdlt.com";

export const TelegramBotServerUrl = "http://81.2.216.133:3002";
// export const TelegramBotServerUrl = "http://localhost:3001";
