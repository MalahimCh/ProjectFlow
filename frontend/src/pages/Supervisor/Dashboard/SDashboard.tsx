import SSidebar from "../Sidebar/Ssidebar";
import { type FC, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./SDashboard.module.css";
import Header from "../../../components/Header/Header";
import StatsCard from "../../../components/StatsCard/StatsCard";
import { LuUsers, LuMessageSquareText, LuCalendar, LuUserCheck, LuBookOpen, LuCircleCheck, LuClock, LuTriangleAlert, LuFlag } from "react-icons/lu"

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

const getUpcomingWithinWeek = (items: any[]) => {
  const now = new Date();

  return items
    .map((item) => {
      const rawDate = new Date(item.datetime);

      const diffMs = rawDate.getTime() - now.getTime();

      // If already passed → don't show
      if (diffMs <= 0) return null;

      const diffDays = Math.floor(
        diffMs / (1000 * 60 * 60 * 24)
      );

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
                      <div className={styles.cardIcons}>
                        <div className={styles.bookIconWrapper}>
                          <LuBookOpen className={styles.bookIcon}/>
                        </div>
                        <div className={styles.tickIconWrapper}>
                          <LuCircleCheck className={styles.tickIcon}/>
                        </div>
                      </div>

                      <div className={styles.projectName}>
                        <p>{project.groupName}</p>
                      </div>

                      <div className={styles.progressHeader}>
                          <p className={styles.progressText}>Progress</p>
                          <p className={styles.progressPercent}>{project.progress}%</p>
                      </div>

                      <div className={styles.progressBar}>
                        <div className={styles.progressFill}
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

          <div className={styles.twoColumnSection}>
            <div className={styles.column}>
              <p className={styles.sectionTitle}>Upcoming Deadlines</p>
              {getUpcomingDeadlinesStyled(dashboardView.upcomingDeadlines).map((item, idx) => (
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
                    <div className={styles.taskTitle}>{item.deadlineType}</div>
                  </div>
                  <div className={styles.taskSub}>{item.projectName}</div>
                  
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
                  
                    <div>
                      {item.dueLabel}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.column}>
              <div className={styles.projectsTopLine}>
                  <p className={styles.sectionTitle}>Upcoming Meetings</p>
                  <Link to="/supervisor/meetings" className={styles.viewAll}>
                    View All &gt;
                  </Link>
              </div>
              {getUpcomingWithinWeek(dashboardView.upcomingMeetings).map((item, idx) => (
                <div key={idx} className={styles.taskCard}>
                  <div className={styles.meetingTop}>
                    <div className={styles.meetingIcon}>
                      <LuCalendar/>
                    </div>
                    <div className={styles.taskTitle}>{item.meetingType}</div>
                  </div>
                  <div className={styles.taskSub}>{item.projectName}</div>
                  <div className={styles.meetingTime}>
                    <div>
                      <LuClock/>
                    </div>
                    <div>{item.dueLabel}</div>
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

export default SDashboard;