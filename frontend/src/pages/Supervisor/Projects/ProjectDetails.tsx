import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import styles from "./ProjectDetails.module.css";

const ProjectDetails = () => {
  const { projectId: _projectId } = useParams();
  const [activeTab, setActiveTab] = useState<"stream" | "work" | "grade">("stream");

  const project = {
    name: "AI-Based Healthcare Diagnosis System",
    members: "Malahim, Abdullah, Minahil",
    supervisor: "Muhammad Kamran",
    deadline: "May 17, 2026",
    progress: 65,
    grades: [
      { name: "Abdullah Tahir", initials: "AT", scores: ["88/100", "92/100", "82/100", "95/100", "90/100"], avg: "89.4", grade: "B+" },
      { name: "Malahim Chaudhary", initials: "MC", scores: ["85/100", "88/100", "78/100", "91/100", "86/100"], avg: "85.6", grade: "B+" },
      { name: "Minahil Mudassar", initials: "MM", scores: ["82/100", "85/100", "75/100", "90/100", "83/100"], avg: "83.0", grade: "B" }
    ]
  };

  return (
    <div className={styles.container}>
      {/* 🔷 Top Navigation */}
      <div className={styles.topNav}>
        <div className={styles.breadcrumb}>
          <span>Projects</span> <span className={styles.chevron}>&gt;</span> <span className={styles.currentProject}>Alpha Innovators</span>
        </div>
        <Link to="/projects" className={styles.backBtn}>Back to Projects</Link>
      </div>

      {/* 🔷 System Header */}
      <div className={styles.headerCard}>
        <h2 className={styles.systemTitle}>FYP Management System</h2>
        <div className={styles.headerGrid}>
          <div className={styles.gridItem}><label>Project</label><p>{project.name}</p></div>
          <div className={styles.gridItem}><label>Members</label><p>{project.members}</p></div>
          <div className={styles.gridItem}><label>Supervisor</label><p>{project.supervisor}</p></div>
          <div className={styles.gridItem}><label>Final Deadline</label><p>{project.deadline}</p></div>
        </div>
        <div className={styles.progressSection}>
          <div className={styles.progressText}><span>Overall Progress</span><span className={styles.percentText}>{project.progress}%</span></div>
          <div className={styles.progressTrack}><div className={styles.progressFill} style={{ width: `${project.progress}%` }}></div></div>
        </div>
      </div>

      {/* 🔷 Centered Tabs */}
      <div className={styles.tabWrapper}>
        <div className={styles.tabs}>
          <button className={activeTab === "stream" ? styles.activeTab : styles.tab} onClick={() => setActiveTab("stream")}>Stream</button>
          <div className={styles.tabDivider}></div>
          <button className={activeTab === "work" ? styles.activeTab : styles.tab} onClick={() => setActiveTab("work")}>Work</button>
          <div className={styles.tabDivider}></div>
          <button className={activeTab === "grade" ? styles.activeTab : styles.tab} onClick={() => setActiveTab("grade")}>Grade</button>
        </div>
      </div>

      {/* 🔷 Dynamic Content Area */}
      <div className={styles.contentArea}>
        
        {/* 📢 STREAM TAB */}
        {activeTab === "stream" && (
          <div className={styles.streamLayout}>
            <div className={styles.sidebar}>
              <div className={styles.upcomingCard}>
                <h3>Upcoming</h3>
                <p className={styles.taskTitle}>Progress Report</p>
                <p className={styles.taskDue}>Due Mar 20, 2026</p>
                <button className={styles.viewBtn}>View</button>
              </div>
            </div>
            <div className={styles.feed}>
              <div className={styles.shareBox}><span>📝</span> Share with your team</div>
              <div className={styles.postCard}>
                <div className={styles.postHeader}>
                  <div className={styles.avatar}>MK</div>
                  <div className={styles.meta}><strong>Muhammad Kamran</strong><span>Today at 9:30 AM</span></div>
                </div>
                <div className={styles.postBody}>
                  <p><strong>Final Year Project - Important Deadlines Update</strong></p>
                  <p>Please note the following critical deadlines: Final documentation due May 10, Project presentations May 15-17.</p>
                </div>
                <div className={styles.replyBar}><span>↩️</span> Reply</div>
              </div>
            </div>
          </div>
        )}

        {/* 📂 WORK TAB */}
        {activeTab === "work" && (
          <div className={styles.workLayout}>
            <div className={styles.workSection}>
              <h3>📄 Proposals</h3>
              <div className={styles.fileRow}>
                <div className={styles.fileInfo}>📄 Project Proposal v3.pdf<br/><span>Last modified: Mar 10, 2026</span></div>
                <span className={styles.fileSize}>2.4 MB</span>
              </div>
              <div className={styles.fileRow}>
                <div className={styles.fileInfo}>📄 Initial Proposal.pdf<br/><span>Last modified: Feb 5, 2026</span></div>
                <span className={styles.fileSize}>1.8 MB</span>
              </div>
            </div>
            <div className={styles.workSection}>
              <h3>📁 Documents</h3>
              <div className={styles.fileRow}>
                <div className={styles.fileInfo}>📄 SRS_Document_Final.pdf<br/><span>Last modified: Mar 12, 2026</span></div>
                <span className={styles.fileSize}>3.2 MB</span>
              </div>
            </div>
          </div>
        )}

        {/* 📊 GRADE TAB */}
        {activeTab === "grade" && (
          <div className={styles.gradeWrapper}>
            <table className={styles.gradeTable}>
              <thead>
                <tr>
                  <th>Team Member</th>
                  {["Proposal", "SRS Doc", "Mid-Term Pres.", "Progress Report", "Literature Review"].map((t, i) => (
                    <th key={i}><div className={styles.headerContent}><span>{t}</span><span className={styles.headerDate}>{["Feb 10", "Mar 12", "Mar 6", "Mar 14", "Mar 8"][i]}</span></div></th>
                  ))}
                  <th className={styles.avgHead}>Average</th>
                </tr>
              </thead>
              <tbody>
                {project.grades.map((row, idx) => (
                  <tr key={idx}>
                    <td><div className={styles.memberCell}><div className={styles.tableAvatar}>AT</div>{row.name}</div></td>
                    {row.scores.map((s, i) => <td key={i}><div className={styles.cellContent}><span>{s}</span><span className={styles.subGrade}>B+</span></div></td>)}
                    <td className={styles.avgCell}><div className={styles.cellContent}><strong>{row.avg}</strong><span className={styles.avgLetterGrade}>{row.grade}</span></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;