import { SURGE_EXCHANGE_COMPONENT, SURGE_SLP_TOKEN } from "Constants/address";
import Decimal from "decimal.js";
import { store } from "Store";
import { simulateTx } from "Utils/txSenders";

class SurgeInvestment {
  public async getInvestment() {
    return await this.fetchSurgeLiquidityValue();
  }

  private async fetchSurgeLiquidityValue() {
    const felixFungibles = store.getState().session.felixWallet.fungible;
    const felixSLPtokens = felixFungibles[SURGE_SLP_TOKEN]?.amount ?? "0";

    if (felixSLPtokens === "0" || !felixSLPtokens) {
      return "0";
    }

    const tx_result = await simulateTx(`
      CALL_METHOD 
          Address("${SURGE_EXCHANGE_COMPONENT}") 
          "get_pool_details" 
        ;
      `);

    const lp_price =
      (tx_result.receipt as any)?.output[0]?.programmatic_json?.fields[7]?.value ?? ("0" as string);

    return new Decimal(lp_price).mul(felixSLPtokens).toString();
  }
}

export default SurgeInvestment;
