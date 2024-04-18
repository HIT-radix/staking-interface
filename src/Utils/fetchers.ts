import { Ociswap_baseurl, networkRPC } from "Constants/endpoints";
import { store } from "Store";
import { setHitPrice } from "Store/Reducers/app";
import { setHitBalance, updateTokenData } from "Store/Reducers/session";
import { setStHitBalance } from "Store/Reducers/staking";
import { Tabs } from "Types/reducers";
import { TokenData } from "Types/token";
import axios, { AxiosResponse } from "axios";
import { extract_HIT_STHIT_balance } from "./format";
import { WalletAddressDetails } from "Types/api";

export const fetchBalances = async (walletAddress: string) => {
  let HITbalance = "0";
  let stHITbalance = "0";
  if (walletAddress) {
    try {
      const response = await axios.post<any, AxiosResponse<WalletAddressDetails>>(
        `${networkRPC}/state/entity/details`,
        {
          addresses: [walletAddress],
        }
      );

      if (response.status === 200) {
        const balances = extract_HIT_STHIT_balance(response.data.items[0].fungible_resources.items);
        HITbalance = balances.hit;
        stHITbalance = balances.sthit;
      }
    } catch (error) {
      console.log("error in fetchBalances", error);
    }
  }
  store.dispatch(setHitBalance(HITbalance));
  store.dispatch(setStHitBalance(stHITbalance));
};

export const getSelectedBalance = () => {
  const state = store.getState();
  const {
    staking: { currentTab, stHitBalance },
    session: { hitBalance },
  } = state;
  return Number(currentTab === Tabs.stake ? hitBalance : stHitBalance);
};

export const fetchHITdata = async () => {
  try {
    const data = await axios.get<any, AxiosResponse<TokenData>>(
      `${Ociswap_baseurl}/tokens/resource_rdx1t4v2jke9xkcrqra9sf3lzgpxwdr590npkt03vufty4pwuu205q03az`
    );
    if (data.status === 200) {
      store.dispatch(setHitPrice(+data.data.price.usd.now));
      store.dispatch(updateTokenData(data.data));
    }
  } catch (error) {
    console.log("error in fetchHITdata", error);
  }
};
