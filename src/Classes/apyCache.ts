import localforage from "localforage";

import { store } from "../Store";
import { AttosStrategyData, StrategyId, SurgeStatsResponse } from "Types/api";
import axios from "axios";
import { setApyFetching } from "Store/Reducers/loadings";
import { ATTO_BASE_URL, SURGE_BASE_URL } from "Constants/endpoints";
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
    const [attosStrategies, surgeApy] = await Promise.all([
      this.fetchAttosStrategies(),
      this.fetchSurgeApy(),
    ]);
    const attosApys = this.extractAPYsFromStrategies(attosStrategies);
    const allAPYs = { ...attosApys, ...surgeApy };
    await this.setAPYs(allAPYs);
    this.allAPYs = allAPYs;
    store.dispatch(setApyFetching(false));
  };

  extractAPYsFromStrategies = (strategies: AttosStrategyData[]) => {
    const apyObj: Record<string, number> = {};
    const validKeys = new Set(Object.values(StrategyId));
    strategies.forEach((strategy) => {
      const key = `${strategy.symbol}_${strategy.provider}_${strategy.strategy_type}` as StrategyId;
      if (validKeys.has(key)) {
        apyObj[key] = +strategy.bonus_value;
      }
    });
    return apyObj;
  };

  async fetchAttosStrategies(): Promise<AttosStrategyData[]> {
    try {
      const response = await axios.get<AttosStrategyData[]>(ATTO_BASE_URL + "/strategies");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch Attos strategies:", error);
      return [];
    }
  }

  async fetchSurgeApy(): Promise<Record<string, number>> {
    try {
      const response = await axios.get<SurgeStatsResponse>(SURGE_BASE_URL + "/stats");
      if (response.status !== 200) {
        return {};
      }
      const res = response.data;
      const apy = (res.apy.value * 100).toFixed(2);
      return { [StrategyId.xUSDC_Surge_Trade_Liquidation]: +apy };
    } catch (error) {
      console.error("Failed to fetch surge apy:", error);
      return {};
    }
  }
}

const ApyCacheService = new APYCache();

export default ApyCacheService;
