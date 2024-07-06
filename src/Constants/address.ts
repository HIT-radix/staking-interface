import { Environment } from "Types/misc";

export const HIT_RESOURCE_ADDRESS =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev
    ? "resource_tdx_2_1tk6j4zjzfuw28xvyfdc0ss8lytuq6qtw26f34rjfg4cw6agdq74x9q"
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

export const CONTRACT_OWNER_BADGE_ADDRESS =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev
    ? "resource_tdx_2_1t5qu33df9s8txu0tcszr8c7n92xn278jrkclzv3hupf78fx74ezt96"
    : "resource_rdx1th9a8045tkufp07carehayjcfy5juslp93kvels9wnly9dg8elah64";

export const NODE_STAKING_COMPONENT_ADDRESS =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev
    ? "component_tdx_2_1crf2uqm3tcqqdml0tqq04wurmqrhdkca7cscsuxr45lghhvv72zgnx"
    : "component_tdx_2_1crf2uqm3tcqqdml0tqq04wurmqrhdkca7cscsuxr45lghhvv72zgnx";

export const FOMO_RESOURCE_ADDRESS =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev
    ? "resource_tdx_2_1tknqxat0qc4ydc3k3z45mkree0p27nkp9eteeeurc6xlmlxj3pm5cv"
    : "resource_rdx1th9a8045tkufp07carehayjcfy5juslp93kvels9wnly9dg8elah64";

export const NODE_STAKING_CONTRACT_OWNER_BADGE_ADDRESS =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev
    ? "resource_tdx_2_1the5m83lln5y2qenaamf97g7a2qrys5tmj0ek4zsxznhcp5vehxldd"
    : "resource_tdx_2_1the5m83lln5y2qenaamf97g7a2qrys5tmj0ek4zsxznhcp5vehxldd";

export const NODE_STAKING_AIRDROPPER_BADGE_ADDRESS =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev
    ? "resource_tdx_2_1thg6t73wm0p38w4r8y7afxk3jrvqcyuryp9jk5r7pj4afgw38ul6dl"
    : "resource_tdx_2_1thg6t73wm0p38w4r8y7afxk3jrvqcyuryp9jk5r7pj4afgw38ul6dl";

export const NODE_STAKING_USER_BADGE_ADDRESS =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev
    ? "resource_tdx_2_1ngg9srqnvjctfrkmmq56h9gpc8seju2z0wm48qxc9pgvapsrpue2nn"
    : "resource_tdx_2_1ngg9srqnvjctfrkmmq56h9gpc8seju2z0wm48qxc9pgvapsrpue2nn";
