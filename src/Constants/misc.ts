import { RadixNetwork } from "@radixdlt/radix-dapp-toolkit";
import { Environment, HedgeFundPositionInfo } from "Types/misc";
import fUSDLogo from "Assets/Images/fUSD.png";
import xusdcLogo from "Assets/Images/xUSDC.png";
import husdcLogo from "Assets/Svgs/husdc.svg";
import xusdtLogo from "Assets/Images/xUSDT.png";
import lsulpLogo from "Assets/Images/lsu_lp.png";

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
  "LSULP/XRD@Hyperstake": {
    value: "0",
    logo: lsulpLogo,
    platform: "Hyperstake",
    position: "LSULP/XRD LP",
    apyId: "LSULP_XRD_Hyperstake_Liquidity_Provision",
  },
  "LSULP@Weft": {
    value: "0",
    logo: lsulpLogo,
    platform: "Weft Finance",
    position: "LSULP lend",
    apyId: "LSULP_Weft_Finance_Lending",
  },
  "fUSD/LSULP@Flux": {
    value: "0",
    logo: fUSDLogo,
    platform: "Flux",
    position: "fUSD/LSULP LP",
    apyId: "fUSD_LSULP_Flux_Liquidity_Provision",
  },
  "fUSD/XRD@Ociswap": {
    value: "0",
    logo: fUSDLogo,
    platform: "Ociswap",
    position: "fUSD/XRD LP",
    apyId: "fUSD_XRD_Ociswap_Liquidity_Provision",
  },
  "fUSD/xUSDC@Caviarnine": {
    value: "0",
    logo: fUSDLogo,
    platform: "Caviarnine",
    position: "fUSD/xUSDC LP",
    apyId: "fUSD_xUSDC_Caviarnine_Liquidity_Provision",
  },
  "hUSDC@Weft": {
    value: "0",
    logo: husdcLogo,
    platform: "Weft Finance",
    position: "hUSDC lend",
    apyId: "hUSDC_Weft_Finance_Lending",
  },
  "xUSDC@Root": {
    value: "0",
    logo: xusdcLogo,
    platform: "Root Finance",
    position: "xUSDC lend",
    apyId: "xUSDC_Root_Finance_Lending",
  },
  "xUSDC@Surge": {
    value: "0",
    logo: xusdcLogo,
    platform: "Surge",
    position: "xUSDC lend",
    apyId: "xUSDC_Surge_Lending",
  },
  "xUSDT@Root": {
    value: "0",
    logo: xusdtLogo,
    platform: "Root Finance",
    position: "xUSDT lend",
    apyId: "xUSDT_Root_Finance_Lending",
  },
};
