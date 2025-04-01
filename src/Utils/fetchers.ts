import axios, { AxiosResponse } from "axios";

import { Ociswap_baseurl, networkRPC } from "Constants/endpoints";
import { dispatch, store } from "Store";
import { setHitFomoPrices } from "Store/Reducers/app";
import {
  setFelixWallet,
  setFomoBalance,
  setHitBalance,
  setxusdtBalance,
  updateHitFomoData,
} from "Store/Reducers/session";
import {
  setIsOwner,
  setLockedHITRewards,
  setLockedNodeStakingFomos,
  setLockedNodeStakingHits,
  setLockedNodeStakingxUSDTs,
  setNodeStakeNFTid,
  // setOldLockedNodeStakingFomos,
  setStHitBalance,
  setStHitTotalSupply,
  setStakedHIT,
} from "Store/Reducers/staking";
import { StakingTokens, Tabs } from "Types/reducers";
import { FungibleBalances, NonFungibleBalances, TokenData } from "Types/token";
import { BN, extractBalances, extractBalancesNew } from "./format";
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
  XUSDT_RESOURCE_ADDRESS,
  NODE_STAKING_XUSDT_KEY_VALUE_STORE_ADDRESS,
  FELIX_WALLET_ADDRESS,
  // OLD_FOMO_RESOURCE_ADDRESS,
  // OLD_NODE_STAKING_FOMO_KEY_VALUE_STORE_ADDRESS,
} from "Constants/address";
import {
  setRugProofComponentDataLoading,
  setNodeStakingRewardsLoading,
  setPoolDataLoading,
  setStHitDataLoading,
  setTokenDataLoading,
  setNodeStakingComponentDataLoading,
} from "Store/Reducers/loadings";
import CachedService from "Classes/cachedService";
import {
  FungibleResourcesCollectionItem,
  NonFungibleResourcesCollectionItem,
  StateEntityFungiblesPageResponse,
  StateEntityNonFungiblesPageResponse,
} from "@radixdlt/babylon-gateway-api-sdk";

export const fetchBalances = async (walletAddress: string) => {
  let HITbalance = "0";
  let stHITbalance = "0";
  let fomobalance = "0";
  let xUSDTbalance = "0";
  let isOwner = false;
  let nftId: number | undefined = undefined;

  if (walletAddress) {
    try {
      const allFungibleItems = await fetchAllFungibles(walletAddress);
      const allNonFungibleItems = await fetchAllNonFungibles(walletAddress);

      // Collect all NFT ids from NODE_STAKING_USER_BADGE_ADDRESS
      const nftCandidates: number[] = [];
      allNonFungibleItems.forEach((nonfungItem) => {
        if (
          nonfungItem.aggregation_level === "Vault" &&
          nonfungItem.resource_address === NODE_STAKING_USER_BADGE_ADDRESS
        ) {
          const items = nonfungItem.vaults.items[0].items;
          if (items && items.length > 0) {
            items.forEach((nft) => {
              const parsed = Number(nft.replace(/#/g, ""));
              if (!Number.isNaN(parsed)) {
                nftCandidates.push(parsed);
              }
            });
          }
        }
      });
      if (nftCandidates.length > 0) {
        nftId = Math.min(...nftCandidates);
      }

      const { balances, isOwner: isOwnerFound } = extractBalancesNew(
        allFungibleItems,
        [
          { symbol: StakingTokens.HIT, address: HIT_RESOURCE_ADDRESS },
          { symbol: StakingTokens.StHIT, address: STHIT_RESOURCE_ADDRESS },
          { symbol: StakingTokens.FOMO, address: FOMO_RESOURCE_ADDRESS },
          { symbol: StakingTokens.XUSDT, address: XUSDT_RESOURCE_ADDRESS },
        ],
        true
      );
      HITbalance = balances[StakingTokens.HIT];
      stHITbalance = balances[StakingTokens.StHIT];
      fomobalance = balances[StakingTokens.FOMO];
      xUSDTbalance = balances[StakingTokens.XUSDT];
      isOwner = isOwnerFound;
    } catch (error) {
      console.log("error in fetchBalances", error);
    }
  }
  store.dispatch(setNodeStakeNFTid(nftId));
  store.dispatch(setHitBalance(HITbalance));
  store.dispatch(setStHitBalance(stHITbalance));
  store.dispatch(setFomoBalance(fomobalance));
  store.dispatch(setxusdtBalance(xUSDTbalance));
  store.dispatch(setIsOwner(isOwner));
};

const fetchAllFungibles = async (walletAddress: string) => {
  let allFungibleItems: FungibleResourcesCollectionItem[] = [];
  let nextCursor = undefined;
  let response: StateEntityFungiblesPageResponse;
  let state_version: number | undefined = undefined;
  do {
    response = await CachedService.gatewayApi.state.innerClient.entityFungiblesPage({
      stateEntityFungiblesPageRequest: {
        address: walletAddress,
        cursor: nextCursor,
        aggregation_level: "Global",
        at_ledger_state: state_version ? { state_version } : undefined,
      },
    });

    allFungibleItems = allFungibleItems.concat(response.items);
    nextCursor = response.next_cursor;
    state_version = response.ledger_state.state_version;
  } while (nextCursor);
  return allFungibleItems;
};

const fetchAllNonFungibles = async (walletAddress: string) => {
  let allNonFungibleItems: NonFungibleResourcesCollectionItem[] = [];
  let nextCursor = undefined;
  let response: StateEntityNonFungiblesPageResponse;
  let state_version: number | undefined = undefined;
  do {
    response = await CachedService.gatewayApi.state.innerClient.entityNonFungiblesPage({
      stateEntityNonFungiblesPageRequest: {
        address: walletAddress,
        cursor: nextCursor,
        aggregation_level: "Vault",
        opt_ins: { non_fungible_include_nfids: true },
        at_ledger_state: state_version ? { state_version } : undefined,
      },
    });
    allNonFungibleItems = allNonFungibleItems.concat(response.items);
    nextCursor = response.next_cursor;
    state_version = response.ledger_state.state_version;
  } while (nextCursor);
  return allNonFungibleItems;
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
  let totalHITs = "0";
  let totalFOMOs = "0";
  let totalXUSDTs = "0";

  let assignedHITS = "0";
  let assignedFOMOs = "0";
  let assignedXUSDTs = "0";
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
        { symbol: StakingTokens.XUSDT, address: XUSDT_RESOURCE_ADDRESS },
      ]);
      totalHITs = balances[StakingTokens.HIT];
      totalFOMOs = balances[StakingTokens.FOMO];
      totalXUSDTs = balances[StakingTokens.XUSDT];
      response.data.items[0].details.state.fields[2].entries.forEach((entry: any) => {
        switch (entry.key.value) {
          case HIT_RESOURCE_ADDRESS:
            assignedHITS = entry.value.fields[1].value;
            break;
          case FOMO_RESOURCE_ADDRESS:
            assignedFOMOs = entry.value.fields[1].value;
            break;
          case XUSDT_RESOURCE_ADDRESS:
            assignedXUSDTs = entry.value.fields[1].value;
            break;
        }
      });
    }
  } catch (error) {
    console.log("error in fetchNodeStakingComponentDetails", error);
  }
  store.dispatch(setLockedNodeStakingHits(BN(totalHITs).minus(assignedHITS).toString()));
  store.dispatch(setLockedNodeStakingFomos(BN(totalFOMOs).minus(assignedFOMOs).toString()));
  store.dispatch(setLockedNodeStakingxUSDTs(BN(totalXUSDTs).minus(assignedXUSDTs).toString()));
  store.dispatch(setNodeStakingComponentDataLoading(false));
};

export const fetchClaimableNodeStakingRewards = async (nftId: number) => {
  const keyValueAddressesWithTheirTokens = [
    { address: NODE_STAKING_HIT_KEY_VALUE_STORE_ADDRESS, token: StakingTokens.HIT },
    { address: NODE_STAKING_FOMO_KEY_VALUE_STORE_ADDRESS, token: StakingTokens.FOMO },
    { address: NODE_STAKING_XUSDT_KEY_VALUE_STORE_ADDRESS, token: StakingTokens.XUSDT },
  ];

  let claimableRewards = {
    HIT: "0",
    FOMO: "0",
    xUSDT: "0",
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

export const fetchFelixWalletBalance = async () => {
  try {
    const [fungibleBalances, nonFungibleBalances] = await Promise.all([
      fetchAllFungibles(FELIX_WALLET_ADDRESS),
      fetchAllNonFungibles(FELIX_WALLET_ADDRESS),
    ]);

    let formattedFungibleBalances: FungibleBalances = {};
    fungibleBalances.forEach((balance) => {
      if (balance.aggregation_level === "Global") {
        const amount = balance.amount;
        const tokenAddress = balance.resource_address;
        if (+amount > 0) {
          formattedFungibleBalances[tokenAddress] = { tokenAddress, amount };
        }
      }
    });

    let formattedNonFungibleBalances: NonFungibleBalances = {};
    nonFungibleBalances.forEach((item) => {
      if (item.aggregation_level === "Vault") {
        const collectionAddress = item.resource_address;
        const ids = item.vaults.items[0].items;
        if (ids && ids.length > 0) {
          formattedNonFungibleBalances[collectionAddress] = { collectionAddress, ids };
        }
      }
    });

    dispatch(
      setFelixWallet({
        fungible: formattedFungibleBalances,
        nonFungible: formattedNonFungibleBalances,
      })
    );
    return true;
  } catch (error) {
    console.log("error in fetchFelixWalletBalance", error);
    return false;
  }
};
