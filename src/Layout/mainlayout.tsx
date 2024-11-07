import { ReactNode } from "react";

import Header from "./header";
import Footer from "./footer";
import MobileNavbar from "./mobileNavbar";
import DistributionModal from "Pages/Topup/Components/distributionModal";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      <MobileNavbar />
      {children}
      <DistributionModal />
      <Footer />
    </>
  );
};

export default MainLayout;
