import { FC } from "react";

import styles from "./header.module.scss";

const Header: FC = () => {
  
  return (
    <header className={styles.header}>
      <div className="container">
        Taskify
      </div>
    </header>
  );
};

export default Header;
