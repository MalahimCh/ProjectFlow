import { type FC, useMemo, useState } from "react";
import CoordSidebar from "../Coordinator/Sidebar/CoordSidebar";
import SSidebar from "../Supervisor/Sidebar/Ssidebar";
import StudSidebar from "../Student/Sidebar/StudSidebar";
import Header from "../../components/Header/Header";
import {
  LuSearch,
  LuInfo,
  LuStar,
  LuUser,
  LuUsers,
  LuBookOpen,
} from "react-icons/lu";
import styles from "./Repository.module.css";

type UserRole = "coordinator" | "supervisor" | "student";

type Project = {
  id: number;
  title: string;
  description: string;
  domain: string;
  supervisor: string;
  students: string[];
  technologies: string[];
  year: string;
  rating: number;
};

const Repository: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Change this to test different sidebars
  const role: UserRole = "coordinator";

  // Hardcoded project data
  const projects: Project[] = [
    {
      id: 1,
      title: "AI-Based Satellite Image Super Resolution",
      description:
        "Enhances low-resolution satellite images using ESRGAN and deep learning.",
      domain: "Artificial Intelligence",
      supervisor: "Dr. Ahmed Khan",
      students: ["Ali Raza", "Hamza Tariq"],
      technologies: ["Python", "TensorFlow", "OpenCV", "ESRGAN"],
      year: "2025",
      rating: 4.8,
    },
    {
      id: 2,
      title: "ProjectFlow",
      description:
        "Web application to streamline the FYP process for students and faculty.",
      domain: "Web Development",
      supervisor: "Dr. Sana Malik",
      students: ["Junaid Hussain"],
      technologies: ["React", "Node.js", "Express", "MongoDB"],
      year: "2026",
      rating: 4.9,
    },
    {
      id: 3,
      title: "Smart Attendance System",
      description:
        "Face recognition-based attendance system for university classrooms.",
      domain: "Computer Vision",
      supervisor: "Dr. Bilal Aslam",
      students: ["Usman Tariq", "Hassan Shah"],
      technologies: ["Python", "OpenCV", "Flask"],
      year: "2024",
      rating: 4.6,
    },
    {
      id: 4,
      title: "Blockchain Voting Platform",
      description: "Secure and transparent voting system built on blockchain.",
      domain: "Blockchain",
      supervisor: "Dr. Fatima Noor",
      students: ["Areeba Khan", "Zain Ali"],
      technologies: ["Solidity", "React", "Ethereum"],
      year: "2025",
      rating: 4.7,
    },
  ];

  const renderSidebar = () => {
    switch (role) {
      case "student":
        return (
          <StudSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        );
      case "supervisor":
        return <SSidebar collapsed={collapsed} setCollapsed={setCollapsed} />;
      case "coordinator":
      default:
        return (
          <CoordSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        );
    }
  };

  const filteredProjects = useMemo(() => {
    const query = search.toLowerCase();

    return projects.filter(
      (project) =>
        project.title.toLowerCase().includes(query) ||
        project.domain.toLowerCase().includes(query) ||
        project.supervisor.toLowerCase().includes(query),
    );
  }, [search]);

  return (
    <div className={styles.container}>
      {renderSidebar()}

      <div className={styles.main}>
        <Header
          title="FYP Repository"
          subtitle="Browse previous Final Year Projects and ratings"
          userName="Junaid Hussain"
          userId="CO2024001"
        />

        <div className={styles.content}>
          {/* Search Bar */}
          <div className={styles.searchBar}>
            <LuSearch />
            <input
              type="text"
              placeholder="Search by title, domain, or supervisor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Projects Grid */}
          <div className={styles.grid}>
            {filteredProjects.map((project) => (
              <div key={project.id} className={styles.card}>
                <button
                  className={styles.infoButton}
                  onClick={() => setSelectedProject(project)}
                >
                  <LuInfo />
                </button>

                <h3>{project.title}</h3>
                <p className={styles.description}>{project.description}</p>

                <div className={styles.meta}>
                  <span className={styles.domain}>{project.domain}</span>

                  <div className={styles.rating}>
                    <LuStar />
                    {project.rating.toFixed(1)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal */}
          {selectedProject && (
            <div
              className={styles.overlay}
              onClick={() => setSelectedProject(null)}
            >
              <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={styles.modalHeader}>
                  <h2>{selectedProject.title}</h2>
                  <button onClick={() => setSelectedProject(null)}>×</button>
                </div>

                <p className={styles.modalDescription}>
                  {selectedProject.description}
                </p>

                <div className={styles.details}>
                  <div>
                    <LuBookOpen />
                    <span>Domain:</span>
                    <p>{selectedProject.domain}</p>
                  </div>

                  <div>
                    <LuUser />
                    <span>Supervisor:</span>
                    <p>{selectedProject.supervisor}</p>
                  </div>

                  <div>
                    <LuUsers />
                    <span>Students:</span>
                    <p>{selectedProject.students.join(", ")}</p>
                  </div>

                  <div>
                    <LuStar />
                    <span>Rating:</span>
                    <p>{selectedProject.rating.toFixed(1)} / 5.0</p>
                  </div>
                </div>

                <div className={styles.techSection}>
                  <h4>Technologies Used</h4>
                  <div className={styles.techTags}>
                    {selectedProject.technologies.map((tech) => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Repository;
