import { Environment } from "Types/misc";

export const Ociswap_baseurl = "https://api.ociswap.com";

export const networkRPC =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev
    ? "https://babylon-stokenet-gateway.radixdlt.com"
    : "https://mainnet.radixdlt.com";

export const TelegramBotServerUrl = "https://bot.addix.meme";
