import axios, { AxiosResponse } from "axios";

import { Ociswap_baseurl, networkRPC } from "Constants/endpoints";
import { store } from "Store";
import { setHitFomoPrices } from "Store/Reducers/app";
import { setFomoBalance, setHitBalance, updateHitFomoData } from "Store/Reducers/session";
import {
  setIsOwner,
  setLockedHITRewards,
  setLockedNodeStakingFomos,
  setLockedNodeStakingHits,
  setNodeStakeNFTid,
  // setOldLockedNodeStakingFomos,
  setStHitBalance,
  setStHitTotalSupply,
  setStakedHIT,
} from "Store/Reducers/staking";
import { StakingTokens, Tabs } from "Types/reducers";
import { TokenData } from "Types/token";
import { BN, extractBalances } from "./format";
import { EntityDetails } from "Types/api";
import {
  NODE_STAKING_USER_BADGE_ADDRESS,
  NODE_STAKING_FOMO_KEY_VALUE_STORE_ADDRESS,
  NODE_STAKING_HIT_KEY_VALUE_STORE_ADDRESS,
  POOL_ADDRESS,
  RUG_PROOF_STAKING_COMPONENT_ADDRESS,
  STHIT_RESOURCE_ADDRESS,
  HIT_RESOURCE_ADDRESS,
  FOMO_RESOURCE_ADDRESS,
  NODE_STAKING_COMPONENT_ADDRESS,
  // OLD_FOMO_RESOURCE_ADDRESS,
  // OLD_NODE_STAKING_FOMO_KEY_VALUE_STORE_ADDRESS,
} from "Constants/address";
import {
  setRugProofComponentDataLoading,
  setFindingNodeNFT,
  setNodeStakingRewardsLoading,
  setPoolDataLoading,
  setStHitDataLoading,
  setTokenDataLoading,
  setNodeStakingComponentDataLoading,
} from "Store/Reducers/loadings";
import CachedService from "Classes/cachedService";

export const fetchBalances = async (walletAddress: string) => {
  let HITbalance = "0";
  let stHITbalance = "0";
  let fomobalance = "0";
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
        const { balances, isOwner: isOwnerFound } = extractBalances(
          response.data.items[0].fungible_resources.items,
          [
            { symbol: StakingTokens.HIT, address: HIT_RESOURCE_ADDRESS },
            { symbol: StakingTokens.StHIT, address: STHIT_RESOURCE_ADDRESS },
            { symbol: StakingTokens.FOMO, address: FOMO_RESOURCE_ADDRESS },
          ],
          true
        );
        HITbalance = balances[StakingTokens.HIT];
        stHITbalance = balances[StakingTokens.StHIT];
        fomobalance = balances[StakingTokens.FOMO];
        isOwner = isOwnerFound;
      }
    } catch (error) {
      console.log("error in fetchBalances", error);
    }
  }
  store.dispatch(setHitBalance(HITbalance));
  store.dispatch(setStHitBalance(stHITbalance));
  store.dispatch(setFomoBalance(fomobalance));
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

export const fetchHitFomoData = async () => {
  let hitPrice: number | undefined = undefined;
  let fomoPrice: number | undefined = undefined;
  let hitData: TokenData | undefined = undefined;
  let fomoData: TokenData | undefined = undefined;
  try {
    store.dispatch(setTokenDataLoading(true));

    // Use Promise.all to fetch both tokens data simultaneously
    const [hitDataResponse, fomoDataResponse] = await Promise.all([
      axios.get<any, AxiosResponse<TokenData>>(`${Ociswap_baseurl}/tokens/${HIT_RESOURCE_ADDRESS}`),
      axios.get<any, AxiosResponse<TokenData>>(
        `${Ociswap_baseurl}/tokens/${FOMO_RESOURCE_ADDRESS}`
      ),
    ]);

    // Handle HIT token response
    if (hitDataResponse.status === 200) {
      hitPrice = +hitDataResponse.data.price.usd.now;
      hitData = hitDataResponse.data;
    } else {
      console.error("Failed to fetch HIT token data", hitDataResponse.status);
    }

    // Handle FOMO token response
    if (fomoDataResponse.status === 200) {
      fomoPrice = +fomoDataResponse.data.price.usd.now;
      fomoData = fomoDataResponse.data;
    } else {
      console.error("Failed to fetch FOMO token data", fomoDataResponse.status);
    }
  } catch (error) {
    console.error("Error fetching token data", error);
  } finally {
    store.dispatch(setHitFomoPrices({ hit: hitPrice, fomo: fomoPrice }));
    store.dispatch(updateHitFomoData({ hit: hitData, fomo: fomoData }));
    store.dispatch(setTokenDataLoading(false));
  }
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
      const { balances } = extractBalances(response.data.items[0].fungible_resources.items, [
        { symbol: StakingTokens.HIT, address: HIT_RESOURCE_ADDRESS },
      ]);
      stakedHIT = balances[StakingTokens.HIT];
    }
  } catch (error) {
    console.log("error in fetchPoolDetails", error);
  }
  store.dispatch(setStakedHIT(stakedHIT));
  store.dispatch(setPoolDataLoading(false));
};

export const fetchRugProofComponentDetails = async () => {
  let lockedHITs = "0";
  try {
    store.dispatch(setRugProofComponentDataLoading(true));
    const response = await axios.post<any, AxiosResponse<EntityDetails>>(
      `${networkRPC}/state/entity/details`,
      {
        addresses: [RUG_PROOF_STAKING_COMPONENT_ADDRESS],
      }
    );

    if (response.status === 200) {
      const { balances } = extractBalances(response.data.items[0].fungible_resources.items, [
        { symbol: StakingTokens.HIT, address: HIT_RESOURCE_ADDRESS },
      ]);
      lockedHITs = balances[StakingTokens.HIT];
    }
  } catch (error) {
    console.log("error in fetchRugProofComponentDetails", error);
  }
  store.dispatch(setLockedHITRewards(lockedHITs));
  store.dispatch(setRugProofComponentDataLoading(false));
};

export const fetchNodeStakingComponentDetails = async () => {
  let lockedHITs = "0";
  let lockedFOMOs = "0";
  // let oldLockedFOMOs = "0";
  try {
    store.dispatch(setNodeStakingComponentDataLoading(true));
    const response = await axios.post<any, AxiosResponse<EntityDetails>>(
      `${networkRPC}/state/entity/details`,
      {
        addresses: [NODE_STAKING_COMPONENT_ADDRESS],
      }
    );

    if (response.status === 200) {
      const { balances } = extractBalances(response.data.items[0].fungible_resources.items, [
        { symbol: StakingTokens.HIT, address: HIT_RESOURCE_ADDRESS },
        { symbol: StakingTokens.FOMO, address: FOMO_RESOURCE_ADDRESS },
        // { symbol: `old${StakingTokens.FOMO}`, address: OLD_FOMO_RESOURCE_ADDRESS },
      ]);
      lockedHITs = balances[StakingTokens.HIT];
      lockedFOMOs = balances[StakingTokens.FOMO];
      // oldLockedFOMOs = balances[`old${StakingTokens.FOMO}`];
    }
  } catch (error) {
    console.log("error in fetchNodeStakingComponentDetails", error);
  }
  store.dispatch(setLockedNodeStakingHits(lockedHITs));
  store.dispatch(setLockedNodeStakingFomos(lockedFOMOs));
  // store.dispatch(setOldLockedNodeStakingFomos(oldLockedFOMOs));
  store.dispatch(setNodeStakingComponentDataLoading(false));
};

export const findNodeStakeNFT = async (walletAddress: string) => {
  store.dispatch(setFindingNodeNFT(true));
  const details = await CachedService.gatewayApi.state.getEntityDetailsVaultAggregated(
    walletAddress
  );
  let nftId: number | undefined = undefined;
  details.non_fungible_resources.items.some((nft_resource) => {
    if (nft_resource.resource_address === NODE_STAKING_USER_BADGE_ADDRESS) {
      if (nft_resource.vaults.items[0].items) {
        const userNftid = Number(nft_resource.vaults.items[0].items[0].replace(/#/g, ""));
        nftId = Number.isNaN(userNftid) ? undefined : userNftid;
        return true;
      }
    }
    return false;
  });
  store.dispatch(setNodeStakeNFTid(nftId));
  store.dispatch(setFindingNodeNFT(false));
};

export const fetchClaimableNodeStakingRewards = async (nftId: number) => {
  const keyValueAddressesWithTheirTokens = [
    { address: NODE_STAKING_HIT_KEY_VALUE_STORE_ADDRESS, token: StakingTokens.HIT },
    { address: NODE_STAKING_FOMO_KEY_VALUE_STORE_ADDRESS, token: StakingTokens.FOMO },
    // { address: OLD_NODE_STAKING_FOMO_KEY_VALUE_STORE_ADDRESS, token: `old${StakingTokens.FOMO}` },
  ];

  let claimableRewards = {
    HIT: "0",
    FOMO: "0",
    // oldFOMO: "0"
  };

  try {
    store.dispatch(setNodeStakingRewardsLoading(true));
    const keyValueDataResponses = await Promise.all(
      keyValueAddressesWithTheirTokens.map((key_value_store_address) =>
        CachedService.gatewayApi.state.innerClient.keyValueStoreData({
          stateKeyValueStoreDataRequest: {
            key_value_store_address: key_value_store_address.address,
            keys: [{ key_json: { kind: "U64", value: nftId.toString() } }],
          },
        })
      )
    );
    keyValueDataResponses.forEach((response, index) => {
      if (
        response.entries.length > 0 &&
        response.entries[0].value.programmatic_json.kind === "Decimal"
      ) {
        claimableRewards[
          keyValueAddressesWithTheirTokens[index].token as keyof typeof claimableRewards
        ] = response.entries[0].value.programmatic_json.value;
      }
    });
  } catch (error) {
    console.log("unable to fetch ClaimableNodeStakingRewards:", error);
  }
  store.dispatch(setNodeStakingRewardsLoading(false));
  return claimableRewards;
};
