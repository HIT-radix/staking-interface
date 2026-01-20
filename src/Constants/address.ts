import { Environment } from "Types/misc";

export const HIT_RESOURCE_ADDRESS =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev
    ? "resource_tdx_2_1tk6j4zjzfuw28xvyfdc0ss8lytuq6qtw26f34rjfg4cw6agdq74x9q"
    : "resource_rdx1t4v2jke9xkcrqra9sf3lzgpxwdr590npkt03vufty4pwuu205q03az";

export const STHIT_RESOURCE_ADDRESS =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev
    ? "resource_tdx_2_1th3frqxwmg4hqej6ae5p8lfe5x5lm7nvdf3gpxa7xfdtq89knqzpft"
    : "resource_rdx1thhxseekkanlykgpa5zxz77g2slpv462stkl3hcx4pytjcupd0qj5f";

export const FOMO_RESOURCE_ADDRESS =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev
    ? "resource_tdx_2_1tknqxat0qc4ydc3k3z45mkree0p27nkp9eteeeurc6xlmlxj3pm5cv"
    : "resource_rdx1t5l954908vmg465pkj7j37z0fn4j33cdjt2g6czavjde406y4uxdy9";

export const OLD_FOMO_RESOURCE_ADDRESS =
  "resource_rdx1t4a42s786rs0nz6lv3skg2kvk94alxrpd5v73q9e7jrt33fsalcg0m";

export const XUSDT_RESOURCE_ADDRESS =
  "resource_rdx1thrvr3xfs2tarm2dl9emvs26vjqxu6mqvfgvqjne940jv0lnrrg7rw";

export const RUG_PROOF_STAKING_COMPONENT_ADDRESS =
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

export const RUG_PROOF_STAKING_OWNER_BADGE_ADDRESS =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev
    ? "resource_tdx_2_1t5qu33df9s8txu0tcszr8c7n92xn278jrkclzv3hupf78fx74ezt96"
    : "resource_rdx1th9a8045tkufp07carehayjcfy5juslp93kvels9wnly9dg8elah64";

export const NODE_STAKING_COMPONENT_ADDRESS =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev
    ? "component_tdx_2_1crf2uqm3tcqqdml0tqq04wurmqrhdkca7cscsuxr45lghhvv72zgnx"
    : "component_rdx1cqpv4nfsgfk9c2r9ymnqyksfkjsg07mfc49m9qw3dpgzrmjmsuuquv";

export const NODE_STAKING_OWNER_BADGE_ADDRESS =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev
    ? "resource_tdx_2_1the5m83lln5y2qenaamf97g7a2qrys5tmj0ek4zsxznhcp5vehxldd"
    : "resource_rdx1t4r3uflc6gnf3sfln640q4j6fa4l80q6rs86g700l0cerq6avmrzc5";

export const NODE_STAKING_AIRDROPPER_BADGE_ADDRESS =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev
    ? "resource_tdx_2_1thg6t73wm0p38w4r8y7afxk3jrvqcyuryp9jk5r7pj4afgw38ul6dl"
    : "resource_rdx1thtmjr4rw5kn2yryzf3qnre6vrynzk8nxk7ssvmcuk0dhru2l90jk0";

export const NODE_STAKING_USER_BADGE_ADDRESS =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev
    ? "resource_tdx_2_1ngg9srqnvjctfrkmmq56h9gpc8seju2z0wm48qxc9pgvapsrpue2nn"
    : "resource_rdx1ntmkq3eddym9lzppx8sg2elpqwexhsppcdscwu5s7ca5u79hcaztu3";

export const NODE_VALIDATOR_ADDRESS =
  "validator_rdx1swez5cqmw4d6tls0mcldehnfhpxge0mq7cmnypnjz909apqqjgx6n9";

export const NODE_LSU_ADDRESS =
  "resource_rdx1t4d3ka2x2j35e30gh75j6hma6fccwdsft88h2v2ul4qmqshnwjmxf7";

export const NODE_STAKING_HIT_KEY_VALUE_STORE_ADDRESS =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev
    ? "internal_keyvaluestore_tdx_2_1kqv4x2fctjx2esglff4t85gx033ruyaxyh2ct72k2d7q2l7899am5g"
    : "internal_keyvaluestore_rdx1krxnad7sk0dsz2f5j27lxgq74uvwq0h5xyzd2rwvhs0xy5td6zf583";

export const NODE_STAKING_XUSDT_KEY_VALUE_STORE_ADDRESS =
  "internal_keyvaluestore_rdx1kp9qyednfzecfxnpz2f8pmlllhehzsytexwc3p8z5xdg966afewhye";

export const NODE_STAKING_XUSDC_KEY_VALUE_STORE_ADDRESS =
  "internal_keyvaluestore_rdx1kpgllfccyumfjs4l6k97seux56csehvt8u7geqnqtm3f7g6kuzn7aj";

export const NODE_STAKING_REDDICKS_KEY_VALUE_STORE_ADDRESS =
  "internal_keyvaluestore_rdx1kzf0t4fwp6wzxndtw0q6qkwrt5hrsquemtpd0nvp8gajms89caf3vm";

export const NODE_STAKING_FOMO_KEY_VALUE_STORE_ADDRESS =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev
    ? "internal_keyvaluestore_tdx_2_1kzlxcs94slutg6raf9gc9kde7xyv7zd2dkqfkx0p2n80uhl88esah5"
    : "internal_keyvaluestore_rdx1kz354c7kuzqjz9fmp0qvn7gulha678edjw5u02tugvt0tejepnzmu9";

export const OLD_NODE_STAKING_FOMO_KEY_VALUE_STORE_ADDRESS =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev
    ? "internal_keyvaluestore_tdx_2_1kzlxcs94slutg6raf9gc9kde7xyv7zd2dkqfkx0p2n80uhl88esah5"
    : "internal_keyvaluestore_rdx1kqc5uy3gu2j6v9sdjrz72n0axlmldvkqu24evdyqdjrh23xqd0demj";

export const NODE_CURRENTLY_EARNED_LSU_VAULT_ADDRESS =
  "internal_vault_rdx1trjet2x0609mecejd3yruksu28g8sqz4rgza4785mv4fha0d2exyp8";

export const NODE_OWNER_UNLOCKING_LSU_VAULT_ADDRESS =
  "internal_vault_rdx1tqejzx2nshr8c9s4hvjwkxf8whutrv2cwzn79z2th5mepfhyfxrrne";

export const NODE_TOTAL_STAKED_XRD_VAULT_ADDRESS =
  "internal_vault_rdx1tzxln4dwz2rj8dd9qsaha5fx5ujc8l2l4rgcmruuuqmmyfegp7h099";

export const NODE_UNSTAKING_XRD_VAULT_ADDRESS =
  "internal_vault_rdx1tzukc8dxghnlq8gw686s0vc86ss88978lde48ef0ars2c2lmh387pt";

export const FELIX_WALLET_ADDRESS =
  "account_rdx129yg7ugqe9hulflzu0uf22sx9h5d5qrcg3v2599zl8sjwh4fawdygj";

export const XUSDC_RESOURCE_ADDRESS =
  "resource_rdx1t4upr78guuapv5ept7d7ptekk9mqhy605zgms33mcszen8l9fac8vf";

export const REDDICKS_RESOURCE_ADDRESS =
  "resource_rdx1t42hpqvsk4t42l6aw09hwphd2axvetp6gvas9ztue0p30f4hzdwxrp";

export const WEFT_W2_xUSDT_RESOURCE_ADDRESS =
  "resource_rdx1t5ljp8amkf76mrn5txmmemkrmjwt5r0ajjnljvyunh27gm0n295dfn";

export const WEFT_W2_xUSDC_RESOURCE_ADDRESS =
  "resource_rdx1thw2u4uss739j8cqumehgf5wyw26chcfu98newsu42zhln7wd050ee";

export const WEFT_W2_hUSDC_RESOURCE_ADDRESS =
  "resource_rdx1t4kxe9n00hgzng02myj6a320qxcma2umxj8ygr795cc5m0hsj3p4l2";

export const WEFT_KEY_VALUE_STORE_ADDRESS =
  "internal_keyvaluestore_rdx1kzjr763caq96j0kv883vy8gnf3jvrrp7dfm9zr5n0akryvzsxvyujc";

export const STAB_XUSDC_LIQUIDITY_RECEIPT =
  "resource_rdx1ngt09n8lg292hnzwvz5j6hl0aexja9ggh84qyam3xk3vcala72c2um";

export const FUSD_XUSDC_LIQUIDITY_RECEIPT_C9 =
  "resource_rdx1ng2m9cn34czt73x0zjjxhzrpddt5kr6juyfyxrk4uc4gudhy2nkyxy";

export const SURGE_EXCHANGE_COMPONENT =
  "component_rdx1cqrfmpkp96hvlykahmhmu2w48kk2w7w35396vkrze9jwufxtvdzlkk";

export const SURGE_SLP_TOKEN =
  "resource_rdx1t48x0z68dm6z422wxyctj5wvnt2nh95lvmly65vxzywdkd24zypl5d";

export const ROOT_xUSDT_POOL_ADDRESS =
  "component_rdx1cqz0f5znwhyy2d4q2rhncetm5tfpvu2c73kvfertktkw33drxcawk8";

export const ROOT_xUSDC_POOL_ADDRESS =
  "component_rdx1cqlfmwmhdmp0ln4gaera4skn3yz30p4k5ssv7lqflgh0rjeakwzs9f";

export const ROOT_CDP_NFT_ADDRESS =
  "resource_rdx1ngekvyag42r0xkhy2ds08fcl7f2ncgc0g74yg6wpeeyc4vtj03sa9f";

export const STAB_RESOURCE_ADDRESS =
  "resource_rdx1t40lchq8k38eu4ztgve5svdpt0uxqmkvpy4a2ghnjcxjtdxttj9uam";

export const FUSD_RESOURCE_ADDRESS =
  "resource_rdx1t49wa75gve8ehvejr760g3pgvkawsgsgq0u3kh7vevzk0g0cnsmscq";

export const LSULP_RESOURCE_ADDRESS =
  "resource_rdx1thksg5ng70g9mmy9ne7wz0sc7auzrrwy7fmgcxzel2gvp8pj0xxfmf";

export const XRD_RESOURCE_ADDRESS =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev
    ? "resource_tdx_2_1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxtfd2jc"
    : "resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd";

export const FOMO_COMPONENT_ADDRESS =
  "component_rdx1cr6lel0w3ktv0hww999uqpce5r2uzy24l5083dpg57n8xg66cerkcx";

export const hUSDC_RESOURCE_ADDRESS =
  "resource_rdx1thxj9m87sn5cc9ehgp9qxp6vzeqxtce90xm5cp33373tclyp4et4gv";

export const MORPHER_ORACLE_NFT_RESOURCE_ADDRESS =
  process.env.ENVIRONMENT === "dev"
    ? "resource_tdx_2_1nt8kpf7m6g9l0p6w6yu4jd0pc4vac564s8f20qmzf782r90fmrgrpt"
    : "resource_rdx1nfeeyrpqdkrcjmng09tdrtr6cpknlz0qadra0p3wc3ffg7p6w848gd";

export const MORPHER_ORACLE_NFT_ID =
  process.env.ENVIRONMENT === "dev"
    ? "{cfd5d86c9d43b11e-78622846f264c0a0-e5256cd3fdb3a1e4-1e648e9bb24ca5de}"
    : "{8408f20781d53d44-cb2d523270f04cd7-a7e51cdf58953534-34fd63bc2e806aa4}";

export const HEDGE_FUND_UNIT_RESOURCE_ADDRESS =
  process.env.ENVIRONMENT === "dev"
    ? "resource_tdx_2_1t4ny2slhdk7dgshdaxggs3efddfp8j3uf838km74fcys9f8lwttd3n"
    : "resource_rdx1th38dkeamzmlhvv264tjk54gtvd2yn3x26kpa6c5ukspmyqd8rtgru";

export const FUND_MANAGER_COMPONENT_ADDRESS =
  process.env.ENVIRONMENT === "dev"
    ? "component_tdx_2_1cpdhxgf8nmvzczs9ttvaf3307lq8m4wdky66rpn4zy5qdaat0av5sg"
    : "component_rdx1cpd5eajj0rq9dcwuymdhjhcrn2k62xgn07msfj2xhk3rn8mn2gcuut";

export const HEDGE_FUND_BOT_ADDRESS =
  process.env.ENVIRONMENT === "dev"
    ? "account_tdx_2_129y9wu3vugaeasnprxjlrqy3tpmr7hpurrmapmyqhsr26ehhrh22e2"
    : "account_rdx129puw6c9lhw9f5wceaeumj97lmaryzc8z2sdzk76z99ackqhc7f7yg";
