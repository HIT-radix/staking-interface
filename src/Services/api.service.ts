import axios, { AxiosError } from "axios";
import { ATTO_BASE_URL, SURGE_BASE_URL, C9_BASE_URL } from "Constants/endpoints";
import { AttosPoolData, AttosStrategyData, SurgeStatsResponse, C9PoolData } from "Types/api";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

class APIService {
  private async retryableRequest<T>(request: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
    try {
      return await request();
    } catch (error) {
      if (retries > 0 && error instanceof AxiosError) {
        console.warn(`Request failed, retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        return this.retryableRequest(request, retries - 1);
      }
      throw error;
    }
  }

  async getAttosStrategies(): Promise<AttosStrategyData[]> {
    try {
      const response = await this.retryableRequest(() =>
        axios.get<AttosStrategyData[]>(`${ATTO_BASE_URL}/v2/strategies`)
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch Attos strategies:", error);
      return [];
    }
  }

  async getSurgeStats(): Promise<SurgeStatsResponse | null> {
    try {
      const response = await this.retryableRequest(() =>
        axios.get<SurgeStatsResponse>(`${SURGE_BASE_URL}/stats`)
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch surge stats:", error);
      return null;
    }
  }

  async getAttosPools(): Promise<AttosPoolData[]> {
    try {
      const response = await this.retryableRequest(() =>
        axios.get<AttosPoolData[]>(`${ATTO_BASE_URL}/pools`)
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch Attos pools:", error);
      return [];
    }
  }

  async fetchC9pools(componentAddresses: string[]): Promise<C9PoolData[]> {
    try {
      const requests = componentAddresses.map((address) =>
        this.retryableRequest(() =>
          axios.get<C9PoolData>(`${C9_BASE_URL}/shapeliquidity/${address}`)
        )
          .then((response) => response.data)
          .catch((error) => {
            console.error(`Failed to fetch C9 pool details for component ${address}:`, error);
            return null;
          })
      );
      const results = await Promise.all(requests);
      // Filter out any null results due to failed requests
      return results.filter((data): data is C9PoolData => data !== null);
    } catch (error) {
      console.error("Failed to fetch C9 pools details:", error);
      return [];
    }
  }
}

export const apiService = new APIService();
