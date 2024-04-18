import { Environment } from "Types/misc";

export const HIT_RESOURCE_ADDRESS =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev
    ? "MESHwqmXvAmKpDYSgRZkm9D5H8xYSCVixeyZoePHn4G"
    : "MESHwqmXvAmKpDYSgRZkm9D5H8xYSCVixeyZoePHn4G";

export const STHIT_RESOURCE_ADDRESS =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev
    ? "iMESHdxK4fgZLU3FDTsT4tYatHXBbodQVParussnFMy"
    : "iMESHdxK4fgZLU3FDTsT4tYatHXBbodQVParussnFMy";

export const STAKING_COMPONENT_ADDRESS =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev
    ? "HcgqAqH5MwpTACy2PXA91ecu98hr1Ewt7YAf5mHeT7zY"
    : "pn2DE57M7smCc98A71DMV4jMQ7NdL7cs7azn9iPgN97";

// export const LIQUIDITY_POOL_ADDRESS = new PublicKey("C6Fk5DceKtzNPk9LbE5wS6nodwogp5TvqRaiUUGLDaHB");
