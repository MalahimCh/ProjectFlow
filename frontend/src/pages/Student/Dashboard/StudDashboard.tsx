import StudSidebar from "../Sidebar/StudSidebar";
import { type FC, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./StudDashboard.module.css";
import Header from "../../../components/Header/Header";
import StatsCard from "../../../components/StatsCard/StatsCard";
import {
  LuCircleCheck,
  LuClock,
  LuCalendar,
  LuFlag,
  LuBell,
  LuChevronRight,
} from "react-icons/lu";
import {
  fetchStudentDashboard,
  type DashboardData,
  type DashboardDeadline,
  type DashboardAnnouncement,
} from "../../../services/studentService";

/* ── Helpers ───────────────────────────────────────────────── */

const getProgressColor = (_progress: number) => "#0D3CCF";

const getDeadlineLabel = (daysLeft: number) => {
  if (daysLeft <= 0) return { text: "Due Today", color: "#DC2626" };
  if (daysLeft === 1) return { text: "1 Day left", color: "#F59E0B" };
  return { text: `${daysLeft} Days left`, color: "#6A7282" };
};

/* ── Skeleton loader ───────────────────────────────────────── */
const Skeleton = ({
  width = "100%",
  height = "16px",
}: {
  width?: string;
  height?: string;
}) => (
  <div
    style={{
      width,
      height,
      borderRadius: 6,
      background:
        "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s infinite",
    }}
  />
);

const isMobile = () =>
  typeof window !== "undefined" && window.innerWidth <= 767;

/* ── Component ─────────────────────────────────────────────── */

const StudDashboard: FC = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(() => isMobile());
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 767) setCollapsed(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchStudentDashboard()
      .then(setData)
      .catch(() => setError("Failed to load dashboard. Please refresh."))
      .finally(() => setLoading(false));
  }, []);

  const project = data?.project ?? null;
  const stats = data?.stats ?? { progress: 0, pendingTasks: 0, meetings: 0 };
  const deadlines: DashboardDeadline[] = data?.deadlines ?? [];
  const announcements: DashboardAnnouncement[] = data?.announcements ?? [];

  if (error) {
    return (
      <div className={styles.container}>
        <StudSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className={styles.main}>
          <Header title="Dashboard" subtitle="Welcome back" />
          <div className={styles.content}>
            <div className={styles.errorState}>{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <StudSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>

      <div className={styles.main}>
        <Header
          title="Dashboard"
          subtitle="Welcome back. Showing your project overview and upcoming deadlines."
        />

        <div className={styles.content}>
          {/* ── Stats ── */}
          <div className={styles.statsGrid}>
            {loading ? (
              <>
                <div className={styles.skeletonCard}><Skeleton height="80px" /></div>
                <div className={styles.skeletonCard}><Skeleton height="80px" /></div>
                <div className={styles.skeletonCard}><Skeleton height="80px" /></div>
              </>
            ) : (
              <>
                <StatsCard
                  value={`${stats.progress}%`}
                  label="Project Progress"
                  icon={<LuCircleCheck />}
                  bgColor="#EFF6FF"
                  iconColor="#0D3CCF"
                />
                <StatsCard
                  value={stats.pendingTasks}
                  label="Pending Tasks"
                  icon={<LuClock />}
                  bgColor="#FEF2F2"
                  iconColor="#DC2626"
                />
                <StatsCard
                  value={stats.meetings}
                  label="Scheduled Meetings"
                  icon={<LuCalendar />}
                  bgColor="#F0FDF4"
                  iconColor="#16A34A"
                />
              </>
            )}
          </div>

          {/* ── Project Overview ── */}
          <div className={styles.card}>
            <p className={styles.cardHeading}>Project Overview</p>

            {loading ? (
              <div className={styles.skeletonBlock}>
                <Skeleton height="14px" width="60%" />
                <Skeleton height="14px" width="40%" />
                <Skeleton height="14px" width="50%" />
                <Skeleton height="14px" width="35%" />
                <Skeleton height="10px" />
              </div>
            ) : !data?.hasProject ? (
              <div className={styles.emptyState}>
                <LuFlag size={24} color="#D1D5DB" />
                <p className={styles.emptyText}>No project assigned yet.</p>
              </div>
            ) : (
              <>
                <div className={styles.metaGrid}>
                  <div className={styles.metaItem}>
                    <p className={styles.metaLabel}>Title</p>
                    <p className={styles.metaValue}>{project!.title}</p>
                  </div>
                  <div className={styles.metaItem}>
                    <p className={styles.metaLabel}>Members</p>
                    <p className={styles.metaValue}>{project!.team.join(", ")}</p>
                  </div>
                  <div className={styles.metaItem}>
                    <p className={styles.metaLabel}>Domain</p>
                    <p className={styles.metaValue}>{project!.domain || "—"}</p>
                  </div>
                  <div className={styles.metaItem}>
                    <p className={styles.metaLabel}>Supervisor</p>
                    <p className={styles.metaValue}>{project!.supervisor}</p>
                  </div>
                </div>

                <div className={styles.progressSection}>
                  <div className={styles.progressInfo}>
                    <span className={styles.progressLabel}>Overall Progress</span>
                    <span
                      className={styles.progressPercent}
                      style={{ color: getProgressColor(project!.progress) }}
                    >
                      {project!.progress}%
                    </span>
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{
                        width: `${project!.progress}%`,
                        backgroundColor: getProgressColor(project!.progress),
                      }}
                    />
                  </div>
                </div>

                {project && (
                  <button
                    className={styles.viewProjectBtn}
                    onClick={() => navigate(`/student/projects/${project.id}`)}
                  >
                    View Project <LuChevronRight size={14} />
                  </button>
                )}
              </>
            )}
          </div>

          {/* ── Bottom two columns ── */}
          <div className={styles.twoCol}>
            {/* Upcoming Deadlines */}
            <div className={`${styles.colCard} ${styles.colCardDeadlines}`}>
              <p className={styles.cardHeading}>Upcoming Deadlines</p>

              {loading ? (
                <div className={styles.skeletonBlock}>
                  <Skeleton height="52px" />
                  <Skeleton height="52px" />
                  <Skeleton height="52px" />
                </div>
              ) : deadlines.length === 0 ? (
                <div className={styles.emptyState}>
                  <LuFlag size={24} color="#D1D5DB" />
                  <p className={styles.emptyText}>No upcoming deadlines</p>
                </div>
              ) : (
                <div className={styles.deadlineList}>
                  {deadlines.map((item) => {
                    const { text, color } = getDeadlineLabel(item.daysLeft);
                    return (
                      <div
                        key={item.id}
                        className={`${styles.deadlineItem} ${
                          item.type === "assignment" ? styles.deadlineClickable : ""
                        }`}
                        onClick={() => {
                          if (item.type === "assignment" && item.projectId && item.assignmentId) {
                            navigate(`/student/projects/${item.projectId}/assignments/${item.assignmentId}`);
                          }
                        }}
                      >
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
                {project && (
                  <Link to={`/student/projects/${project.id}`} className={styles.viewAll}>
                    View All &gt;
                  </Link>
                )}
              </div>

              {loading ? (
                <div className={styles.skeletonBlock}>
                  <Skeleton height="66px" />
                  <Skeleton height="66px" />
                </div>
              ) : announcements.length === 0 ? (
                <div className={styles.emptyState}>
                  <LuBell size={24} color="#D1D5DB" />
                  <p className={styles.emptyText}>No announcements</p>
                </div>
              ) : (
                <div className={styles.announcementList}>
                  {announcements.map((a) => (
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