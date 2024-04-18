import { store } from "Store";
import { Tabs } from "Types/reducers";

export const fetchBalance = async () => {
  //   let balance = "0";
  //   try {
  //     const tokenRes = await connection.getParsedTokenAccountsByOwner(walletPubKey as PublicKey, {
  //       mint: token === StakingTokens.mesh ? MESH_MINT_ADDRESS : INDEXMESH_MINT_ADDRESS,
  //     });
  //     const parseInfo = tokenRes.value[0].account.data.parsed as ParsedTokenInfo | undefined;
  //     if (parseInfo) {
  //       balance = parseInfo.info.tokenAmount.uiAmountString;
  //     }
  //   } catch (error) {
  //     console.log("Unable to fetch Mesh Balance");
  //   }
  //   store.dispatch(
  //     token === StakingTokens.mesh ? setMeshBalance(balance) : setIndexMeshBalance(balance)
  //   );
};

export const getSelectedBalance = () => {
  const state = store.getState();
  const {
    staking: { currentTab, stHitBalance },
    app: { hitBalance },
  } = state;
  return Number(currentTab === Tabs.stake ? hitBalance : stHitBalance);
};
