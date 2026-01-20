import { Environment } from "Types/misc";

export const Ociswap_baseurl = "https://api.ociswap.com";

export const networkRPC =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev
    ? "https://babylon-stokenet-gateway.radixdlt.com"
    : "https://mainnet.radixdlt.com";

// export const HIT_SERVER_URL =
//   process.env.REACT_APP_ENVIRONMENT === Environment.dev
//     ? "http://localhost:3002"
//     : "https://server.addix.meme";

export const HIT_SERVER_URL = "https://server.addix.meme";
export const HEDGE_FUND_SERVER_URL = "https://api.addix.meme";

export const ATTO_BASE_URL = "https://earn-api.attos.world";
export const SURGE_BASE_URL = "https://api.surge.trade";
export const C9_BASE_URL = "https://api-core.caviarnine.com/v1.0";

export const MORPHER_ORACLE_BACKEND_URL =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev
    ? "https://dev-test-radix-oracle-api.morpher.com"
    : "https://radix-oracle-api.morpher.com";
