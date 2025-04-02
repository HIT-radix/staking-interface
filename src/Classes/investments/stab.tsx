import axios, { AxiosResponse } from "axios";
import { STAB_RESOURCE_ADDRESS, STAB_XUSDC_LIQUIDITY_RECEIPT } from "Constants/address";
import { Ociswap_baseurl } from "Constants/endpoints";
import { store } from "Store";
import { TokenData } from "Types/token";
import { simulateTx } from "Utils/txSenders";
import Decimal from "decimal.js";
import { InvestmentInfo } from "Types/misc";

interface Receipt {
  status: string;
  output: { programmatic_json: { fields: { kind: string; value: string }[] } }[];
}

class C9Investment {
  private stab_xusdc_pool_address =
    "component_rdx1cpqcstnjnj5cpag7wc04y6t4azrfxjtr3g53jdpv4y72m0lpp8qkf4";

  public async getInvestment(): Promise<InvestmentInfo> {
    const totalValue = await this.fetch_STAB_XUSDC_liquidity();
    return {
      platform: "STAB/xUSDC LP CaviarNine",
      total: totalValue,
      breakdown: [],
      index: 4, // Update index as needed
    };
  }

  private async fetch_STAB_XUSDC_liquidity() {
    try {
      const tokenValuesInsideNFTs: Record<string, { STAB: string; xUSDC: string }> = {};
      let totalAccumulatedValue = new Decimal(0);
      const felixNonFungibles = store.getState().session.felixWallet.nonFungible;
      const stabxusdc_liqduidityReceipt =
        felixNonFungibles[STAB_XUSDC_LIQUIDITY_RECEIPT]?.ids ?? [];
      if (!stabxusdc_liqduidityReceipt.length) {
        return "0";
      }

      const stabPrice = await this.fetchSTABPrice();

      await Promise.all(
        stabxusdc_liqduidityReceipt.map(async (id) => {
          const tx_result = await simulateTx(`
            CALL_METHOD 
                Address("${this.stab_xusdc_pool_address}") 
                "get_redemption_value"
                NonFungibleLocalId("${id}")
          ;`);
          const receipt = tx_result.receipt as Receipt;
          if (receipt.status === "Succeeded") {
            tokenValuesInsideNFTs[id] = {
              STAB: receipt.output[0].programmatic_json.fields[0].value,
              xUSDC: receipt.output[0].programmatic_json.fields[1].value,
            };
          }
        })
      );

      // Calculate accumulated USD value for each NFT
      for (const id in tokenValuesInsideNFTs) {
        const tokens = tokenValuesInsideNFTs[id];
        // STAB token value: token amount * stabPrice (usd per STAB)
        const stabUsdValue = new Decimal(tokens.STAB).times(new Decimal(stabPrice));
        // xUSDC token usd value will be 1 by default, so its value is the token amount
        const xUSDCUsdValue = new Decimal(tokens.xUSDC);
        // Sum of both token values
        const sumUsdValue = stabUsdValue.plus(xUSDCUsdValue);
        totalAccumulatedValue = totalAccumulatedValue.plus(sumUsdValue);
      }
      return totalAccumulatedValue.toString();
    } catch (error) {
      console.error("Error fetching STAB XUSDC liquidity:", error);
      return "0";
    }
  }

  private async fetchSTABPrice() {
    const res = await axios.get<any, AxiosResponse<TokenData>>(
      `${Ociswap_baseurl}/tokens/${STAB_RESOURCE_ADDRESS}`
    );

    if (res.status === 200) {
      return +res.data.price.usd.now;
    }

    return 0;
  }
}

const c9Investor = new C9Investment();

export default c9Investor;
