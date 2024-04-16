import { NavigateFunction } from "react-router";

class Cache {
  navigation: NavigateFunction = () => {};
}

const CachedService = new Cache();

export default CachedService;
