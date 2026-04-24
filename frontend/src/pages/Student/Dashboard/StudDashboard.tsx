import StudSidebar from "../Sidebar/StudSidebar";
import { type FC, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./StudDashboard.module.css";
import Header from "../../../components/Header/Header";
import StatsCard from "../../../components/StatsCard/StatsCard";
import {
  LuUsers,
  LuMessageSquareText,
  LuCalendar,
  LuUserCheck,
  LuBookOpen,
  LuCircleCheck,
  LuClock,
  LuTriangleAlert,
  LuFlag,
} from "react-icons/lu";

const StudDashboard: FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={styles.container}>
      <StudSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={styles.main}>
        <Header
          title="Dashboard"
          subtitle="Welcome back, Muhammad Kamran"
          userName="Junaid Hussain"
          userId="CO2024001"
        />

        <div className={styles.content}>
          <div className={styles.statsGrid}>
            <StatsCard
              value={2}
              label="Active Groups"
              icon={<LuUsers />}
              bgColor="#EFF6FF"
              iconColor="#0D3CCF"
            />
            <StatsCard
              value={3}
              label="Pending Requests"
              icon={<LuMessageSquareText />}
              bgColor="#FEF2F2"
              iconColor="#DC2626"
            />
            <StatsCard
              value={0}
              label="Upcoming Meetings"
              icon={<LuCalendar />}
              bgColor="#F0FDF4"
              iconColor="#16A34A"
            />
            <StatsCard
              value={6}
              label="Total Students"
              icon={<LuUserCheck />}
              bgColor="#FFF7ED"
              iconColor="#F59E0B"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudDashboard;
