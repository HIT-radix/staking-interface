import { ReactNode } from "react";

import Header from "./header";
import Footer from "./footer";
import SnappableDraggable from "Components/draggable";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <SnappableDraggable />
      {<Header />}
      {children}
      <Footer />
    </>
  );
};

export default MainLayout;
