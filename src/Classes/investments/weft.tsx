import {
  WEFT_KEY_VALUE_STORE_ADDRESS,
  WEFT_W2_xUSDC_RESOURCE_ADDRESS,
  WEFT_W2_xUSDT_RESOURCE_ADDRESS,
  XUSDC_RESOURCE_ADDRESS,
  XUSDT_RESOURCE_ADDRESS,
} from "Constants/address";
import CachedService from "../cachedService";
import { store } from "Store";
import Decimal from "decimal.js";

class WeftInvestment {
  public async getInvestment() {
    return await this.fetchInvestment();
  }

  private async fetchInvestment() {
    const felixFungibles = store.getState().session.felixWallet.fungible;
    const weftXUSDTamount = felixFungibles[WEFT_W2_xUSDT_RESOURCE_ADDRESS]?.amount ?? "0";
    const weftXUSDCamount = felixFungibles[WEFT_W2_xUSDC_RESOURCE_ADDRESS]?.amount ?? "0";

    if (
      weftXUSDTamount === "0" ||
      weftXUSDCamount === "0" ||
      !weftXUSDTamount ||
      !weftXUSDCamount
    ) {
      return "0";
    }

    const data = await CachedService.gatewayApi.state.innerClient.keyValueStoreData({
      stateKeyValueStoreDataRequest: {
        key_value_store_address: WEFT_KEY_VALUE_STORE_ADDRESS,
        keys: [
          { key_json: { kind: "Reference", value: XUSDT_RESOURCE_ADDRESS } },
          { key_json: { kind: "Reference", value: XUSDC_RESOURCE_ADDRESS } },
        ],
      },
    });

    const [unitRatioXUSDT, unitRatioXUSDC] = data.entries.map((entry) => {
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
    return weftUSDTInvestment + weftUSDCInvestment;
  }
}

export default WeftInvestment;
