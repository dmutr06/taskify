import { FC } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { CookiesProvider } from "react-cookie";

export const App: FC = () => {
  return (
    <CookiesProvider defaultSetOptions={{ sameSite: "none", secure: true }}>
      <RouterProvider router={router} />
    </CookiesProvider>
  );
};

export default App;
