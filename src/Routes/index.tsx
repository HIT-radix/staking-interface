import { lazy } from "react";
import { useRoutes, Navigate } from "react-router-dom";

// import CachedService from "../Classes/cachedService";
import MainLayout from "Layout/mainlayout";

const Home = lazy(() => import("Pages/Home"));
const Stake = lazy(() => import("Pages/Stake"));

export default function Routes() {
  // const navigate = useNavigate();
  // CachedService.navigation = navigate;

  return useRoutes([
    // { index: true, element: <Navigate to={"/staking"} replace={true} /> },
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
