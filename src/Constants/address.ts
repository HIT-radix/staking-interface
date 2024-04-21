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
    ? "component_tdx_2_1cqkezyxf9ulzwu8hakr3g0r0yfmj9xr0rnjujyy28c03ephl4wjwwk"
    : "component_rdx1cpxtp5lj8mgje460kdvjytjvlgysgdeqwn54h3kf05qjems2g29f8v";

export const DAPP_DEFINITION_ADDRESS =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev
    ? "account_tdx_2_129zymzhffm45w5jyccyu9x0tv5xs7qs76zxzrfsd7gn76f7k5reus2"
    : "account_rdx128er8y5hetcj98krndumys93jyerq659ug0uyk6l6ljdtd9mrcevwf";

export const POOL_ADDRESS =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev
    ? "pool_tdx_2_1c3tt7jlhpycq6crjgmpcsqrur44u7hry97v20nvsw3fx5hsj52hcej"
    : "pool_rdx1cnv7v2rar2w2r4fa65tnrul09kphsp9f0xaq0c06c7ds4u2syga8ly";

// export const LIQUIDITY_POOL_ADDRESS = new PublicKey("C6Fk5DceKtzNPk9LbE5wS6nodwogp5TvqRaiUUGLDaHB");
