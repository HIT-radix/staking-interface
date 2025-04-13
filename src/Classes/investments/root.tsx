import CachedService from "Classes/cachedService";
import {
  ROOT_CDP_NFT_ADDRESS,
  ROOT_xUSDC_POOL_ADDRESS,
  ROOT_xUSDT_POOL_ADDRESS,
  XUSDC_RESOURCE_ADDRESS,
  XUSDT_RESOURCE_ADDRESS,
} from "Constants/address";
import Decimal from "decimal.js";
import { store } from "Store";
import { InvestmentInfo } from "Types/misc";

class RootInvestment {
  public async getInvestment(): Promise<InvestmentInfo> {
    const { xusdt, xusdc } = await this.fetchAllLiquidityValues();
    const total = new Decimal(xusdt).add(xusdc).toString();
    return {
      platform: "Root Finance",
      total,
      breakdown: [
        { asset: "xUSDT", value: xusdt },
        { asset: "xUSDC", value: xusdc },
      ],
      index: 2, // Update index as needed
    };
  }

  private async fetchAllLiquidityValues() {
    const felixNFTs = store.getState().session.felixWallet.nonFungible;
    const nftIds = felixNFTs[ROOT_CDP_NFT_ADDRESS].ids;
    const assetsWithValues = await this.fetchLiquidityReceiptsData(nftIds);

    const xusdt = await this.fetchPoolLiquidityValue(
      assetsWithValues[XUSDT_RESOURCE_ADDRESS],
      ROOT_xUSDT_POOL_ADDRESS
    );
    const xusdc = await this.fetchPoolLiquidityValue(
      assetsWithValues[XUSDC_RESOURCE_ADDRESS],
      ROOT_xUSDC_POOL_ADDRESS
    );

    return { xusdt, xusdc };
  }

  private async fetchPoolLiquidityValue(assetValue: string = "0", poolAddress: string) {
    const unitToAssetRatio = await this.getUnitToAssetRatio(poolAddress);
    if (!Number.isNaN(+assetValue) && !Number.isNaN(+unitToAssetRatio)) {
      return new Decimal(assetValue).div(unitToAssetRatio).toString();
    }
    return "0";
  }

  private async fetchLiquidityReceiptsData(nftids: string[]) {
    const res = await CachedService.gatewayApi.state.getNonFungibleData(
      ROOT_CDP_NFT_ADDRESS,
      nftids
    );
    let assetsData: Record<string, string> = {};

    res.forEach((itemRes) => {
      if (itemRes.data?.programmatic_json.kind === "Tuple") {
        const collateralData = itemRes.data?.programmatic_json.fields[6];
        if (collateralData.kind === "Map") {
          collateralData.entries.forEach((entry) => {
            let tokenAddress = "";
            let assetValue = "0";
            if (entry.value.kind === "PreciseDecimal") {
              assetValue = entry.value.value;
            }
            if (entry.key.kind === "Reference") {
              tokenAddress = entry.key.value;
            }
            assetsData[tokenAddress] = assetValue;
          });
        }
      }
    });

    return assetsData;
  }

  private async getUnitToAssetRatio(poolAddress: string) {
    const res = await CachedService.gatewayApi.state.getEntityDetailsVaultAggregated(poolAddress);

    if (res.details?.type === "Component" && res.details.state && "fields" in res.details.state) {
      const fields = res.details.state.fields as any[];
      return fields[3].value as string;
    }
    return "0";
  }
}
const rootInvestor = new RootInvestment();

export default rootInvestor;
