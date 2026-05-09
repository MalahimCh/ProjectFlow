import StudSidebar from "../Sidebar/StudSidebar";
import { type FC, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./StudDashboard.module.css";
import Header from "../../../components/Header/Header";
import StatsCard from "../../../components/StatsCard/StatsCard";
import { LuCircleCheck, LuClock, LuCalendar, LuFlag, LuBell } from "react-icons/lu";

/* ================= MOCK DATA ================= */

const dashboardData = {
  project: {
    title: "AI-Based Smart Attendance System",
    domain: "Artificial Intelligence",
    supervisor: "Dr. Ahmed Hassan",
    progress: 65,
    team: ["Malahim Chaudhary", "Abdullah Tahir", "Minahil Mudassar"],
  },

  stats: {
    progress: 65,
    pendingTasks: 3,
    meetings: 2,
  },

  deadlines: [
    { title: "Progress Report",      due: "Mar 18, 2026", daysLeft: 0  },
    { title: "SRS Document",         due: "Mar 18, 2026", daysLeft: 7  },
    { title: "Plagiarism Report",    due: "Apr 24, 2026", daysLeft: 29 },
  ],

  announcements: [
    {
      id: "1",
      title: "System Maintenance Scheduled",
      body: "Platform downtime from 11 PM to 1 AM tonight",
      postedAt: "2 hours ago",
    },
    {
      id: "2",
      title: "New Project Guidelines Released",
      body: "Updated documentation and submission requirements available",
      postedAt: "yesterday",
    },
  ],
};

const getProgressColor = (_progress: number) => "#0D3CCF";

const getDeadlineLabel = (daysLeft: number) => {
  if (daysLeft === 0) return { text: "Due Today", color: "#DC2626" };
  if (daysLeft === 1) return { text: "1 Day left", color: "#F59E0B" };
  return { text: `${daysLeft} Days left`, color: "#6A7282" };
};

/* ================= COMPONENT ================= */

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
          userId="ST2024001"
        />

        <div className={styles.content}>

          {/* ── Stats ── */}
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

          {/* ── Project Overview ── */}
          <div className={styles.card}>
            <p className={styles.cardHeading}>Project Overview</p>

            <div className={styles.metaGrid}>
              <div className={styles.metaItem}>
                <p className={styles.metaLabel}>Title</p>
                <p className={styles.metaValue}>{project.title}</p>
              </div>
              <div className={styles.metaItem}>
                <p className={styles.metaLabel}>Members</p>
                <p className={styles.metaValue}>{project.team.join(", ")}</p>
              </div>
              <div className={styles.metaItem}>
                <p className={styles.metaLabel}>Domain</p>
                <p className={styles.metaValue}>{project.domain}</p>
              </div>
              <div className={styles.metaItem}>
                <p className={styles.metaLabel}>Supervisor</p>
                <p className={styles.metaValue}>{project.supervisor}</p>
              </div>
            </div>

            <div className={styles.progressSection}>
              <div className={styles.progressInfo}>
                <span className={styles.progressLabel}>Overall Progress</span>
                <span
                  className={styles.progressPercent}
                  style={{ color: getProgressColor(project.progress) }}
                >
                  {project.progress}%
                </span>
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

          {/* ── Bottom two columns ── */}
          <div className={styles.twoCol}>

            {/* Upcoming Deadlines */}
            <div className={`${styles.colCard} ${styles.colCardDeadlines}`}>
              <p className={styles.cardHeading}>Upcoming Deadlines</p>

              {dashboardData.deadlines.length === 0 ? (
                <div className={styles.emptyState}>
                  <LuFlag size={24} color="#D1D5DB" />
                  <p className={styles.emptyText}>No upcoming deadlines</p>
                </div>
              ) : (
                <div className={styles.deadlineList}>
                  {dashboardData.deadlines.map((item, idx) => {
                    const { text, color } = getDeadlineLabel(item.daysLeft);
                    return (
                      <div key={idx} className={styles.deadlineItem}>
                        <div className={styles.deadlineLeft}>
                          <div className={styles.clockCircle}>
                            <LuClock size={14} color="#0D3CCF" />
                          </div>
                          <div>
                            <p className={styles.deadlineTitle}>{item.title}</p>
                            <p className={styles.deadlineDue}>Due: {item.due}</p>
                          </div>
                        </div>
                        <span className={styles.deadlineStatus} style={{ color }}>
                          {text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent Announcements */}
            <div className={`${styles.colCard} ${styles.colCardAnnouncements}`}>
              <div className={styles.colCardHeader}>
                <p className={styles.cardHeading}>Recent Announcements</p>
                <Link to="/student/meetings" className={styles.viewAll}>
                  View All &gt;
                </Link>
              </div>

              {dashboardData.announcements.length === 0 ? (
                <div className={styles.emptyState}>
                  <LuBell size={24} color="#D1D5DB" />
                  <p className={styles.emptyText}>No announcements</p>
                </div>
              ) : (
                <div className={styles.announcementList}>
                  {dashboardData.announcements.map((a) => (
                    <div key={a.id} className={styles.announcementItem}>
                      <div className={styles.annIcon}>
                        <LuCalendar size={14} color="#0D3CCF" />
                      </div>
                      <div className={styles.annBody}>
                        <p className={styles.annTitle}>{a.title}</p>
                        <p className={styles.annSubtitle}>{a.body}</p>
                        <div className={styles.annMeta}>
                          <LuClock size={11} color="#0D3CCF" />
                          <span className={styles.annTime}>Posted {a.postedAt}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default StudDashboard;