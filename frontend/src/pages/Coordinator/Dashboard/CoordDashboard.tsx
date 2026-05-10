import CoordSidebar from "../Sidebar/CoordSidebar";
import { type FC, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./CoordDashboard.module.css";
import Header from "../../../components/Header/Header";
import StatsCard from "../../../components/StatsCard/StatsCard";
import {
  LuUsers,
  LuMessageSquareText,
  LuCalendar,
  LuUserCheck,
  LuBookOpen,
  LuClock,
  LuTriangleAlert,
} from "react-icons/lu";

export const formatSmartDateTime = (isoString: string) => {
  const date = new Date(isoString);
  const today = new Date();

  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const isToday = date.toDateString() === today.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  // time part
  const time = date.toLocaleTimeString("en-PK", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // base date label
  let dateLabel: string;

  if (isToday) {
    dateLabel = "Today";
  } else if (isTomorrow) {
    dateLabel = "Tomorrow";
  } else {
    dateLabel = date.toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
    });
  }

  return {
    label: dateLabel, // Today / Tomorrow / 22 Apr
    time, // 03:00 PM
    fullDate: date, // optional raw Date object
  };
};

const dashboardView = {
  activeGroups: [
    {
      groupName: "AI Project Team",
      progress: 65,
    },
    {
      groupName: "Web Dev FYP",
      progress: 40,
    },
    {
      groupName: "Database Systems Group",
      progress: 80,
    },
    {
      groupName: "Flex Clone",
      progress: 72,
    },
  ],

  upcomingMeetings: [
    {
      meetingType: "Sprint Review",
      projectName: "AI Project",
      datetime: "2026-04-25T15:00:00.000Z",
    },
    {
      meetingType: "Client Discussion",
      projectName: "Web Dev FYP",
      datetime: "2026-04-27T11:00:00.000Z",
    },
    {
      meetingType: "Team Sync",
      projectName: "Database Systems",
      datetime: "2026-04-28T17:30:00.000Z",
    },
    {
      meetingType: "Design Review",
      projectName: "AI Project",
      datetime: "2026-04-30T14:00:00.000Z",
    },
  ],

  upcomingDeadlines: [
    {
      deadlineType: "UI Prototype",
      projectName: "Web Dev FYP",
      datetime: "2026-04-25T06:59:00.000Z",
    },
    {
      deadlineType: "Report Submission",
      projectName: "AI Project",
      datetime: "2026-04-25T00:00:00.000Z",
    },
    {
      deadlineType: "Database Schema Finalization",
      projectName: "Database Systems",
      datetime: "2026-04-26T00:00:00.000Z",
    },
    {
      deadlineType: "Final Presentation Slides",
      projectName: "AI Project",
      datetime: "2026-04-30T00:00:00.000Z",
    },
  ],
};

const getProgressColor = (progress: number) => {
  if (progress < 50) return "#DC2626";
  if (progress < 75) return "#F59E0B";
  return "#16A34A";
};

const CoordDashboard: FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={styles.container}>
      <CoordSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={styles.main}>
        <Header
          title="Dashboard"
          subtitle="Welcome back, Muhammad Kamran"
          userName="Junaid Hussain"
          userId="CO2024001"
        />

        <div className={styles.content}>
          {/* Stats Cards */}
          <div className={styles.statsGrid}>
            <StatsCard
              value={24}
              label="Total Projects"
              icon={<LuBookOpen />}
              bgColor="#EFF6FF"
              iconColor="#0D3CCF"
            />
            <StatsCard
              value={8}
              label="Total Supervisors"
              icon={<LuUsers />}
              bgColor="#F0FDF4"
              iconColor="#16A34A"
            />
            <StatsCard
              value={5}
              label="Pending Evaluations"
              icon={<LuMessageSquareText />}
              bgColor="#FEF2F2"
              iconColor="#DC2626"
            />
            <StatsCard
              value={3}
              label="Upcoming Presentations"
              icon={<LuCalendar />}
              bgColor="#FFF7ED"
              iconColor="#F59E0B"
            />
          </div>

          {/* Active Projects */}
          <div className={styles.section}>
            <div className={styles.projectsTopLine}>
              <p className={styles.sectionTitle}>Project Progress Overview</p>
              <Link to="/coordinator/projects" className={styles.viewAll}>
                View All &gt;
              </Link>
            </div>

            <div className={styles.projectsGrid}>
              {[
                {
                  groupName: "AI Attendance System",
                  supervisor: "Dr. Ahmed Khan",
                  progress: 82,
                },
                {
                  groupName: "ProjectFlow",
                  supervisor: "Dr. Sarah Ali",
                  progress: 65,
                },
                {
                  groupName: "Smart Irrigation",
                  supervisor: "Dr. Bilal",
                  progress: 48,
                },
                {
                  groupName: "Medical Chatbot",
                  supervisor: "Dr. Usman",
                  progress: 91,
                },
              ].map((project, idx) => (
                <div key={idx} className={styles.projectCard}>
                  <div className={styles.cardIcons}>
                    <div className={styles.bookIconWrapper}>
                      <LuBookOpen className={styles.bookIcon} />
                    </div>
                    <div className={styles.tickIconWrapper}>
                      <LuUserCheck className={styles.tickIcon} />
                    </div>
                  </div>

                  <div className={styles.projectName}>
                    <p>{project.groupName}</p>
                  </div>

                  <p className={styles.taskSub} style={{ marginLeft: 0 }}>
                    {project.supervisor}
                  </p>

                  <div className={styles.progressHeader}>
                    <p className={styles.progressText}>Progress</p>
                    <p className={styles.progressPercent}>
                      {project.progress}%
                    </p>
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
              ))}
            </div>
          </div>

          {/* Two Column Section */}
          <div className={styles.twoColumnSection}>
            {/* Left Column */}
            <div className={styles.column}>
              <div className={styles.projectsTopLine}>
                <p className={styles.sectionTitle}>Upcoming Presentations</p>
                <Link
                  to="/coordinator/presentations"
                  className={styles.viewAll}
                >
                  View All &gt;
                </Link>
              </div>

              {[
                {
                  title: "Mid Evaluation",
                  project: "ProjectFlow",
                  dueLabel: "Tomorrow at 11:00 AM",
                },
                {
                  title: "Final Defense",
                  project: "AI Attendance System",
                  dueLabel: "In 3 days",
                },
                {
                  title: "Proposal Presentation",
                  project: "Medical Chatbot",
                  dueLabel: "In 5 days",
                },
              ].map((item, idx) => (
                <div key={idx} className={styles.taskCard}>
                  <div className={styles.meetingTop}>
                    <div className={styles.meetingIcon}>
                      <LuCalendar />
                    </div>
                    <div className={styles.taskTitle}>{item.title}</div>
                  </div>

                  <div className={styles.taskSub}>{item.project}</div>

                  <div className={styles.meetingTime}>
                    <LuClock />
                    <span>{item.dueLabel}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div className={styles.column}>
              <div className={styles.projectsTopLine}>
                <p className={styles.sectionTitle}>Supervisor Workload</p>
                <Link
                  to="/coordinator/supervisor-assignment"
                  className={styles.viewAll}
                >
                  Manage &gt;
                </Link>
              </div>

              {[
                {
                  title: "Dr. Ahmed Khan",
                  project: "6 Assigned Projects",
                  dueLabel: "Balanced Load",
                  status: "normal",
                },
                {
                  title: "Dr. Sarah Ali",
                  project: "8 Assigned Projects",
                  dueLabel: "Near Capacity",
                  status: "urgent",
                },
                {
                  title: "Dr. Bilal",
                  project: "3 Assigned Projects",
                  dueLabel: "Available",
                  status: "normal",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`${styles.taskCard} ${
                    item.status === "urgent"
                      ? styles.taskCardUrgent
                      : styles.taskCardNormal
                  }`}
                >
                  <div className={styles.deadlineTop}>
                    {item.status === "urgent" ? (
                      <LuTriangleAlert className={styles.iconUrgent} />
                    ) : (
                      <LuUserCheck className={styles.iconNormal} />
                    )}

                    <div className={styles.taskTitle}>{item.title}</div>
                  </div>

                  <div className={styles.taskSub}>{item.project}</div>

                  <div
                    className={
                      item.status === "urgent"
                        ? styles.taskMetaUrgent
                        : styles.taskMetaNormal
                    }
                  >
                    <LuClock />
                    <span>{item.dueLabel}</span>
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

export default CoordDashboard;
