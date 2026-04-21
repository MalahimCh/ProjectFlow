import SSidebar from "../Sidebar/Ssidebar";
import { type FC, useState } from "react";
import styles from "./SProjects.module.css";
import Header from "../../../components/Header/Header";
import StatsCard from "../../../components/StatsCard/StatsCard";
import { LuUsers,LuMessageSquareText,LuCalendar, LuUserCheck } from "react-icons/lu"



const SProjects: FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={styles.container}>
      <SSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={styles.main}>
        <Header
          title="Projects"
          subtitle="View and manage your projects"
          userName="Junaid Hussain"
          userId="CO2024001"
        />

        <div className={styles.content}>
          
          <div className={styles.statsGrid}>
            <StatsCard value={2} label="Total Groups" icon={<LuUsers />} bgColor="#EFF6FF" iconColor="#0D3CCF"/>
            <StatsCard value={3} label="Total Students" icon={<LuMessageSquareText />} bgColor="#FEF2F2" iconColor="#DC2626"/>
            <StatsCard value={0} label="Upcoming Deadlines" icon={<LuCalendar />} bgColor="#F0FDF4" iconColor="#16A34A"/>
            <StatsCard value={6} label="Lagging Groups" icon={<LuUserCheck />} bgColor="#FFF7ED" iconColor="#F59E0B"/>
          </div>



        </div>
      </div>
    </div>
  );
};

export default SProjects;
