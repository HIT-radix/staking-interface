import { Ociswap_baseurl, networkRPC } from "Constants/endpoints";
import { store } from "Store";
import { setHitPrice } from "Store/Reducers/app";
import { setHitBalance, updateTokenData } from "Store/Reducers/session";
import {
  setIsOwner,
  setLockedHITRewards,
  setStHitBalance,
  setStHitTotalSupply,
  setStakedHIT,
} from "Store/Reducers/staking";
import { Tabs } from "Types/reducers";
import { TokenData } from "Types/token";
import axios, { AxiosResponse } from "axios";
import { BN, extract_HIT_STHIT_balance } from "./format";
import { EntityDetails } from "Types/api";
import { POOL_ADDRESS, STAKING_COMPONENT_ADDRESS, STHIT_RESOURCE_ADDRESS } from "Constants/address";
import {
  setComponentDataLoading,
  setPoolDataLoading,
  setStHitDataLoading,
  setTokenDataLoading,
} from "Store/Reducers/loadings";

export const fetchBalances = async (walletAddress: string) => {
  let HITbalance = "0";
  let stHITbalance = "0";
  let isOwner = false;
  if (walletAddress) {
    try {
      const response = await axios.post<any, AxiosResponse<EntityDetails>>(
        `${networkRPC}/state/entity/details`,
        {
          addresses: [walletAddress],
        }
      );

      if (response.status === 200) {
        const balances = extract_HIT_STHIT_balance(
          response.data.items[0].fungible_resources.items,
          true
        );
        HITbalance = balances.hit;
        stHITbalance = balances.sthit;
        isOwner = balances.isOwner;
      }
    } catch (error) {
      console.log("error in fetchBalances", error);
    }
  }
  store.dispatch(setHitBalance(HITbalance));
  store.dispatch(setStHitBalance(stHITbalance));
  store.dispatch(setIsOwner(isOwner));
};

export const getSelectedBalance = () => {
  const state = store.getState();
  const {
    staking: { currentTab, stHitBalance },
    session: { hitBalance },
  } = state;
  return currentTab === Tabs.stake ? BN(hitBalance) : BN(stHitBalance);
};

export const fetchHITdata = async () => {
  try {
    store.dispatch(setTokenDataLoading(true));
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
  store.dispatch(setTokenDataLoading(false));
};

export const fetchStHITTotalSupply = async () => {
  let totalSupply = "0";
  try {
    store.dispatch(setStHitDataLoading(true));
    const response = await axios.post<any, AxiosResponse<EntityDetails>>(
      `${networkRPC}/state/entity/details`,
      {
        addresses: [STHIT_RESOURCE_ADDRESS],
      }
    );

    if (response.status === 200) {
      totalSupply = response.data.items[0].details.total_supply;
    }
  } catch (error) {
    console.log("error in fetchStHITTotalSupply", error);
  }
  store.dispatch(setStHitTotalSupply(totalSupply));
  store.dispatch(setStHitDataLoading(false));
};

export const fetchPoolDetails = async () => {
  let stakedHIT = "0";
  try {
    store.dispatch(setPoolDataLoading(true));
    const response = await axios.post<any, AxiosResponse<EntityDetails>>(
      `${networkRPC}/state/entity/details`,
      {
        addresses: [POOL_ADDRESS],
      }
    );

    if (response.status === 200) {
      const balances = extract_HIT_STHIT_balance(response.data.items[0].fungible_resources.items);
      stakedHIT = balances.hit;
    }
  } catch (error) {
    console.log("error in fetchPoolDetails", error);
  }
  store.dispatch(setStakedHIT(stakedHIT));
  store.dispatch(setPoolDataLoading(false));
};

export const fetchComponentDetails = async () => {
  let lockedHITs = "0";
  try {
    store.dispatch(setComponentDataLoading(true));
    const response = await axios.post<any, AxiosResponse<EntityDetails>>(
      `${networkRPC}/state/entity/details`,
      {
        addresses: [STAKING_COMPONENT_ADDRESS],
      }
    );

    if (response.status === 200) {
      const balances = extract_HIT_STHIT_balance(response.data.items[0].fungible_resources.items);
      lockedHITs = balances.hit;
    }
  } catch (error) {
    console.log("error in fetchComponentDetails", error);
  }
  store.dispatch(setLockedHITRewards(lockedHITs));
  store.dispatch(setComponentDataLoading(false));
};
