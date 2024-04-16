import { lazy } from "react";
import { useNavigate, useRoutes, Navigate } from "react-router-dom";

// import CachedService from "../Classes/cachedService";
import MainLayout from "Layout/mainlayout";
import CachedService from "Classes/cachedService";

const Home = lazy(() => import("Pages/Home"));
const Stake = lazy(() => import("Pages/Stake"));

export default function Routes() {
  const navigate = useNavigate();
  CachedService.navigation = navigate;

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
