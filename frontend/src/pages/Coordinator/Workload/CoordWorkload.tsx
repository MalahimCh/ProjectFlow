import CoordSidebar from "../Sidebar/CoordSidebar";
import { type FC, useMemo, useState } from "react";
import styles from "./CoordWorkload.module.css";
import Header from "../../../components/Header/Header";
import StatsCard from "../../../components/StatsCard/StatsCard";
import {
  LuUsers,
  LuSearch,
  LuTriangleAlert,
  LuCircleCheck,
  LuChevronDown,
  LuChevronUp,
  LuFolderOpen,
} from "react-icons/lu";

interface Project {
  id: number;
  title: string;
  scope: "Low" | "Medium" | "High";
}

interface Supervisor {
  id: number;
  name: string;
  workload: number; // out of 4
  projects: Project[];
}

const CoordWorkload: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [expandedSupervisor, setExpandedSupervisor] = useState<number | null>(
    null,
  );

  const supervisors: Supervisor[] = [
    {
      id: 1,
      name: "Dr. Ahmed Khan",
      workload: 4,
      projects: [
        { id: 1, title: "ProjectFlow", scope: "High" },
        { id: 2, title: "AI Attendance System", scope: "Medium" },
        { id: 3, title: "Smart Parking Solution", scope: "Medium" },
        { id: 4, title: "Crop Disease Detection", scope: "High" },
      ],
    },
    {
      id: 2,
      name: "Dr. Sara Ali",
      workload: 3,
      projects: [
        { id: 5, title: "Medical Diagnosis Assistant", scope: "High" },
        { id: 6, title: "Face Recognition Security", scope: "Medium" },
        { id: 7, title: "E-Learning Portal", scope: "Low" },
      ],
    },
    {
      id: 3,
      name: "Dr. Bilal Hassan",
      workload: 1,
      projects: [{ id: 8, title: "Blockchain Voting System", scope: "High" }],
    },
    {
      id: 4,
      name: "Dr. Ayesha Malik",
      workload: 0,
      projects: [],
    },
  ];

  const filteredSupervisors = supervisors.filter((supervisor) =>
    supervisor.name.toLowerCase().includes(search.toLowerCase()),
  );

  const stats = useMemo(() => {
    const total = supervisors.length;
    const fullyAllocated = supervisors.filter((s) => s.workload === 4).length;
    const available = supervisors.filter((s) => s.workload < 4).length;
    const overloaded = supervisors.filter((s) => s.workload >= 4).length;

    return {
      total,
      fullyAllocated,
      available,
      overloaded,
    };
  }, [supervisors]);

  const getWorkloadClass = (workload: number) => {
    if (workload >= 4) return styles.workloadFull;
    if (workload >= 3) return styles.workloadHigh;
    if (workload >= 2) return styles.workloadMedium;
    return styles.workloadLow;
  };

  const getScopeClass = (scope: Project["scope"]) => {
    switch (scope) {
      case "High":
        return styles.scopeHigh;
      case "Medium":
        return styles.scopeMedium;
      default:
        return styles.scopeLow;
    }
  };

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
            <StatsCard
              value={stats.total}
              label="Supervisors"
              icon={<LuUsers />}
              bgColor="#EFF6FF"
              iconColor="#0D3CCF"
            />
            <StatsCard
              value={stats.available}
              label="Available"
              icon={<LuCircleCheck />}
              bgColor="#F0FDF4"
              iconColor="#16A34A"
            />
            <StatsCard
              value={stats.overloaded}
              label="At Capacity"
              icon={<LuTriangleAlert />}
              bgColor="#FEE2E2"
              iconColor="#DC2626"
            />
          </div>

          {/* Search */}
          <div className={styles.searchBar}>
            <LuSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search supervisor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Supervisor Cards */}
          <div className={styles.supervisorList}>
            {filteredSupervisors.map((supervisor) => {
              const isExpanded = expandedSupervisor === supervisor.id;

              return (
                <div key={supervisor.id} className={styles.supervisorCard}>
                  <div
                    className={styles.supervisorHeader}
                    onClick={() =>
                      setExpandedSupervisor(isExpanded ? null : supervisor.id)
                    }
                  >
                    <div className={styles.supervisorInfo}>
                      <h3>{supervisor.name}</h3>
                      <p>
                        {supervisor.projects.length} assigned project
                        {supervisor.projects.length !== 1 ? "s" : ""}
                      </p>
                    </div>

                    <div className={styles.rightSection}>
                      <div className={styles.workloadWrapper}>
                        <span className={styles.workloadText}>
                          {supervisor.workload}/4
                        </span>
                        <div className={styles.progressBar}>
                          <div
                            className={`${styles.progressFill} ${getWorkloadClass(
                              supervisor.workload,
                            )}`}
                            style={{
                              width: `${(supervisor.workload / 4) * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      <button className={styles.expandBtn}>
                        {isExpanded ? <LuChevronUp /> : <LuChevronDown />}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className={styles.projectSection}>
                      {supervisor.projects.length > 0 ? (
                        <div className={styles.projectList}>
                          {supervisor.projects.map((project) => (
                            <div
                              key={project.id}
                              className={styles.projectItem}
                            >
                              <div className={styles.projectInfo}>
                                <LuFolderOpen />
                                <span>{project.title}</span>
                              </div>

                              <span
                                className={`${styles.scopeBadge} ${getScopeClass(
                                  project.scope,
                                )}`}
                              >
                                {project.scope} Scope
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className={styles.emptyProjects}>
                          No projects assigned.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoordWorkload;
