import { ReactNode } from "react";

import Footer from "./footer";
import DistributionModal from "Pages/Topup/Components/distributionModal";
import MobileDrawer from "./drawer";
import SnapshotModal from "Pages/Topup/Components/snapshotModal";
import SnapshotDetailModal from "Pages/Topup/Components/snapshotDetailModal";
import BuybackAirdropModal from "Pages/Topup/Components/buybackAirdropModal";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <MobileDrawer>
        {children}
        <DistributionModal />
        <BuybackAirdropModal />
        <SnapshotModal />
        <SnapshotDetailModal />
        <Footer />
      </MobileDrawer>
    </>
  );
};

export default MainLayout;
