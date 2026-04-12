
import SSidebar from "../Sidebar/Ssidebar";
import { type FC, useState } from "react";
import styles from "./SDashboard.module.css";
import Header from "../../../components/Header/Header";


const SDashboard: FC = () => {
  const [collapsed, setCollapsed] = useState(false); // ✅ moved here

  return (
  <div className={styles.container}>
    
    <SSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

    <div className={styles.main}>
      <Header
        title="Dashboard"
        subtitle="Welcome back, Muhammad Kamran"
        userName="Junaid Hussain"
        userId="CO2024001"
      />

      <div className={styles.content}>
        {/* page content here */}
      </div>
    </div>

  </div>
);
};

export default SDashboard;