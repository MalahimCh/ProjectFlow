import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import styles from "./ProjectDetails.module.css";
import SSidebar from "../Sidebar/Ssidebar";
import Header from "../../../components/Header/Header";

const ProjectDetails = () => {
  const { projectId: _projectId } = useParams();
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<"stream" | "work" | "grade">(
    "stream",
  );

  const project = {
    name: "AI-Based Healthcare Diagnosis System",
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
  };
  return (
    <div className={styles.container}>
      <SSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={styles.main}>
        <Header
          title="Projects"
          subtitle="View and manage your projects"
          userName="Muhammad Kamran"
          userId="SP2024001"
        />

        <div className={styles.content}>
          <div className={styles.content}>
            {/* Project Overview Card */}
            <section className={styles.overviewCard}>
              <div className={styles.overviewHeader}>
                <div>
                  <p className={styles.overviewLabel}>Final Year Project</p>
                  <h1 className={styles.projectTitle}>{project.name}</h1>
                </div>
                <div className={styles.progressBadge}>
                  {project.progress}% Complete
                </div>
              </div>

              <div className={styles.projectMeta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Team Members</span>
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
                  <span>{project.progress}%</span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </section>

            {/* Tabs Navigation */}
            <nav className={styles.tabsWrapper}>
              <button
                className={
                  activeTab === "stream" ? styles.activeTab : styles.tab
                }
                onClick={() => setActiveTab("stream")}
              >
                Stream
              </button>
              <button
                className={activeTab === "work" ? styles.activeTab : styles.tab}
                onClick={() => setActiveTab("work")}
              >
                Work
              </button>
              <button
                className={
                  activeTab === "grade" ? styles.activeTab : styles.tab
                }
                onClick={() => setActiveTab("grade")}
              >
                Grades
              </button>
            </nav>

            {/* Tab Content */}
            <section className={styles.tabContent}>
              {/* STREAM TAB */}
              {activeTab === "stream" && (
                <div className={styles.streamGrid}>
                  <aside className={styles.streamSidebar}>
                    <div className={styles.card}>
                      <h3 className={styles.cardTitle}>Upcoming</h3>
                      <p className={styles.upcomingTitle}>Progress Report</p>
                      <p className={styles.upcomingDate}>Due Mar 20, 2026</p>
                      <button className={styles.linkButton}>
                        View Details
                      </button>
                    </div>
                  </aside>

                  <div className={styles.streamFeed}>
                    <div className={styles.shareBox}>
                      📝 Share an update with your team
                    </div>

                    <article className={styles.postCard}>
                      <div className={styles.postHeader}>
                        <div className={styles.avatar}>MK</div>
                        <div>
                          <h4 className={styles.postAuthor}>Muhammad Kamran</h4>
                          <p className={styles.postDate}>Today at 9:30 AM</p>
                        </div>
                      </div>

                      <div className={styles.postContent}>
                        <h5>Final Year Project - Important Deadlines Update</h5>
                        <p>
                          Please note the following critical deadlines: Final
                          documentation due May 10, Project presentations May
                          15–17.
                        </p>
                      </div>

                      <button className={styles.replyButton}>↩ Reply</button>
                    </article>
                  </div>
                </div>
              )}

              {/* WORK TAB */}
              {activeTab === "work" && (
                <div className={styles.workSections}>
                  <section className={styles.card}>
                    <h3 className={styles.cardTitle}>Proposals</h3>

                    <div className={styles.fileItem}>
                      <div>
                        <p className={styles.fileName}>
                          Project Proposal v3.pdf
                        </p>
                        <p className={styles.fileMeta}>
                          Last modified: Mar 10, 2026
                        </p>
                      </div>
                      <span className={styles.fileSize}>2.4 MB</span>
                    </div>

                    <div className={styles.fileItem}>
                      <div>
                        <p className={styles.fileName}>Initial Proposal.pdf</p>
                        <p className={styles.fileMeta}>
                          Last modified: Feb 5, 2026
                        </p>
                      </div>
                      <span className={styles.fileSize}>1.8 MB</span>
                    </div>
                  </section>

                  <section className={styles.card}>
                    <h3 className={styles.cardTitle}>Documents</h3>

                    <div className={styles.fileItem}>
                      <div>
                        <p className={styles.fileName}>
                          SRS_Document_Final.pdf
                        </p>
                        <p className={styles.fileMeta}>
                          Last modified: Mar 12, 2026
                        </p>
                      </div>
                      <span className={styles.fileSize}>3.2 MB</span>
                    </div>
                  </section>
                </div>
              )}

              {/* GRADE TAB */}
              {activeTab === "grade" && (
                <section className={styles.gradeCard}>
                  <table className={styles.gradeTable}>
                    <thead>
                      <tr>
                        <th>Team Member</th>
                        {[
                          "Proposal",
                          "SRS Doc",
                          "Mid-Term Pres.",
                          "Progress Report",
                          "Literature Review",
                        ].map((title, i) => (
                          <th key={i}>{title}</th>
                        ))}
                        <th>Average</th>
                      </tr>
                    </thead>
                    <tbody>
                      {project.grades.map((member, idx) => (
                        <tr key={idx}>
                          <td>
                            <div className={styles.memberInfo}>
                              <div className={styles.avatarSmall}>
                                {member.initials}
                              </div>
                              {member.name}
                            </div>
                          </td>

                          {member.scores.map((score, i) => (
                            <td key={i}>{score}</td>
                          ))}

                          <td>
                            <strong>{member.avg}</strong>
                            <span className={styles.gradeLabel}>
                              {member.grade}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
