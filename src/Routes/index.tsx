import { lazy } from "react";
import { useNavigate, useRoutes, Navigate } from "react-router-dom";

import MainLayout from "Layout/mainlayout";
import CachedService from "Classes/cachedService";

// const Home = lazy(() => import("Pages/Home"));
const Stake = lazy(() => import("Pages/Stake"));
const Topup = lazy(() => import("Pages/Topup"));

export default function Routes() {
  const navigate = useNavigate();
  CachedService.navigation = navigate;

  return useRoutes([
    {
      path: "/",
      element: (
        <MainLayout>
          <Stake />
        </MainLayout>
      ),
    },
    {
      path: "/top-up-hit",
      element: (
        <MainLayout>
          <Topup />
        </MainLayout>
      ),
    },
    // {
    //   path: "/staking",
    //   element: (
    //     <MainLayout>
    //       <Home />
    //     </MainLayout>
    //   ),
    // },
    { path: "*", element: <Navigate to={"/"} replace={true} /> },
  ]);
}
