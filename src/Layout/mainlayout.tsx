import { ReactNode } from "react";

import Footer from "./footer";
import DistributionModal from "Pages/Topup/Components/distributionModal";
import MobileDrawer from "./drawer";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <MobileDrawer>
        {children}
        <DistributionModal />
        <Footer />
      </MobileDrawer>
    </>
  );
};

export default MainLayout;
