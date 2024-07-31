import { ReactNode } from "react";

import Header from "./header";
import Footer from "./footer";
import MobileNavbar from "./mobileNavbar";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      <MobileNavbar />
      {children}
      <Footer />
    </>
  );
};

export default MainLayout;
