import { FC } from "react";
import Header from "../components/Header/Header";


export const MainLayout: FC<{ children: React.ReactElement | React.ReactElement[] }> = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;
