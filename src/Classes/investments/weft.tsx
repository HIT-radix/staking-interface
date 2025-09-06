import {
  hUSDC_RESOURCE_ADDRESS,
  WEFT_KEY_VALUE_STORE_ADDRESS,
  WEFT_W2_hUSDC_RESOURCE_ADDRESS,
  WEFT_W2_xUSDC_RESOURCE_ADDRESS,
  WEFT_W2_xUSDT_RESOURCE_ADDRESS,
  XUSDC_RESOURCE_ADDRESS,
  XUSDT_RESOURCE_ADDRESS,
} from "Constants/address";
import CachedService from "../cachedService";
import { store } from "Store";
import Decimal from "decimal.js";
import { InvestmentInfo } from "Types/misc";
import xusdtLogo from "Assets/Images/xUSDT.png";
import xusdcLogo from "Assets/Images/xUSDC.png";
import husdcLogo from "Assets/Svgs/husdc.svg";
import { StrategyId } from "Types/api";

class WeftInvestment {
  public async getInvestment(): Promise<InvestmentInfo> {
    const res = await this.fetchInvestment();
    const weftUSDTInvestment = res.usdt;
    const weftUSDCInvestment = res.usdc;
    const weftHUSDCInvestment = res.husdc;

    const totalInvestment = new Decimal(weftUSDTInvestment)
      .add(weftUSDCInvestment)
      .add(weftHUSDCInvestment)
      .toString();

    return {
      platform: "Weft Finance",
      total: totalInvestment,
      breakdown: [
        {
          asset: "xUSDT",
          value: weftUSDTInvestment,
          logo: xusdtLogo,
          platform: "Weft Finance",
          position: "xUSDT lend",
          apyId: StrategyId.xUSDT_Weft_Finance_Lending,
        },
        {
          asset: "xUSDC",
          value: weftUSDCInvestment,
          logo: xusdcLogo,
          platform: "Weft Finance",
          position: "xUSDC lend",
          apyId: StrategyId.xUSDC_Weft_Finance_Lending,
        },
        {
          asset: "hUSDC",
          value: weftHUSDCInvestment,
          logo: husdcLogo,
          platform: "Weft Finance",
          position: "hUSDC lend",
          apyId: StrategyId.hUSDC_Weft_Finance_Lending,
        },
      ],
      index: 1, // Update index as needed
    };
  }

  private async fetchInvestment() {
    const felixFungibles = store.getState().session.felixWallet.fungible;
    const weftXUSDTamount = felixFungibles[WEFT_W2_xUSDT_RESOURCE_ADDRESS]?.amount ?? "0";
    const weftXUSDCamount = felixFungibles[WEFT_W2_xUSDC_RESOURCE_ADDRESS]?.amount ?? "0";
    const weftHUSDCamount = felixFungibles[WEFT_W2_hUSDC_RESOURCE_ADDRESS]?.amount ?? "0";

    const data = await CachedService.gatewayApi.state.innerClient.keyValueStoreData({
      stateKeyValueStoreDataRequest: {
        key_value_store_address: WEFT_KEY_VALUE_STORE_ADDRESS,
        keys: [
          { key_json: { kind: "Reference", value: XUSDT_RESOURCE_ADDRESS } },
          { key_json: { kind: "Reference", value: XUSDC_RESOURCE_ADDRESS } },
          { key_json: { kind: "Reference", value: hUSDC_RESOURCE_ADDRESS } },
        ],
      },
    });

    const [unitRatioXUSDT, unitRatioXUSDC, unitRatioHUSDC] = data.entries.map((entry) => {
      if (entry.value.programmatic_json.kind === "Tuple") {
        const depositStateField = entry.value.programmatic_json.fields[5];
        if (
          depositStateField.kind === "Tuple" &&
          depositStateField.fields[3].kind === "PreciseDecimal"
        ) {
          return depositStateField.fields[3].value;
        }
      }
      return "0";
    });
    const weftUSDTInvestment = new Decimal(weftXUSDTamount).div(unitRatioXUSDT).toString();
    const weftUSDCInvestment = new Decimal(weftXUSDCamount).div(unitRatioXUSDC).toString();
    const weftHUSDCInvestment = new Decimal(weftHUSDCamount).div(unitRatioHUSDC).toString();
    return { usdt: weftUSDTInvestment, usdc: weftUSDCInvestment, husdc: weftHUSDCInvestment };
  }
}
const weftInvestor = new WeftInvestment();

export default weftInvestor;
