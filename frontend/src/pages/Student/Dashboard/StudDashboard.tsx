import StudSidebar from "../Sidebar/StudSidebar";
import { type FC, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./StudDashboard.module.css";
import Header from "../../../components/Header/Header";
import StatsCard from "../../../components/StatsCard/StatsCard";
import {
  LuCalendar,
  LuCircleCheck,
  LuClock,
  LuTriangleAlert,
  LuFlag,
} from "react-icons/lu";

const dashboardData = {
  project: {
    title: "AI-Based Smart Attendance System",
    domain: "Artificial Intelligence",
    supervisor: "Dr. Ahmed Hassan",
    progress: 65,
    team: ["Malahim Chaudhary", "Ali Khan", "Sara Ahmed"],
  },

  stats: {
    progress: 65,
    pendingTasks: 3,
    meetings: 2,
  },

  deadlines: [
    {
      title: "UI Prototype Submission",
      datetime: "2026-04-25T06:59:00.000Z",
    },
    {
      title: "Final Report Draft",
      datetime: "2026-04-26T00:00:00.000Z",
    },
    {
      title: "Presentation Slides",
      datetime: "2026-04-30T00:00:00.000Z",
    },
  ],

  meetings: [
    {
      title: "Sprint Review",
      datetime: "2026-04-25T15:00:00.000Z",
    },
    {
      title: "Supervisor Meeting",
      datetime: "2026-04-27T11:00:00.000Z",
    },
  ],
};

const getProgressColor = (progress: number) => {
  if (progress < 50) return "#DC2626";
  if (progress < 75) return "#F59E0B";
  return "#16A34A";
};

const getUpcomingWithinWeek = (items: any[]) => {
  const now = new Date();

  return items
    .map((item) => {
      const rawDate = new Date(item.datetime);

      const diffMs = rawDate.getTime() - now.getTime();

      // If already passed → don't show
      if (diffMs <= 0) return null;

      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      // Only within next 7 days
      if (diffDays > 6) return null;

      const timeString = rawDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      let label = "";

      if (diffDays === 0) {
        label = `Due Today at ${timeString}`;
      } else if (diffDays === 1) {
        label = `Due Tomorrow at ${timeString}`;
      } else {
        label = `Due in ${diffDays} days`;
      }

      return { ...item, dueLabel: label, diffDays };
    })
    .filter(Boolean)
    .sort((a, b) => a.diffDays - b.diffDays);
};

const getUpcomingDeadlinesStyled = (items: any[]) => {
  const now = new Date();

  return items
    .map((item) => {
      const rawDate = new Date(item.datetime);
      const diffMs = rawDate.getTime() - now.getTime();

      if (diffMs <= 0) return null;

      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays > 6) return null;

      const timeString = rawDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      let label = "";
      let status = "";

      if (diffDays === 0) {
        label = `Due Today at ${timeString}`;
        status = "urgent";
      } else if (diffDays === 1) {
        label = `Due Tomorrow at ${timeString}`;
        status = "urgent";
      } else {
        label = `Due in ${diffDays} days`;
        status = "normal";
      }

      return { ...item, dueLabel: label, status };
    })
    .filter(Boolean);
};

const StudDashboard: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const project = dashboardData.project;
  return (
    <div className={styles.container}>
      <StudSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={styles.main}>
        <Header
          title="Dashboard"
          subtitle="Welcome back, Malahim Chaudhary"
          userName="Malahim Chaudhary"
          userId="CO2024001"
        />

        <div className={styles.content}>
          <div className={styles.statsGrid}>
            <StatsCard
              value={`${dashboardData.stats.progress}%`}
              label="Project Progress"
              icon={<LuCircleCheck />}
              bgColor="#EFF6FF"
              iconColor="#0D3CCF"
            />

            <StatsCard
              value={dashboardData.stats.pendingTasks}
              label="Pending Tasks"
              icon={<LuClock />}
              bgColor="#FEF2F2"
              iconColor="#DC2626"
            />

            <StatsCard
              value={dashboardData.stats.meetings}
              label="Scheduled Meetings"
              icon={<LuCalendar />}
              bgColor="#F0FDF4"
              iconColor="#16A34A"
            />
          </div>

          <div className={styles.section}>
            <p className={styles.sectionTitle}>Project Overview</p>

            <div className={styles.projectOverviewCard}>
              <p className={styles.projectTitle}>{project.title}</p>

              <p className={styles.projectMeta}>
                <strong>Domain:</strong> {project.domain}
              </p>

              <p className={styles.projectMeta}>
                <strong>Supervisor:</strong> {project.supervisor}
              </p>

              <p className={styles.projectMeta}>
                <strong>Team Members:</strong> {project.team.join(", ")}
              </p>
              <div className={styles.progressHeader}>
                <p className={styles.progressText}>Overall Progress</p>
                <p className={styles.progressPercent}>{project.progress}%</p>
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
          </div>

          <div className={styles.twoColumnSection}>
            <div className={styles.column}>
              <p className={styles.sectionTitle}>Upcoming Deadlines</p>
              {getUpcomingDeadlinesStyled(dashboardData.deadlines).map(
                (item, idx) => (
                  <div
                    key={idx}
                    className={`${styles.taskCard} ${
                      item.status === "urgent"
                        ? styles.taskCardUrgent
                        : styles.taskCardNormal
                    }`}
                  >
                    <div className={styles.deadlineTop}>
                      <div>
                        {item.status === "urgent" ? (
                          <LuTriangleAlert className={styles.iconUrgent} />
                        ) : (
                          <LuFlag className={styles.iconNormal} />
                        )}
                      </div>
                      <div className={styles.taskTitle}>{item.title}</div>
                    </div>
                    <div className={styles.taskSub}>
                      {dashboardData.project.title}
                    </div>

                    <div
                      className={
                        item.status === "urgent"
                          ? styles.taskMetaUrgent
                          : styles.taskMetaNormal
                      }
                    >
                      <div>
                        <LuClock />
                      </div>

                      <div>{item.dueLabel}</div>
                    </div>
                  </div>
                ),
              )}
            </div>

            <div className={styles.column}>
              <div className={styles.projectsTopLine}>
                <p className={styles.sectionTitle}>Upcoming Meetings</p>
                <Link to="/student/meetings" className={styles.viewAll}>
                  View All &gt;
                </Link>
              </div>
              {getUpcomingWithinWeek(dashboardData.meetings).map(
                (item, idx) => (
                  <div key={idx} className={styles.taskCard}>
                    <div className={styles.meetingTop}>
                      <div className={styles.meetingIcon}>
                        <LuCalendar />
                      </div>
                      <div className={styles.taskTitle}>{item.title}</div>
                    </div>
                    <div className={styles.taskSub}>
                      {dashboardData.project.title}
                    </div>
                    <div className={styles.meetingTime}>
                      <div>
                        <LuClock />
                      </div>
                      <div>{item.dueLabel}</div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudDashboard;
