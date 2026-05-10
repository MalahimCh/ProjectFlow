import CoordSidebar from "../Sidebar/CoordSidebar";
import { type FC, useState } from "react";
import styles from "./CoordProjects.module.css";
import Header from "../../../components/Header/Header";
import StatsCard from "../../../components/StatsCard/StatsCard";
import {
  LuUsers,
  LuMessageSquareText,
  LuCalendar,
  LuBookOpen,
  LuSearch,
  LuFileText,
  LuClipboardList,
  LuAward,
  LuX,
} from "react-icons/lu";

type Project = {
  id: number;
  title: string;
  supervisor: string;
  progress: number;
  proposal: string;
  reports: string[];
  evaluations: {
    title: string;
    feedback: string;
    grade: string;
  }[];
};

const projectsData: Project[] = [
  {
    id: 1,
    title: "AI-Based Satellite Image Super Resolution",
    supervisor: "Dr. Ahmed Khan",
    progress: 72,
    proposal:
      "This project aims to enhance low-resolution satellite imagery using deep learning models such as ESRGAN.",
    reports: [
      "Completed literature review.",
      "Implemented baseline ESRGAN model.",
      "Currently optimizing model for large image patches.",
    ],
    evaluations: [
      {
        title: "Proposal Defense",
        feedback: "Strong problem statement and motivation.",
        grade: "8.5 / 10",
      },
      {
        title: "Progress Review 1",
        feedback: "Good technical progress. Improve results visualization.",
        grade: "17 / 20",
      },
    ],
  },
  {
    id: 2,
    title: "ProjectFlow - FYP Management System",
    supervisor: "Dr. Sana Tariq",
    progress: 88,
    proposal:
      "A web-based platform to streamline project allocation, evaluations, and communication.",
    reports: [
      "Completed frontend implementation.",
      "Designed database schema.",
      "Backend APIs in progress.",
    ],
    evaluations: [
      {
        title: "Proposal Defense",
        feedback: "Excellent and practical idea.",
        grade: "9 / 10",
      },
      {
        title: "Progress Review 1",
        feedback: "UI is polished and well-structured.",
        grade: "18 / 20",
      },
    ],
  },
  {
    id: 3,
    title: "Smart Attendance System",
    supervisor: "Dr. Bilal Raza",
    progress: 45,
    proposal:
      "Facial recognition-based attendance system integrated with classroom cameras.",
    reports: [
      "Dataset collection completed.",
      "Face encoding module implemented.",
    ],
    evaluations: [
      {
        title: "Proposal Defense",
        feedback: "Feasible but requires strong privacy measures.",
        grade: "7.5 / 10",
      },
    ],
  },
];

const CoordProjects: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<
    "proposal" | "reports" | "evaluations"
  >("proposal");

  const filteredProjects = projectsData.filter(
    (project) =>
      project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.supervisor.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className={styles.container}>
      <CoordSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={styles.main}>
        <Header
          title="Projects"
          subtitle="Manage and monitor all FYP projects"
          userName="Junaid Hussain"
          userId="CO2024001"
        />

        <div className={styles.content}>
          {/* Stats */}
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

          {/* Search */}
          <div className={styles.searchBox}>
            <LuSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search projects or supervisors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Projects Table */}
          <div className={styles.tableCard}>
            <table className={styles.projectsTable}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Supervisor</th>
                  <th>Progress</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project.id}>
                    <td>{project.title}</td>
                    <td>{project.supervisor}</td>
                    <td>
                      <div className={styles.progressWrapper}>
                        <div className={styles.progressBar}>
                          <div
                            className={styles.progressFill}
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span>{project.progress}%</span>
                      </div>
                    </td>
                    <td>
                      <button
                        className={styles.viewBtn}
                        onClick={() => {
                          setSelectedProject(project);
                          setActiveTab("proposal");
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Project Details */}
          {selectedProject && (
            <div className={styles.detailsCard}>
              <div className={styles.detailsHeader}>
                <div>
                  <h2>{selectedProject.title}</h2>
                  <p>Supervisor: {selectedProject.supervisor}</p>
                </div>

                <button
                  className={styles.closeBtn}
                  onClick={() => setSelectedProject(null)}
                >
                  <LuX />
                </button>
              </div>

              {/* Tabs */}
              <div className={styles.tabs}>
                <button
                  className={activeTab === "proposal" ? styles.activeTab : ""}
                  onClick={() => setActiveTab("proposal")}
                >
                  <LuFileText />
                  Proposal
                </button>

                <button
                  className={activeTab === "reports" ? styles.activeTab : ""}
                  onClick={() => setActiveTab("reports")}
                >
                  <LuClipboardList />
                  Progress Reports
                </button>

                <button
                  className={
                    activeTab === "evaluations" ? styles.activeTab : ""
                  }
                  onClick={() => setActiveTab("evaluations")}
                >
                  <LuAward />
                  Evaluations
                </button>
              </div>

              <div className={styles.tabContent}>
                {activeTab === "proposal" && <p>{selectedProject.proposal}</p>}

                {activeTab === "reports" && (
                  <ul className={styles.reportList}>
                    {selectedProject.reports.map((report, index) => (
                      <li key={index}>{report}</li>
                    ))}
                  </ul>
                )}

                {activeTab === "evaluations" && (
                  <div className={styles.evaluations}>
                    {selectedProject.evaluations.map((evaluation, index) => (
                      <div key={index} className={styles.evaluationCard}>
                        <h4>{evaluation.title}</h4>
                        <p>{evaluation.feedback}</p>
                        <span>{evaluation.grade}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoordProjects;
