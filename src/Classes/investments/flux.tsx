import axios, { AxiosResponse } from "axios";
import { FUSD_XUSDC_LIQUIDITY_RECEIPT_C9, FUSD_RESOURCE_ADDRESS } from "Constants/address";
import { Ociswap_baseurl } from "Constants/endpoints";
import { store } from "Store";
import { TokenData } from "Types/token";
import { simulateTx } from "Utils/txSenders";
import Decimal from "decimal.js";
import { InvestmentInfo } from "Types/misc";
import fUSDLogo from "Assets/Images/fUSD.png";

interface Receipt {
  status: string;
  output: { programmatic_json: { fields: { kind: string; value: string }[] } }[];
}

class FluxInvestment {
  private fusd_xusdc_pool_address =
    "component_rdx1cqmx9aqpr36anp960xes8f4wp7skc6pya6k9ra2jtlmlv24qslmwxf";

  public async getInvestment(): Promise<InvestmentInfo> {
    const fusd_xusdc = await this.fetch_fUSD_XUSDC_liquidity();
    return {
      platform: "Flux",
      total: fusd_xusdc,
      breakdown: [{ asset: "fUSD/xUSDC LP CaviarNine", value: fusd_xusdc, logo: fUSDLogo }],
      index: 4, // Update index as needed
    };
  }

  private async fetch_fUSD_XUSDC_liquidity() {
    try {
      const tokenValuesInsideNFTs: Record<string, { fUSD: string; xUSDC: string }> = {};
      let totalAccumulatedValue = new Decimal(0);
      const felixNonFungibles = store.getState().session.felixWallet.nonFungible;
      const fusd_xusdc_liqduidityReceipt =
        felixNonFungibles[FUSD_XUSDC_LIQUIDITY_RECEIPT_C9]?.ids ?? [];
      if (!fusd_xusdc_liqduidityReceipt.length) {
        return "0";
      }

      const fUsdPrice = await this.fetchFUSDPrice();

      await Promise.all(
        fusd_xusdc_liqduidityReceipt.map(async (id) => {
          const tx_result = await simulateTx(`
            CALL_METHOD 
                Address("${this.fusd_xusdc_pool_address}") 
                "get_redemption_value"
                NonFungibleLocalId("${id}")
          ;`);
          const receipt = tx_result.receipt as Receipt;
          if (receipt.status === "Succeeded") {
            tokenValuesInsideNFTs[id] = {
              fUSD: receipt.output[0].programmatic_json.fields[0].value,
              xUSDC: receipt.output[0].programmatic_json.fields[1].value,
            };
          }
        })
      );

      // Calculate accumulated USD value for each NFT
      for (const id in tokenValuesInsideNFTs) {
        const tokens = tokenValuesInsideNFTs[id];
        // fUSD token value: token amount * fUsdPrice (usd per STAB)
        const fUsdValue = new Decimal(tokens.fUSD).times(fUsdPrice);
        // xUSDC token usd value will be 1 by default, so its value is the token amount
        const xUSDCUsdValue = new Decimal(tokens.xUSDC);
        // Sum of both token values
        const sumUsdValue = fUsdValue.plus(xUSDCUsdValue);
        totalAccumulatedValue = totalAccumulatedValue.plus(sumUsdValue);
      }
      return totalAccumulatedValue.toString();
    } catch (error) {
      console.error("Error fetching STAB XUSDC liquidity:", error);
      return "0";
    }
  }

  private async fetchFUSDPrice() {
    const res = await axios.get<any, AxiosResponse<TokenData>>(
      `${Ociswap_baseurl}/tokens/${FUSD_RESOURCE_ADDRESS}`
    );

    if (res.status === 200) {
      return +res.data.price.usd.now;
    }

    return 0;
  }
}

const fluxInvestor = new FluxInvestment();

export default fluxInvestor;
