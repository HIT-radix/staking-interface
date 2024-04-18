import { Environment } from "Types/misc";

export const HIT_RESOURCE_ADDRESS =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev
    ? "resource_tdx_2_1tkqy8pcuusaf8zl8dm4hlafmx3sqyq3we3rglzt06em3mlr63hvyxa"
    : "resource_rdx1t4v2jke9xkcrqra9sf3lzgpxwdr590npkt03vufty4pwuu205q03az";

export const STHIT_RESOURCE_ADDRESS =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev
    ? "resource_tdx_2_1th3frqxwmg4hqej6ae5p8lfe5x5lm7nvdf3gpxa7xfdtq89knqzpft"
    : "resource_rdx1thhxseekkanlykgpa5zxz77g2slpv462stkl3hcx4pytjcupd0qj5f";

export const STAKING_COMPONENT_ADDRESS =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev
    ? "HcgqAqH5MwpTACy2PXA91ecu98hr1Ewt7YAf5mHeT7zY"
    : "pn2DE57M7smCc98A71DMV4jMQ7NdL7cs7azn9iPgN97";

export const DAPP_DEFINITION_ADDRESS =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev
    ? "account_tdx_2_129zymzhffm45w5jyccyu9x0tv5xs7qs76zxzrfsd7gn76f7k5reus2"
    : "account_rdx128er8y5hetcj98krndumys93jyerq659ug0uyk6l6ljdtd9mrcevwf";

// export const LIQUIDITY_POOL_ADDRESS = new PublicKey("C6Fk5DceKtzNPk9LbE5wS6nodwogp5TvqRaiUUGLDaHB");
