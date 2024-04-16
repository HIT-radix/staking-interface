import { Subscription } from "rxjs";
import {
  DataRequestBuilder,
  RadixDappToolkit,
  RadixNetwork,
  WalletDataState,
} from "@radixdlt/radix-dapp-toolkit";
import { store } from "Store";
import { setWalletData } from "Store/Reducers/app";

export type RDT = ReturnType<typeof RadixDappToolkit>;

let rdtInstance: null | RDT = null;
export function getRdt() {
  return rdtInstance;
}
function setRdt(rdt: RDT) {
  rdtInstance = rdt;
}

let subs: Subscription[] = [];

export function initializeSubscriptions() {
  rdtInstance = RadixDappToolkit({
    dAppDefinitionAddress:
      "component_tdx_2_1cqkezyxf9ulzwu8hakr3g0r0yfmj9xr0rnjujyy28c03ephl4wjwwk",
    networkId: RadixNetwork.Stokenet,
    applicationName: "HIT Staking",
    applicationVersion: "1",
  });
  rdtInstance.walletApi.setRequestData(DataRequestBuilder.accounts().exactly(1));
  subs.push(
    rdtInstance.walletApi.walletData$.subscribe((walletData: WalletDataState) => {
      const data: WalletDataState = JSON.parse(JSON.stringify(walletData));
      console.log("data", data);
      store.dispatch(setWalletData(data));
    })
  );
  setRdt(rdtInstance);
  // TODO: "black" on the light theme
  rdtInstance.buttonApi.setTheme("white");
}

export function unsubscribeAll() {
  subs.forEach((sub) => {
    sub.unsubscribe();
  });
  subs = [];
}
