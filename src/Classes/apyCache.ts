import localforage from "localforage";
import { store } from "../Store";
import {
  AttosPoolData,
  AttosStrategyData,
  C9PoolData,
  StrategyId,
  SurgeStatsResponse,
} from "Types/api";
import { setApyFetching } from "Store/Reducers/loadings";
import { setLastAPYsUpdated } from "Store/Reducers/app";
import { apiService } from "Services/api.service";

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

  private extractAPYsFromStrategies = (strategies: AttosStrategyData[]): Record<string, number> => {
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

  private extractAPYsFromAttosPools = (pools: AttosPoolData[]): Record<string, number> => {
    const apyObj: Record<string, number> = {};
    const validKeys = new Set(Object.values(StrategyId));

    pools.forEach((pool) => {
      const key = `${pool.left_alt}_${pool.right_alt}_${pool.type}_pool` as StrategyId;
      if (validKeys.has(key)) {
        apyObj[key] = +pool.bonus_7d;
      }
    });

    return apyObj;
  };

  private extractSurgeApy = (stats: SurgeStatsResponse | null): Record<string, number> => {
    if (!stats) return {};

    const apy = (stats.apy.value * 100).toFixed(2);
    return { [StrategyId.xUSDC_Surge_Trade_Liquidation]: +apy };
  };

  private extractAPYsFromC9Pools = (pools: C9PoolData[]): Record<string, number> => {
    const apyObj: Record<string, number> = {};
    const validKeys = new Set(Object.values(StrategyId));

    pools.forEach((pool) => {
      const key = `${pool.token_x_symbol}_${pool.token_y_symbol}_caviarnine_pool` as StrategyId;
      if (validKeys.has(key)) {
        apyObj[key] = Number((+pool.apy_perc * 100).toFixed(2));
      }
    });

    return apyObj;
  };

  fetchAllAPYs = async () => {
    try {
      store.dispatch(setApyFetching(true));

      // Fetch all data in parallel
      const [attosStrategies, surgeStats, attosPools, c9Pools] = await Promise.all([
        apiService.getAttosStrategies(),
        apiService.getSurgeStats(),
        apiService.getAttosPools(),
        apiService.fetchC9pools([
          "component_rdx1cqmx9aqpr36anp960xes8f4wp7skc6pya6k9ra2jtlmlv24qslmwxf", // fUSD/xUSDC pool component
        ]),
      ]);

      // Process all data
      const allAPYs = {
        ...this.extractAPYsFromStrategies(attosStrategies),
        ...this.extractSurgeApy(surgeStats),
        ...this.extractAPYsFromAttosPools(attosPools),
        ...this.extractAPYsFromC9Pools(c9Pools),
      };

      // Update cache and state
      await this.setAPYs(allAPYs);
      this.allAPYs = allAPYs;
    } catch (error) {
      console.error("Failed to fetch APYs:", error);
    } finally {
      store.dispatch(setApyFetching(false));
    }
  };
}

const ApyCacheService = new APYCache();

export default ApyCacheService;
