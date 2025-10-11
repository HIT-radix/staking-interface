import { RadixNetwork } from "@radixdlt/radix-dapp-toolkit";
import { Environment, HedgeFundPositionInfo } from "Types/misc";
import fUSDLogo from "Assets/Images/fUSD.png";
import xusdcLogo from "Assets/Images/xUSDC.png";
import husdcLogo from "Assets/Svgs/husdc.svg";

export const TELEGRAM_LINK = "https://t.me/FOMO_HIT";
export const X_HANDLE = "https://twitter.com/addix_xrd";
export const HIT_WEBSITE = "https://addix-xrd.gitbook.io/usdhit-on-radix/";

export const AMOUNT_INPUT_REGEX = /^((\d+[.]?\d*)|(\.\d+))$/;

export const radixDashboardBaseUrl =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev
    ? "https://stokenet-dashboard.radixdlt.com"
    : "https://dashboard.radixdlt.com";

export const networkId =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev
    ? RadixNetwork.Stokenet
    : RadixNetwork.Mainnet;

export const applicationName =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev ? "HIT Test Staking" : "HIT Staking";

export const APY_EXPIRE_PERIOD = 0.5 * 60 * 60 * 1000; // 30 minutes

export const HedgeFundPositionsInfoMap: Record<string, HedgeFundPositionInfo> = {
  "LSULP/fUSD@Flux": {
    value: "0",
    logo: fUSDLogo,
    platform: "Flux",
    position: "LSULP/fUSD LP",
    apyId: "LSULP_fUSD_Flux_Liquidity_Provision",
  },
  "WEFT/XRD@Ociswap": {
    value: "0",
    logo: fUSDLogo,
    platform: "Ociswap",
    position: "WEFT/XRD LP",
    apyId: "WEFT_XRD_Ociswap_Liquidity_Provision",
  },
  "XRD/xUSDC@Caviarnine": {
    value: "0",
    logo: xusdcLogo,
    platform: "Caviarnine",
    position: "XRD/xUSDC LP",
    apyId: "XRD_xUSDC_Caviarnine_Liquidity_Provision",
  },
  "XRD@WEFT": {
    value: "0",
    logo: xusdcLogo,
    platform: "Weft Finance",
    position: "XRD lend",
    apyId: "XRD_Weft_Finance_Lending",
  },
  "hUSDC@RootFinance": {
    value: "0",
    logo: husdcLogo,
    platform: "Root Finance",
    position: "hUSDC lend",
    apyId: "hUSDC_Root_Finance_Lending",
  },
  "xUSDC@Surge": {
    value: "0",
    logo: xusdcLogo,
    platform: "Surge",
    position: "xUSDC lend",
    apyId: "xUSDC_Surge_Lending",
  },
  "xUSDC@WEFT": {
    value: "0",
    logo: xusdcLogo,
    platform: "Weft Finance",
    position: "xUSDC lend",
    apyId: "xUSDC_Weft_Finance_Lending",
  },
};
