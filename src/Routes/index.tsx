import { lazy, useEffect } from "react";
import { useNavigate, useRoutes, Navigate } from "react-router-dom";

// import CachedService from "../Classes/cachedService";
import MainLayout from "Layout/mainlayout";
import CachedService from "Classes/cachedService";
import { fetchPoolDetails, fetchHITdata, fetchStHITTotalSupply } from "Utils/fetchers";
import { dispatch, useSelector } from "Store";
import { setTokenDataLoading } from "Store/Reducers/loadings";

const Home = lazy(() => import("Pages/Home"));
const Stake = lazy(() => import("Pages/Stake"));

export default function Routes() {
  const navigate = useNavigate();
  CachedService.navigation = navigate;

  const successTxCount = useSelector((state) => state.session.successTxCount);

  useEffect(() => {
    (async () => {
      dispatch(setTokenDataLoading(true));
      fetchHITdata();
      dispatch(setTokenDataLoading(false));
    })();
  }, []);

  useEffect(() => {
    (async () => {
      fetchPoolDetails();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      fetchStHITTotalSupply();
    })();
  }, [successTxCount]);

  return useRoutes([
    {
      path: "/",
      element: (
        <MainLayout>
          <Home />
        </MainLayout>
      ),
    },
    {
      path: "/staking",
      element: (
        <MainLayout>
          <Stake />
        </MainLayout>
      ),
    },
    { path: "*", element: <Navigate to={"/"} replace={true} /> },
  ]);
}
