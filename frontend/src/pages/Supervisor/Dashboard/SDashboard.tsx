import SSidebar from "../Sidebar/Ssidebar";
import { type FC, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./SDashboard.module.css";
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
import {
  fetchSupervisorDashboard,
  type SupervisorDashboardData,
  type ActiveProject,
  type UpcomingDeadline,
  type UpcomingMeeting,
} from "../../../services/supervisorService";

/* ── Helpers ───────────────────────────────────────────────── */

const getProgressColor = (progress: number) => {
  if (progress < 50) return "#DC2626";
  if (progress < 75) return "#F59E0B";
  return "#16A34A";
};

interface DeadlineStyled extends UpcomingDeadline {
  dueLabel: string;
  status: "urgent" | "normal";
}

interface MeetingStyled extends UpcomingMeeting {
  dueLabel: string;
}

const styleDeadline = (item: UpcomingDeadline): DeadlineStyled => {
  const now = new Date();
  const rawDate = new Date(item.datetime);
  const diffMs = rawDate.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const timeString = rawDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  let dueLabel = "";
  let status: "urgent" | "normal" = "normal";

  if (diffDays === 0) {
    dueLabel = `Due Today at ${timeString}`;
    status = "urgent";
  } else if (diffDays === 1) {
    dueLabel = `Due Tomorrow at ${timeString}`;
    status = "urgent";
  } else {
    dueLabel = `Due in ${diffDays} days`;
    status = "normal";
  }

  return { ...item, dueLabel, status };
};

const styleMeeting = (item: UpcomingMeeting): MeetingStyled => {
  const now = new Date();
  const rawDate = new Date(item.datetime);
  const diffMs = rawDate.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const timeString = rawDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  let dueLabel = "";

  if (diffDays === 0) {
    dueLabel = `Today at ${timeString}`;
  } else if (diffDays === 1) {
    dueLabel = `Tomorrow at ${timeString}`;
  } else {
    dueLabel = `In ${diffDays} days at ${timeString}`;
  }

  return { ...item, dueLabel };
};

/* ── Skeleton ──────────────────────────────────────────────── */
const Skeleton = ({
  width = "100%",
  height = "16px",
  radius = "6px",
}: {
  width?: string;
  height?: string;
  radius?: string;
}) => (
  <div
    style={{
      width,
      height,
      borderRadius: radius,
      background: "linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s infinite",
    }}
  />
);

/* ── Component ─────────────────────────────────────────────── */

const SDashboard: FC = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [data, setData] = useState<SupervisorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSupervisorDashboard()
      .then(setData)
      .catch(() => setError("Failed to load dashboard. Please refresh."))
      .finally(() => setLoading(false));
  }, []);

  console.log("Dashboard data:", data);
  const stats = data?.stats ?? {
    activeGroups: 0,
    pendingRequests: 0,
    upcomingMeetings: 0,
    totalStudents: 0,
  };

  const activeProjects: ActiveProject[] = data?.activeProjects ?? [];

  const deadlines: DeadlineStyled[] = (data?.upcomingDeadlines ?? []).map(
    styleDeadline,
  );

  const meetings: MeetingStyled[] = (data?.upcomingMeetings ?? []).map(
    styleMeeting,
  );

  if (error) {
    return (
      <div className={styles.container}>
        <SSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
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
      <SSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>

      <div className={styles.main}>
        <Header title="Dashboard" subtitle="Welcome back" />

        <div className={styles.content}>
          {/* ── Stats ── */}
          <div className={styles.statsGrid}>
            {loading ? (
              <>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className={styles.skeletonCard}>
                    <Skeleton height="80px" />
                  </div>
                ))}
              </>
            ) : (
              <>
                <StatsCard
                  value={stats.activeGroups}
                  label="Active Groups"
                  icon={<LuUsers />}
                  bgColor="#EFF6FF"
                  iconColor="#0D3CCF"
                />
                <StatsCard
                  value={stats.pendingRequests}
                  label="Pending Requests"
                  icon={<LuMessageSquareText />}
                  bgColor="#FEF2F2"
                  iconColor="#DC2626"
                />
                <StatsCard
                  value={stats.upcomingMeetings}
                  label="Upcoming Meetings"
                  icon={<LuCalendar />}
                  bgColor="#F0FDF4"
                  iconColor="#16A34A"
                />
                <StatsCard
                  value={stats.totalStudents}
                  label="Total Students"
                  icon={<LuUserCheck />}
                  bgColor="#FFF7ED"
                  iconColor="#F59E0B"
                />
              </>
            )}
          </div>

          {/* ── Active Projects ── */}
          <div className={styles.section}>
            <div className={styles.projectsTopLine}>
              <p className={styles.sectionTitle}>Active Projects</p>
              <Link to="/supervisor/projects" className={styles.viewAll}>
                View All &gt;
              </Link>
            </div>

            {loading ? (
              <div className={styles.projectsGrid}>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className={styles.projectCard}>
                    <Skeleton height="100px" />
                  </div>
                ))}
              </div>
            ) : activeProjects.length === 0 ? (
              <div className={styles.emptyState}>
                <LuBookOpen className={styles.emptyIcon} />
                <p className={styles.emptyText}>No active projects yet</p>
              </div>
            ) : (
              <div className={styles.projectsGrid}>
                {activeProjects.map((project) => (
                  <div
                    key={project.id}
                    className={styles.projectCard}
                    onClick={() =>
                      navigate(`/supervisor/projects/${project.id}`)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <div className={styles.cardIcons}>
                      <div className={styles.bookIconWrapper}>
                        <LuBookOpen className={styles.bookIcon} />
                      </div>
                      <div className={styles.tickIconWrapper}>
                        <LuCircleCheck className={styles.tickIcon} />
                      </div>
                    </div>

                    <div className={styles.projectName}>
                      <p>{project.projectTitle}</p>
                    </div>

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
            )}
          </div>

          {/* ── Two column: Deadlines + Meetings ── */}
          <div className={styles.twoColumnSection}>
            {/* Deadlines */}
            <div className={styles.column}>
              <p className={styles.sectionTitle}>Upcoming Deadlines</p>

              {loading ? (
                <div className={styles.skeletonBlock}>
                  <Skeleton height="80px" radius="10px" />
                  <Skeleton height="80px" radius="10px" />
                  <Skeleton height="80px" radius="10px" />
                </div>
              ) : deadlines.length === 0 ? (
                <div className={styles.emptyState}>
                  <LuFlag className={styles.emptyIcon} />
                  <p className={styles.emptyText}>No upcoming deadlines</p>
                </div>
              ) : (
                deadlines.map((item) => (
                  <div
                    key={item.id}
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
                      <div className={styles.taskTitle}>
                        {item.deadlineType}
                      </div>
                    </div>
                    {item.description && (
                      <div className={styles.taskSub}>{item.description}</div>
                    )}
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
                ))
              )}
            </div>

            {/* Meetings */}
            <div className={styles.column}>
              <div className={styles.projectsTopLine}>
                <p className={styles.sectionTitle}>Upcoming Meetings</p>
                <Link to="/supervisor/meetings" className={styles.viewAll}>
                  View All &gt;
                </Link>
              </div>

              {loading ? (
                <div className={styles.skeletonBlock}>
                  <Skeleton height="80px" radius="10px" />
                  <Skeleton height="80px" radius="10px" />
                  <Skeleton height="80px" radius="10px" />
                </div>
              ) : meetings.length === 0 ? (
                <div className={styles.emptyState}>
                  <LuCalendar className={styles.emptyIcon} />
                  <p className={styles.emptyText}>No upcoming meetings</p>
                </div>
              ) : (
                meetings.map((item) => (
                  <div
                    key={item.id}
                    className={styles.taskCard}
                    style={item.projectId ? { cursor: "pointer" } : {}}
                    onClick={() => {
                      if (item.projectId) {
                        navigate(`/supervisor/projects/${item.projectId}`);
                      }
                    }}
                  >
                    <div className={styles.meetingTop}>
                      <div className={styles.meetingIcon}>
                        <LuCalendar />
                      </div>
                      <div className={styles.taskTitle}>{item.meetingType}</div>
                    </div>
                    <div className={styles.taskSub}>{item.projectName}</div>
                    <div className={styles.meetingTime}>
                      <div>
                        <LuClock />
                      </div>
                      <div>{item.dueLabel}</div>
                    </div>
                    {item.meetingUrl && (
                      <a
                        href={item.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.joinLink}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Join Meeting →
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SDashboard;
