import SSidebar from "../Sidebar/Ssidebar";
import { type FC, useState, useEffect } from "react";
import styles from "./SProjects.module.css";
import Header from "../../../components/Header/Header";
import StatsCard from "../../../components/StatsCard/StatsCard";
import { LuUsers, LuClock, LuCircleAlert, LuBookOpen } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import {
  fetchSupervisorProjects,
  type SupervisedProject,
  type ProjectsStats,
} from "../../../services/supervisorService";

/* ── Helpers ───────────────────────────────────────────────── */

const getProgressColor = (progress: number): string => {
  if (progress < 50) return "#DC2626";
  if (progress <= 75) return "#F59E0B";
  return "#16A34A";
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

const SProjects: FC = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [projects, setProjects] = useState<SupervisedProject[]>([]);
  const [stats, setStats] = useState<ProjectsStats>({
    totalGroups: 0,
    totalStudents: 0,
    upcomingDeadlines: 0,
    laggingGroups: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSupervisorProjects()
      .then((data) => {
        setStats(data.stats);
        setProjects(data.projects);
      })
      .catch(() => setError("Failed to load projects. Please refresh."))
      .finally(() => setLoading(false));
  }, []);
  console.log(projects);
  return (
    <div className={styles.container}>
      <SSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>

      <div className={styles.main}>
        <Header title="Projects" subtitle="View and manage your projects" />

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
                  value={stats.totalGroups}
                  label="Total Groups"
                  icon={<LuUsers />}
                  bgColor="#EFF6FF"
                  iconColor="#0D3CCF"
                />
                <StatsCard
                  value={stats.totalStudents}
                  label="Total Students"
                  icon={<LuUsers />}
                  bgColor="#F0FDF4"
                  iconColor="#16A34A"
                />
                <StatsCard
                  value={stats.upcomingDeadlines}
                  label="Upcoming Deadlines"
                  icon={<LuClock />}
                  bgColor="#FFF7ED"
                  iconColor="#F59E0B"
                />
                <StatsCard
                  value={stats.laggingGroups}
                  label="Lagging Groups"
                  icon={<LuCircleAlert />}
                  bgColor="#FEF2F2"
                  iconColor="#DC2626"
                />
              </>
            )}
          </div>

          {/* ── Projects Grid ── */}
          <div className={styles.sectionHeader}>
            <div className={styles.titleRow}>
              <p className={styles.title}>All Supervised Groups</p>
              {!loading && (
                <span className={styles.activeBadge}>
                  {stats.totalGroups} Active Groups
                </span>
              )}
            </div>

            {error && <div className={styles.errorState}>{error}</div>}

            {loading ? (
              <div className={styles.projectGrid}>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className={styles.projectCard}>
                    <Skeleton height="180px" radius="8px" />
                  </div>
                ))}
              </div>
            ) : projects.length === 0 && !error ? (
              <div className={styles.emptyState}>
                <LuBookOpen size={32} color="#D1D5DB" />
                <p className={styles.emptyText}>No projects yet.</p>
                <p className={styles.emptySubtext}>
                  Projects will appear here once a supervisor request is
                  accepted.
                </p>
              </div>
            ) : (
              <div className={styles.projectGrid}>
                {projects.map((project) => {
                  const memberCount =
                    project.group?.memberCount ?? project.members;

                  return (
                    <div key={project.id} className={styles.projectCard}>
                      <div className={styles.cardHeader}>
                        <div className={styles.groupIcon}>
                          <LuUsers />
                        </div>
                        <div className={styles.groupMeta}>
                          {/* ✅ was project.groupName */}
                          <h3>{project.group?.name ?? "Unknown Group"}</h3>
                          <span>
                            {memberCount} Member{memberCount !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>

                      {/* ✅ was project.projectName */}
                      <p className={styles.projectName}>{project.title}</p>

                      {project.deadline ? (
                        <div className={styles.deadlineBox}>
                          <div className={styles.deadlineHeader}>
                            <LuClock className={styles.clockIcon} />
                            <span className={styles.deadlineType}>
                              {project.deadline.type}
                            </span>
                            <span className={styles.daysBadge}>
                              {project.deadline.daysLeft === 0
                                ? "Due today"
                                : `${project.deadline.daysLeft} day${project.deadline.daysLeft !== 1 ? "s" : ""} left`}
                            </span>
                          </div>
                          <p className={styles.dueTime}>
                            Due: {project.deadline.dueDate} at{" "}
                            {project.deadline.time}
                          </p>
                        </div>
                      ) : (
                        <div className={styles.noDeadline}>
                          No upcoming deadlines
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
                              backgroundColor: getProgressColor(
                                project.progress,
                              ),
                            }}
                          />
                        </div>
                      </div>

                      <div className={styles.cardFooter}>
                        <button
                          onClick={() => navigate(`/projects/${project.id}`)}
                          className={styles.viewDetails}
                        >
                          View Details &gt;
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SProjects;
