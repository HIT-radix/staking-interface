import { lazy } from "react";
import { useNavigate, useRoutes, Navigate } from "react-router-dom";

import MainLayout from "Layout/mainlayout";
import CachedService from "Classes/cachedService";

// const Home = lazy(() => import("Pages/Home"));
const Stake = lazy(() => import("Pages/Stake"));
const Topup = lazy(() => import("Pages/Topup"));
const NodeStaking = lazy(() => import("Pages/NodeStaking"));
const InvestmentFunds = lazy(() => import("Pages/InvestmentFunds"));

export default function Routes() {
  const navigate = useNavigate();
  CachedService.navigation = navigate;

  return useRoutes([
    {
      path: "/",
      element: (
        <MainLayout>
          <InvestmentFunds />
        </MainLayout>
      ),
    },
    {
      path: "/hit-staking",
      element: (
        <MainLayout>
          <Stake />
        </MainLayout>
      ),
    },
    {
      path: "/admin",
      element: (
        <MainLayout>
          <Topup />
        </MainLayout>
      ),
    },
    {
      path: "/node-staking",
      element: (
        <MainLayout>
          <NodeStaking />
        </MainLayout>
      ),
    },
    {
      path: "/fund",
      element: (
        <MainLayout>
          <InvestmentFunds />
        </MainLayout>
      ),
    },
    { path: "*", element: <Navigate to={"/"} replace={true} /> },
  ]);
}
