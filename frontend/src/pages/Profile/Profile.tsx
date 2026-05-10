import CoordSidebar from "../Coordinator/Sidebar/CoordSidebar";
import SSidebar from "../Supervisor/Sidebar/Ssidebar";
import StudSidebar from "../Student/Sidebar/StudSidebar";
import { type FC, useState } from "react";
import styles from "./Profile.module.css";
import Header from "../../components/Header/Header";
import type CoordProjects from "../Coordinator/Projects/CoordProjects";

const Profile: FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={styles.container}>
      <CoordSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={styles.main}>
        <Header
          title="Profile"
          subtitle="View and manage your profile"
          userName="Junaid Hussain"
          userId="CO2024001"
        />

        <div className={styles.content}></div>
      </div>
    </div>
  );
};

export default Profile;
