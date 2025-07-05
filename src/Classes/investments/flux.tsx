import axios, { AxiosResponse } from "axios";
import {
  FUSD_XUSDC_LIQUIDITY_RECEIPT_C9,
  FUSD_RESOURCE_ADDRESS,
  XRD_RESOURCE_ADDRESS,
  LSULP_RESOURCE_ADDRESS,
} from "Constants/address";
import { networkRPC, Ociswap_baseurl } from "Constants/endpoints";
import { store } from "Store";
import { TokenData } from "Types/token";
import { simulateTx } from "Utils/txSenders";
import Decimal from "decimal.js";
import { InvestmentInfo } from "Types/misc";
import fUSDLogo from "Assets/Images/fUSD.png";
import { AttosStrategyId, PoolUnitEntityDetailsApiResponse } from "Types/api";

interface Receipt {
  status: string;
  output: { programmatic_json: { fields: { kind: string; value: string }[] } }[];
}

class FluxInvestment {
  private fusd_xusdc_pool_address =
    "component_rdx1cqmx9aqpr36anp960xes8f4wp7skc6pya6k9ra2jtlmlv24qslmwxf";

  private fusd_xrd_pool_unit =
    "resource_rdx1tkc32nfsvwnt7ysq2sdgyq6w2g4s69w86yzk8zwegf7pcvya905ctv";

  private fusd_xrd_reservoir_pool_unit =
    "resource_rdx1tk6gnvp5tmxqdr5zppuu50p2q9uvv89q2gyz432ukrh5md7ft4xesr";

  private fusd_lsulp_reservoir_pool_unit =
    "resource_rdx1tksgc3j8ylrjjqgtny3l4dsfnpepch32hndyk20uptplqk8zuezk0z";

  public async getInvestment(): Promise<InvestmentInfo> {
    const [fusd_xusdc, fusd_xrd, fusd_xrd_reservoir, fusd_lsulp_reservoir] = await Promise.all([
      this.fetch_fUSD_XUSDC_liquidity(),
      this.fetch_fUSD_XRD_liquidity(),
      this.fetch_XRD_fUSD_reservoir_liquidity(),
      this.fetch_LSULP_fUSD_reservoir_liquidity(),
    ]);
    return {
      platform: "Flux",
      total: new Decimal(fusd_xusdc).add(fusd_xrd).toString(),
      breakdown: [
        {
          asset: "fUSD/xUSDC CaviarNine",
          value: fusd_xusdc,
          logo: fUSDLogo,
          platform: "Flux",
          position: "fUSD/xUSDC LP",
          apyId: "fUSD_xUSDC_CaviarNine_Liquidity_Provision",
        },
        {
          asset: "fUSD/XRD OciSwap",
          value: fusd_xrd,
          logo: fUSDLogo,
          platform: "Flux",
          position: "fUSD/XRD LP",
          apyId: "fUSD_xUSDC_OciSwap_Liquidity_Provision",
        },
        {
          asset: "XRD Reservoir",
          value: fusd_xrd_reservoir,
          logo: fUSDLogo,
          platform: "Flux",
          position: "XRD Reservoir",
          apyId: AttosStrategyId.XRD_Flux_Liquidation,
        },
        {
          asset: "LSULP Reservoir",
          value: fusd_lsulp_reservoir,
          logo: fUSDLogo,
          platform: "Flux",
          position: "LSULP Reservoir",
          apyId: AttosStrategyId.LSULP_Flux_Liquidation,
        },
      ],
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

  private async fetch_fUSD_XRD_liquidity() {
    try {
      const felixFungibles = store.getState().session.felixWallet.fungible;
      const felixLPBalance = felixFungibles[this.fusd_xrd_pool_unit]?.amount ?? "0";
      let computedFUSDValue = "0";
      let computedXRDValue = "0";

      const response = await axios.post<any, AxiosResponse<PoolUnitEntityDetailsApiResponse>>(
        `${networkRPC}/state/entity/details`,
        {
          addresses: [this.fusd_xrd_pool_unit],
          aggregation_level: "Vault",
          opt_ins: {
            ancestor_identities: true,
            component_royalty_config: true,
            component_royalty_vault_balance: true,
            package_royalty_vault_balance: true,
            non_fungible_include_nfids: true,
            dapp_two_way_links: true,
            native_resource_details: true,
            explicit_metadata: ["name", "description"],
          },
        }
      );

      if (response.status === 200) {
        const poolUnitDetails = response.data.items[0].details;

        poolUnitDetails.native_resource_details.unit_redemption_value.forEach((redemptionValue) => {
          if (redemptionValue.resource_address === FUSD_RESOURCE_ADDRESS) {
            computedFUSDValue = new Decimal(redemptionValue.amount).mul(felixLPBalance).toString();
          }
          if (redemptionValue.resource_address === XRD_RESOURCE_ADDRESS) {
            computedXRDValue = new Decimal(redemptionValue.amount).mul(felixLPBalance).toString();
          }
        });
      }

      const xrdPrice = await this.fetchXRDPrice();
      const xrdInUSDC = new Decimal(computedXRDValue).mul(xrdPrice);
      return new Decimal(computedFUSDValue).plus(xrdInUSDC).toString();
    } catch (error) {
      console.log("error in fetch_fUSD_XRD_liquidity", error);
      return "0";
    }
  }

  private async fetch_XRD_fUSD_reservoir_liquidity() {
    try {
      const felixFungibles = store.getState().session.felixWallet.fungible;
      const felixLPBalance = felixFungibles[this.fusd_xrd_reservoir_pool_unit]?.amount ?? "0";
      let computedFUSDValue = "0";
      let computedXRDValue = "0";

      const response = await axios.post<any, AxiosResponse<PoolUnitEntityDetailsApiResponse>>(
        `${networkRPC}/state/entity/details`,
        {
          addresses: [this.fusd_xrd_reservoir_pool_unit],
          aggregation_level: "Vault",
          opt_ins: {
            ancestor_identities: true,
            component_royalty_config: true,
            component_royalty_vault_balance: true,
            package_royalty_vault_balance: true,
            non_fungible_include_nfids: true,
            dapp_two_way_links: true,
            native_resource_details: true,
            explicit_metadata: ["name", "description"],
          },
        }
      );

      if (response.status === 200) {
        const poolUnitDetails = response.data.items[0].details;

        poolUnitDetails.native_resource_details.unit_redemption_value.forEach((redemptionValue) => {
          if (redemptionValue.resource_address === FUSD_RESOURCE_ADDRESS) {
            computedFUSDValue = new Decimal(redemptionValue.amount).mul(felixLPBalance).toString();
          }
          if (redemptionValue.resource_address === XRD_RESOURCE_ADDRESS) {
            computedXRDValue = new Decimal(redemptionValue.amount).mul(felixLPBalance).toString();
          }
        });
      }

      const xrdPrice = await this.fetchXRDPrice();
      const xrdInUSDC = new Decimal(computedXRDValue).mul(xrdPrice);
      return new Decimal(computedFUSDValue).plus(xrdInUSDC).toString();
    } catch (error) {
      console.log("error in fetch_fUSD_XRD_liquidity", error);
      return "0";
    }
  }

  private async fetch_LSULP_fUSD_reservoir_liquidity() {
    try {
      const felixFungibles = store.getState().session.felixWallet.fungible;
      const felixLPBalance = felixFungibles[this.fusd_lsulp_reservoir_pool_unit]?.amount ?? "0";
      let computedFUSDValue = "0";
      let computedLSULPValue = "0";

      const response = await axios.post<any, AxiosResponse<PoolUnitEntityDetailsApiResponse>>(
        `${networkRPC}/state/entity/details`,
        {
          addresses: [this.fusd_lsulp_reservoir_pool_unit],
          aggregation_level: "Vault",
          opt_ins: {
            ancestor_identities: true,
            component_royalty_config: true,
            component_royalty_vault_balance: true,
            package_royalty_vault_balance: true,
            non_fungible_include_nfids: true,
            dapp_two_way_links: true,
            native_resource_details: true,
            explicit_metadata: ["name", "description"],
          },
        }
      );

      if (response.status === 200) {
        const poolUnitDetails = response.data.items[0].details;

        poolUnitDetails.native_resource_details.unit_redemption_value.forEach((redemptionValue) => {
          if (redemptionValue.resource_address === FUSD_RESOURCE_ADDRESS) {
            computedFUSDValue = new Decimal(redemptionValue.amount).mul(felixLPBalance).toString();
          }
          if (redemptionValue.resource_address === LSULP_RESOURCE_ADDRESS) {
            computedLSULPValue = new Decimal(redemptionValue.amount).mul(felixLPBalance).toString();
          }
        });
      }

      const lsulpPrice = await this.fetchLSULPPrice();
      const lsulpInUSDC = new Decimal(computedLSULPValue).mul(lsulpPrice);
      return new Decimal(computedFUSDValue).plus(lsulpInUSDC).toString();
    } catch (error) {
      console.log("error in fetch_fUSD_XRD_liquidity", error);
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

  private async fetchLSULPPrice() {
    const res = await axios.get<any, AxiosResponse<TokenData>>(
      `${Ociswap_baseurl}/tokens/${LSULP_RESOURCE_ADDRESS}`
    );

    if (res.status === 200) {
      return +res.data.price.usd.now;
    }

    return 0;
  }

  private async fetchXRDPrice() {
    const res = await axios.get<any, AxiosResponse<TokenData>>(
      `${Ociswap_baseurl}/tokens/${XRD_RESOURCE_ADDRESS}`
    );

    if (res.status === 200) {
      return +res.data.price.usd.now;
    }

    return 0;
  }
}

const fluxInvestor = new FluxInvestment();

export default fluxInvestor;
