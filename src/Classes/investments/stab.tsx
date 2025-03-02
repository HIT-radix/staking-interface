import { STAB_XUSDC_LIQUIDITY_RECEIPT } from "Constants/address";
import { store } from "Store";

class LiquidityInvestment {
  public async getInvestment() {
    return await this.fetch_STAB_XUSDC_liquidity();
  }

  private async fetch_STAB_XUSDC_liquidity() {
    const felixNonFungibles = store.getState().session.felixWallet.nonFungible;

    const stabxusdc_liqduidityReceipt = felixNonFungibles[STAB_XUSDC_LIQUIDITY_RECEIPT]?.ids ?? [];
    if (stabxusdc_liqduidityReceipt.length === 0 || !stabxusdc_liqduidityReceipt) {
      return "0";
    }
    // CachedService.gatewayApi.state.getNonFungibleData(STAB_XUSDC_LIQUIDITY_RECEIPT);
  }
}

export default LiquidityInvestment;
