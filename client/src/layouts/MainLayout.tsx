import { FC } from "react";

export const MainLayout: FC<{ children: React.ReactElement | React.ReactElement[] }> = ({ children }) => {
    return (
        <div className="layout container">
            <main>{children}</main>
        </div>
    );
};

export default MainLayout;
