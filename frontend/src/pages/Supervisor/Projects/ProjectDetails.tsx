import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./ProjectDetails.module.css";
import SSidebar from "../Sidebar/Ssidebar";
import StudSidebar from "../../Student/Sidebar/StudSidebar";
import Header from "../../../components/Header/Header";
import StreamTab from "./Tabs/StreamTab";
import WorkTab from "./Tabs/WorkTab";
import GradeTab from "./Tabs/GradeTab";

import api from "../../../services/api";

interface ProjectData {
  id: string;
  title: string;
  members: string;
  supervisor: string;
  deadline: string;
  progress: number;
  grades: {
    name: string;
    initials: string;
    scores: string[];
    avg: string;
    grade: string;
  }[];
}

interface Props {
  role?: "supervisor" | "student";
}

const isMobile = () =>
  typeof window !== "undefined" && window.innerWidth <= 767;

const ProjectDetails = ({ role = "supervisor" }: Props) => {
  const { projectId } = useParams<{ projectId: string }>();
  const [collapsed, setCollapsed] = useState(() => isMobile());
  const [activeTab, setActiveTab] = useState<"stream" | "work" | "grade">(
    "stream",
  );
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const Sidebar = role === "supervisor" ? SSidebar : StudSidebar;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 767) {
        setCollapsed(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!projectId) return;
    api
      .get(`/projects/${projectId}`)
      .then((r) => {
        const p = r.data.data;
        setProject({
          id: p.id,
          title: p.title,
          members:
            p.members?.map((m: { name: string }) => m.name).join(", ") || "",
          supervisor: p.supervisor?.name || "",
          deadline: p.deadline?.dueDate || "TBD",
          progress: p.progress ?? 0,
          grades: p.grades ?? [],
        });
      })
      .catch(() => {
        setProject({
          id: projectId,
          title: "AI-Based Healthcare Diagnosis System",
          members: "Malahim, Abdullah, Minahil",
          supervisor: "Muhammad Kamran",
          deadline: "May 17, 2026",
          progress: 65,
          grades: [
            {
              name: "Abdullah Tahir",
              initials: "AT",
              scores: ["88/100", "92/100", "82/100", "95/100", "90/100"],
              avg: "89.4",
              grade: "B+",
            },
            {
              name: "Malahim Chaudhary",
              initials: "MC",
              scores: ["85/100", "88/100", "78/100", "91/100", "86/100"],
              avg: "85.6",
              grade: "B+",
            },
            {
              name: "Minahil Mudassar",
              initials: "MM",
              scores: ["82/100", "85/100", "75/100", "90/100", "83/100"],
              avg: "83.0",
              grade: "B",
            },
          ],
        });
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  const tabs =
    role === "supervisor"
      ? (["stream", "work", "grade"] as const)
      : (["stream", "work"] as const);

  if (loading || !project) {
    return (
      <div className={styles.container}>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className={styles.main}>
          <Header title="Projects" subtitle="View and manage your projects" />
          <div className={styles.content}>
            <div className={styles.loadingState}>Loading project...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={styles.main}>
        <Header title="Projects" subtitle="View and manage your projects" />

        <div className={styles.content}>
          {/* Overview Card */}
          <div className={styles.overviewCard}>
            <p className={styles.projectTitle}>{project.title}</p>
            <div className={styles.projectMeta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Members</span>
                <span className={styles.metaValue}>{project.members}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Supervisor</span>
                <span className={styles.metaValue}>{project.supervisor}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Deadline</span>
                <span className={styles.metaValue}>{project.deadline}</span>
              </div>
            </div>
            <div className={styles.progressSection}>
              <div className={styles.progressInfo}>
                <span>Overall Progress</span>
                <span className={styles.progressPercent}>
                  {project.progress}%
                </span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className={styles.tabsWrapper}>
            {tabs.map((tab) => (
              <button
                key={tab}
                className={activeTab === tab ? styles.activeTab : styles.tab}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Panels */}
          {activeTab === "stream" && (
            <StreamTab projectId={project.id} role={role} />
          )}

          {activeTab === "work" && (
            <WorkTab projectId={project.id} role={role} />
          )}

          {activeTab === "grade" && role === "supervisor" && (
            <GradeTab grades={project.grades} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;