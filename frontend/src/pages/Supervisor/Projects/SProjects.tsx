import SSidebar from "../Sidebar/Ssidebar";
import { type FC, useState } from "react";
import styles from "./SProjects.module.css";
import Header from "../../../components/Header/Header";
import StatsCard from "../../../components/StatsCard/StatsCard";
import {
  LuUsers,
  //LuCalendar,
  //LuUserCheck,
    LuClock,
    LuLoaderCircle,
  //LuLink,
  
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";


const projects = [
  {
    id: "p1",
    groupName: "Alpha Innovators",
    projectName: "AI-Based Healthcare Diagnosis System",
    members: 3,
    progress: 65,
    progressColor: "#FF9F0A",
    deadline: {
      type: "Mid-Term Presentation",
      dueDate: "Mar 22, 2026",
      time: "2:00 PM",
      daysLeft: 4
    }
  },
  {
    id: "p2",
    groupName: "Cloud Warriors",
    projectName: "Smart City Traffic Management Platform",
    members: 2,
    progress: 78,
    progressColor: "#22C55E",
    deadline: null
  },
  {
    id: "p3",
    groupName: "Mobile Mavericks",
    projectName: "E-Commerce Mobile App with AR Features",
    members: 3,
    progress: 45,
    progressColor: "#EF4444",
    deadline: {
      type: "Sprint Review & Demo",
      dueDate: "Mar 20, 2026",
      time: "3:30 PM",
      daysLeft: 2
    }
  }
];

const SProjects: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <SSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={styles.main}>
        <Header
          title="Groups"
          subtitle="Welcome back, Muhammad Kamran"
          userName="Muhammad Kamran"
          userId="SP2024001"
        />

        <div className={styles.content}>
          <div className={styles.statsGrid}>
            <StatsCard value={5} label="Total Groups" icon={<LuUsers />} bgColor="#F0F7FF" iconColor="#0D3CCF"/>
            <StatsCard value={14} label="Total Students" icon={<LuUsers />} bgColor="#F0FDF4" iconColor="#22C55E"/>
            <StatsCard value={3} label="Upcoming Deadlines" icon={<LuClock />} bgColor="#FFF7ED" iconColor="#F59E0B"/>
            <StatsCard value={1} label="Lagging Groups" icon={<LuLoaderCircle />} bgColor="#FEF2F2" iconColor="#DC2626"/>
          </div>

          <div className={styles.sectionHeader}>
            <div className={styles.titleRow}>
              <p className={styles.title}>All Supervised Groups</p>
              <span className={styles.activeBadge}>5 Active Groups</span>
            </div>

            <div className={styles.projectGrid}>
              {projects.map((project) => (
                <div key={project.id} className={styles.projectCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.groupIcon}><LuUsers /></div>
                    <div className={styles.groupMeta}>
                      <h3>{project.groupName}</h3>
                      <span>{project.members} Members</span>
                    </div>
                  </div>

                  <p className={styles.projectName}>{project.projectName}</p>

                  {project.deadline && (
                    <div className={styles.deadlineBox}>
                      <div className={styles.deadlineHeader}>
                        <LuClock className={styles.clockIcon} />
                        <span className={styles.deadlineType}>{project.deadline.type}</span>
                        <span className={styles.daysBadge}>{project.deadline.daysLeft} days left</span>
                      </div>
                      <p className={styles.dueTime}>Due: {project.deadline.dueDate} at {project.deadline.time}</p>
                    </div>
                  )}

                  <div className={styles.progressContainer}>
                    <div className={styles.progressLabel}>
                      <span>Project Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill} 
                        style={{ width: `${project.progress}%`, backgroundColor: project.progressColor }}
                      ></div>
                    </div>
                  </div>

                  <div className={styles.cardFooter}>
                    <button onClick={() => navigate(`/supervisor/projects/${project.id}`)} className={styles.viewDetails}>
                      View Details &gt;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SProjects;