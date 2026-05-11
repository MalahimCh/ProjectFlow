import CoordSidebar from "../Sidebar/CoordSidebar";
import { type FC, useMemo, useState, useRef, useEffect } from "react";
import styles from "./CoordWorkload.module.css";
import Header from "../../../components/Header/Header";
import StatsCard from "../../../components/StatsCard/StatsCard";
import { LuUsers, LuSearch, LuTriangleAlert, LuCircleCheck, LuChevronDown, LuChevronUp, LuFilter, LuCheck, LuX, LuFolderOpen } from "react-icons/lu";

interface Project {
  id: number;
  title: string;
  progress: number;
  domain: string;
}

interface Supervisor {
  id: number;
  name: string;
  workload: number;
  projects: Project[];
}

type WorkloadFilter = "All" | "Available" | "At Capacity";

const getInitials = (name: string) =>
  name
    .replace(/^Dr\.\s*/i, "")
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const getWorkloadColor = (workload: number) => {
  if (workload <= 1) return "#16A34A";
  if (workload <= 3) return "#F59E0B";
  return "#DC2626";
};

const getProgressColor = (progress: number) => {
  if (progress < 50) return "#DC2626";
  if (progress < 75) return "#F59E0B";
  return "#16A34A";
};

const supervisors: Supervisor[] = [
  {
    id: 1,
    name: "Dr. Ahmed Khan",
    workload: 4,
    projects: [
      { id: 1, title: "ProjectFlow",            progress: 72, domain: "Web Engineering" },
      { id: 2, title: "AI Attendance System",   progress: 55, domain: "Artificial Intelligence" },
      { id: 3, title: "Smart Parking Solution", progress: 38, domain: "IoT" },
      { id: 4, title: "Crop Disease Detection", progress: 81, domain: "Machine Learning" },
    ],
  },
  {
    id: 2,
    name: "Dr. Sara Ali",
    workload: 3,
    projects: [
      { id: 5, title: "Medical Diagnosis Assistant", progress: 60, domain: "AI / Healthcare" },
      { id: 6, title: "Face Recognition Security",   progress: 45, domain: "Computer Vision" },
      { id: 7, title: "E-Learning Portal",           progress: 88, domain: "Web Engineering" },
    ],
  },
  {
    id: 3,
    name: "Dr. Bilal Hassan",
    workload: 1,
    projects: [
      { id: 8, title: "Blockchain Voting System", progress: 30, domain: "Blockchain" },
    ],
  },
  {
    id: 4,
    name: "Dr. Ayesha Malik",
    workload: 0,
    projects: [],
  },
];

const FILTER_OPTIONS: WorkloadFilter[] = ["All", "Available", "At Capacity"];

const CoordWorkload: FC = () => {
  const [collapsed, setCollapsed]           = useState(false);
  const [search, setSearch]                 = useState("");
  const [filterOpen, setFilterOpen]         = useState(false);
  const [workloadFilter, setWorkloadFilter] = useState<WorkloadFilter>("All");
  const [expandedSupervisor, setExpandedSupervisor] = useState<number | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node))
        setFilterOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredSupervisors = useMemo(() =>
    supervisors.filter((s) => {
      const q = search.toLowerCase();
      const matchesSearch = !q || s.name.toLowerCase().includes(q);
      const matchesFilter =
        workloadFilter === "All" ||
        (workloadFilter === "Available"   && s.workload < 4) ||
        (workloadFilter === "At Capacity" && s.workload >= 4);
      return matchesSearch && matchesFilter;
    }),
  [search, workloadFilter]);

  const stats = useMemo(() => ({
    total:     supervisors.length,
    available: supervisors.filter((s) => s.workload < 4).length,
    overloaded: supervisors.filter((s) => s.workload >= 4).length,
  }), []);

  const activeFilterCount = workloadFilter !== "All" ? 1 : 0;

  return (
    <div className={styles.container}>
      <CoordSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={styles.main}>
        <Header
          title="Supervisor Workload"
          subtitle="Monitor supervisor capacity and assigned projects"
          userName="Junaid Hussain"
          userId="CO2024001"
        />

        <div className={styles.content}>

          {/* Stats */}
          <div className={styles.statsGrid}>
            <StatsCard value={stats.total}      label="Total Supervisors" icon={<LuUsers />}         bgColor="#EFF6FF" iconColor="#0D3CCF" />
            <StatsCard value={stats.available}  label="Available"         icon={<LuCircleCheck />}   bgColor="#F0FDF4" iconColor="#16A34A" />
            <StatsCard value={stats.overloaded} label="At Capacity"       icon={<LuTriangleAlert />} bgColor="#FEF2F2" iconColor="#DC2626" />
          </div>

          {/* Search + Filter bar — FindTeam style */}
          <div className={styles.topBar}>
            <div className={styles.filterWrapper} ref={filterRef}>
              <button
                className={styles.filterBtn}
                onClick={() => setFilterOpen((p) => !p)}
              >
                <LuFilter size={14} />
                Filter
                {activeFilterCount > 0 && (
                  <span className={styles.filterBadge}>{activeFilterCount}</span>
                )}
                <LuChevronDown size={13} />
              </button>

              {filterOpen && (
                <div className={styles.filterDropdown}>
                  <div className={styles.filterSection}>
                    <p className={styles.filterLabel}>Workload Status</p>
                    {FILTER_OPTIONS.map((opt) => (
                      <div
                        key={opt}
                        className={styles.filterOption}
                        onClick={() => { setWorkloadFilter(opt); setFilterOpen(false); }}
                      >
                        <div className={`${styles.checkbox} ${workloadFilter === opt ? styles.checkboxActive : ""}`}>
                          {workloadFilter === opt && <LuCheck size={10} />}
                        </div>
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                  {activeFilterCount > 0 && (
                    <button
                      className={styles.clearBtn}
                      onClick={() => { setWorkloadFilter("All"); setFilterOpen(false); }}
                    >
                      <LuX size={12} /> Clear filters
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className={styles.barDivider} />

            <div className={styles.searchInner}>
              <LuSearch size={15} color="#9CA3AF" />
              <input
                type="text"
                placeholder="Search by supervisor name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Supervisor cards */}
          <div className={styles.supervisorList}>
            {filteredSupervisors.length === 0 ? (
              <div className={styles.emptyState}>
                <LuSearch size={26} color="#D1D5DB" />
                <p className={styles.emptyText}>No supervisors found</p>
                <p className={styles.emptySub}>Try adjusting your search or filters.</p>
              </div>
            ) : (
              filteredSupervisors.map((supervisor) => {
                const isExpanded = expandedSupervisor === supervisor.id;
                const wColor     = getWorkloadColor(supervisor.workload);

                return (
                  <div key={supervisor.id} className={styles.supervisorCard}>

                    <div
                      className={styles.supervisorHeader}
                      onClick={() =>
                        setExpandedSupervisor(isExpanded ? null : supervisor.id)
                      }
                    >
                      {/* Initials avatar */}
                      <div className={styles.avatar}>
                        {getInitials(supervisor.name)}
                      </div>

                      {/* Name + subtitle */}
                      <div className={styles.supervisorInfo}>
                        <p className={styles.supervisorName}>{supervisor.name}</p>
                        <p className={styles.supervisorSub}>
                          {supervisor.projects.length} assigned project{supervisor.projects.length !== 1 ? "s" : ""}
                        </p>
                      </div>

                      {/* Workload pill — no progress bar */}
                      <div
                        className={styles.workloadPill}
                        style={{
                          background: wColor + "1A",
                          color: wColor,
                          border: `1px solid ${wColor}40`,
                        }}
                      >
                        {supervisor.workload} / 4 Groups
                      </div>

                      <button className={styles.expandBtn}>
                        {isExpanded ? <LuChevronUp size={16} /> : <LuChevronDown size={16} />}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className={styles.projectSection}>
                        {supervisor.projects.length === 0 ? (
                          <div className={styles.emptyProjects}>
                            No projects assigned yet.
                          </div>
                        ) : (
                          <div className={styles.projectList}>
                            {supervisor.projects.map((project) => {
                              const pColor = getProgressColor(project.progress);
                              return (
                                <div key={project.id} className={styles.projectItem}>
                                  <div className={styles.projectLeft}>
                                    <div className={styles.projectInfo}>
                                      <LuFolderOpen size={14} className={styles.folderIcon} />
                                      <p className={styles.projectTitle}>{project.title}</p>
                                    </div>
                                    <p className={styles.projectDomain}>{project.domain}</p>
                                  </div>

                                  <div className={styles.projectRight}>
                                    <div className={styles.progressRow}>
                                      <span className={styles.progressLabel}>Progress</span>
                                      <span className={styles.progressPct} style={{ color: pColor }}>
                                        {project.progress}%
                                      </span>
                                    </div>
                                    <div className={styles.progressBar}>
                                      <div
                                        className={styles.progressFill}
                                        style={{
                                          width: `${project.progress}%`,
                                          backgroundColor: pColor,
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoordWorkload;