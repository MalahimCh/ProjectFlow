import SSidebar from "../Sidebar/Ssidebar";
import { type FC, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./SDashboard.module.css";
import Header from "../../../components/Header/Header";
import StatsCard from "../../../components/StatsCard/StatsCard";
import { LuUsers, LuMessageSquareText, LuCalendar, LuUserCheck } from "react-icons/lu"

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
    time,             // 03:00 PM
    fullDate: date,   // optional raw Date object
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
  ],

  upcomingMeetings: [
    {
      meetingType: "Sprint Review",
      projectName: "AI Project",
      datetime: "2026-04-21T15:00:00.000Z",
    },
    {
      meetingType: "Client Discussion",
      projectName: "Web Dev FYP",
      datetime: "2026-04-22T11:00:00.000Z",
    },
    {
      meetingType: "Team Sync",
      projectName: "Database Systems",
      datetime: "2026-04-24T17:30:00.000Z",
    },
    {
      meetingType: "Design Review",
      projectName: "AI Project",
      datetime: "2026-04-26T14:00:00.000Z",
    },
  ],

  upcomingDeadlines: [
    {
      deadlineType: "UI Prototype",
      projectName: "Web Dev FYP",
      date: "2026-04-22T00:00:00.000Z",
    },
    {
      deadlineType: "Report Submission",
      projectName: "AI Project",
      date: "2026-04-25T00:00:00.000Z",
    },
    {
      deadlineType: "Database Schema Finalization",
      projectName: "Database Systems",
      date: "2026-04-26T00:00:00.000Z",
    },
    {
      deadlineType: "Final Presentation Slides",
      projectName: "AI Project",
      date: "2026-04-27T00:00:00.000Z",
    },
  ],
};

const SDashboard: FC = () => {
  const [collapsed, setCollapsed] = useState(false);

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
          
          <div className={styles.statsGrid}>
            <StatsCard value={2} label="Active Groups" icon={<LuUsers />} bgColor="#EFF6FF" iconColor="#0D3CCF"/>
            <StatsCard value={3} label="Pending Requests" icon={<LuMessageSquareText />} bgColor="#FEF2F2" iconColor="#DC2626"/>
            <StatsCard value={0} label="Upcoming Meetings" icon={<LuCalendar />} bgColor="#F0FDF4" iconColor="#16A34A"/>
            <StatsCard value={6} label="Total Students" icon={<LuUserCheck />} bgColor="#FFF7ED" iconColor="#F59E0B"/>
          </div>

          <div className={styles.section}>
                <div className={styles.projectsTopLine}>
                  <p className={styles.sectionTitle}>Active Projects</p>
                  <Link to="/supervisor/projects" className={styles.viewAll}>
                    View All &gt;
                  </Link>
                </div>
                <div className={styles.projectsGrid}>
                  {dashboardView.activeGroups.map((project, idx) => (
                    <div key={idx} className={styles.projectCard}>
                      <div className={styles.projectHeader}>
                        <p>{project.groupName}</p>
                        <div className={styles.progressHeader}>
                          <p className={styles.progressText}>Progress</p>
                          <p className={styles.progressPercent}>{project.progress}%</p>
                        </div>
                      </div>

                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressFill}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
          </div>

          <div className={styles.twoColumnSection}>
            {/* Deadlines */}
            <div className={styles.column}>
              <h2 className={styles.sectionTitle}>Upcoming Deadlines</h2>

              {dashboardView.upcomingDeadlines.map((item, idx) => {
                const formatted = formatSmartDateTime(item.date);

                return (
                  <div key={idx} className={styles.taskCard}>
                    <div className={styles.taskTitle}>{item.deadlineType}</div>
                    <div className={styles.taskSub}>{item.projectName}</div>
                    <div className={styles.taskMeta}>
                      {formatted.label} • {formatted.time}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Meetings */}
            <div className={styles.column}>
              <h2 className={styles.sectionTitle}>Upcoming Meetings</h2>

              {dashboardView.upcomingMeetings.map((item, idx) => {
                const formatted = formatSmartDateTime(item.datetime);

                return (
                  <div key={idx} className={styles.taskCard}>
                    <div className={styles.taskTitle}>{item.meetingType}</div>
                    <div className={styles.taskSub}>{item.projectName}</div>
                    <div className={styles.taskMeta}>
                      {formatted.label} • {formatted.time}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default SDashboard;
