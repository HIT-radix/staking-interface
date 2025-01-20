import { ReactNode } from "react";

import Footer from "./footer";
import DistributionModal from "Pages/Topup/Components/distributionModal";
import MobileDrawer from "./drawer";
import SnapshotModal from "Pages/Topup/Components/snapshotModal";
import SnapshotDetailModal from "Pages/Topup/Components/snapshotDetailModal";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <MobileDrawer>
        {children}
        <DistributionModal />
        <SnapshotModal />
        <SnapshotDetailModal />
        <Footer />
      </MobileDrawer>
    </>
  );
};

export default MainLayout;
