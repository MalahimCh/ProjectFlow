import SSidebar from "../Sidebar/Ssidebar";
import { type FC, useState } from "react";
import styles from "./SProjects.module.css";
import Header from "../../../components/Header/Header";
import StatsCard from "../../../components/StatsCard/StatsCard";
import { LuUsers, LuClock, LuCircleAlert } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

type Project = {
  id: string;
  groupName: string;
  projectName: string;
  members: number;
  progress: number;
  deadline: {
    type: string;
    dueDate: string;
    time: string;
    daysLeft: number;
  } | null;
};

const projects: Project[] = [
  {
    id: "p1",
    groupName: "Alpha Innovators",
    projectName: "AI-Based Healthcare Diagnosis System",
    members: 3,
    progress: 65,
    deadline: {
      type: "Mid-Term Presentation",
      dueDate: "Mar 22, 2026",
      time: "2:00 PM",
      daysLeft: 4,
    },
  },
  {
    id: "p2",
    groupName: "Cloud Warriors",
    projectName: "Smart City Traffic Management Platform",
    members: 2,
    progress: 78,
    deadline: null,
  },
  {
    id: "p3",
    groupName: "Mobile Mavericks",
    projectName: "E-Commerce Mobile App with AR Features",
    members: 3,
    progress: 45,
    deadline: {
      type: "Sprint Review & Demo",
      dueDate: "Mar 20, 2026",
      time: "3:30 PM",
      daysLeft: 2,
    },
  },
  {
    id: "p4",
    groupName: "Data Dynamics",
    projectName: "Real-Time Analytics Dashboard",
    members: 3,
    progress: 58,
    deadline: {
      type: "System Architecture Review",
      dueDate: "Mar 23, 2026",
      time: "10:00 AM",
      daysLeft: 5,
    },
  },
  {
    id: "p5",
    groupName: "Cyber Sentinels",
    projectName: "Network Security Monitoring System",
    members: 2,
    progress: 72,
    deadline: null,
  },
];

const getProgressColor = (progress: number): string => {
  if (progress < 50) return "#DC2626"; // red
  if (progress <= 75) return "#F59E0B"; // orange
  return "#16A34A"; // green
};

const SProjects: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const totalGroups = projects.length;
  const totalStudents = projects.reduce((sum, p) => sum + p.members, 0);
  const upcomingDeadlines = projects.filter((p) => p.deadline !== null).length;
  const laggingGroups = projects.filter((p) => p.progress < 50).length;

  return (
    <div className={styles.container}>
      <SSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={styles.main}>
        <Header
          title="Projects"
          subtitle="View and manage your projects"
          userName="Muhammad Kamran"
          userId="SP2024001"
        />

        <div className={styles.content}>
          <div className={styles.statsGrid}>
            <StatsCard
              value={totalGroups}
              label="Total Groups"
              icon={<LuUsers />}
              bgColor="#EFF6FF"
              iconColor="#0D3CCF"
            />
            <StatsCard
              value={totalStudents}
              label="Total Students"
              icon={<LuUsers />}
              bgColor="#F0FDF4"
              iconColor="#16A34A"
            />
            <StatsCard
              value={upcomingDeadlines}
              label="Upcoming Deadlines"
              icon={<LuClock />}
              bgColor="#FFF7ED"
              iconColor="#F59E0B"
            />
            <StatsCard
              value={laggingGroups}
              label="Lagging Groups"
              icon={<LuCircleAlert />}
              bgColor="#FEF2F2"
              iconColor="#DC2626"
            />
          </div>

          <div className={styles.sectionHeader}>
            <div className={styles.titleRow}>
              <p className={styles.title}>All Supervised Groups</p>
              <span className={styles.activeBadge}>
                {totalGroups} Active Groups
              </span>
            </div>

            <div className={styles.projectGrid}>
              {projects.map((project) => (
                <div key={project.id} className={styles.projectCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.groupIcon}>
                      <LuUsers />
                    </div>
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
                        <span className={styles.deadlineType}>
                          {project.deadline.type}
                        </span>
                        <span className={styles.daysBadge}>
                          {project.deadline.daysLeft} days left
                        </span>
                      </div>
                      <p className={styles.dueTime}>
                        Due: {project.deadline.dueDate} at{" "}
                        {project.deadline.time}
                      </p>
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
                        style={{
                          width: `${project.progress}%`,
                          backgroundColor: getProgressColor(project.progress),
                        }}
                      />
                    </div>
                  </div>

                  <div className={styles.cardFooter}>
                    <button
                      onClick={() =>
                        navigate(`/supervisor/projects/${project.id}`)
                      }
                      className={styles.viewDetails}
                    >
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
