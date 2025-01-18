import { ReactNode } from "react";

import Footer from "./footer";
import DistributionModal from "Pages/Topup/Components/distributionModal";
import MobileDrawer from "./drawer";
import SnapshotModal from "Pages/Topup/Components/snapshotModal";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <MobileDrawer>
        {children}
        <DistributionModal />
        <SnapshotModal />
        <Footer />
      </MobileDrawer>
    </>
  );
};

export default MainLayout;
