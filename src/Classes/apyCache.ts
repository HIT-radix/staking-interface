import localforage from "localforage";

import { store } from "../Store";
import { AttosStrategyData, AttosStrategyId } from "Types/api";
import axios from "axios";
import { setApyFetching } from "Store/Reducers/loadings";
import { ATTO_BASE_URL } from "Constants/endpoints";
import { setLastAPYsUpdated } from "Store/Reducers/app";

class APYCache {
  allAPYs: Record<string, number> = {};

  loadAPYs = async () => {
    store.dispatch(setApyFetching(true));
    const allAPYs = await this.getAPYs();
    if (allAPYs) {
      this.allAPYs = allAPYs;
    }
    store.dispatch(setApyFetching(false));
  };

  getAPYs = async () => {
    try {
      return (await localforage.getItem("positions-apys")) as Record<string, number>;
    } catch (error) {
      console.error("Error fetching position-apys from localforage:", error);
      return null;
    }
  };

  setAPYs = async (allAPYs: Record<string, number>) => {
    try {
      await localforage.setItem("positions-apys", allAPYs);
      store.dispatch(setLastAPYsUpdated(Date.now()));
    } catch (error) {
      console.error("Error storing position-apys:", error);
      return null;
    }
  };

  fetchAllAPYs = async () => {
    store.dispatch(setApyFetching(true));
    const strategies = await this.fetchAttosStrategies(ATTO_BASE_URL + "/strategies");
    const apyObj = this.extractAPYsFromStrategies(strategies);
    await this.setAPYs(apyObj);
    this.allAPYs = apyObj;
    store.dispatch(setApyFetching(false));
  };

  extractAPYsFromStrategies = (strategies: AttosStrategyData[]) => {
    const apyObj: Record<string, number> = {};
    const validKeys = new Set(Object.values(AttosStrategyId));
    strategies.forEach((strategy) => {
      const key =
        `${strategy.symbol}_${strategy.provider}_${strategy.strategy_type}` as AttosStrategyId;
      if (validKeys.has(key)) {
        apyObj[key] = +strategy.bonus_value;
      }
    });
    return apyObj;
  };

  async fetchAttosStrategies(endpoint: string): Promise<AttosStrategyData[]> {
    try {
      const response = await axios.get<AttosStrategyData[]>(endpoint);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch Attos strategies:", error);
      return [];
    }
  }
}

const ApyCacheService = new APYCache();

export default ApyCacheService;
