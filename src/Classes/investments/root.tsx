import CachedService from "Classes/cachedService";
import { ROOT_CDP_NFT_ADDRESS, ROOT_xUSDT_POOL_ADDRESS } from "Constants/address";
import Decimal from "decimal.js";
import { store } from "Store";

class RootInvestment {
  public async getInvestment() {
    return await this.fetchxUSDTPoolLiquidityValue();
  }

  private async fetchxUSDTPoolLiquidityValue() {
    const felixNFTs = store.getState().session.felixWallet.nonFungible;
    const nftId = felixNFTs[ROOT_CDP_NFT_ADDRESS].ids[0];
    const assets = await this.fetchLiquidityReceiptData(nftId);
    const unitToAssetRatio = await this.getUnitToAssetRatio();
    if (!Number.isNaN(+assets) && !Number.isNaN(+unitToAssetRatio)) {
      return new Decimal(assets).div(unitToAssetRatio).toString();
    }
    return "0";
  }

  private async fetchLiquidityReceiptData(nftid: string) {
    const res = await CachedService.gatewayApi.state.getNonFungibleData(
      ROOT_CDP_NFT_ADDRESS,
      nftid
    );
    if (res.data?.programmatic_json.kind === "Tuple") {
      const collateralData = res.data?.programmatic_json.fields[6];
      if (
        collateralData.kind === "Map" &&
        collateralData.entries[0].value.kind === "PreciseDecimal"
      ) {
        return collateralData.entries[0].value.value;
      }
    }
    return "0";
  }

  private async getUnitToAssetRatio() {
    const res = await CachedService.gatewayApi.state.getEntityDetailsVaultAggregated(
      ROOT_xUSDT_POOL_ADDRESS
    );

    if (res.details?.type === "Component" && res.details.state && "fields" in res.details.state) {
      const fields = res.details.state.fields as any[];
      return fields[3].value as string;
    }
    return "0";
  }
}
const rootInvestor = new RootInvestment();

export default rootInvestor;
