import { useMemo } from "react";
import { ToastContainer } from "react-toastify";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Routes from "./Routes";

function App() {
  const router = useMemo(
    () =>
      createBrowserRouter([
        {
          path: "/*",
          element: <Routes />,
          errorElement: <></>,
        },
      ]),
    []
  );
  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
