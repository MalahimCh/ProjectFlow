import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import styles from "./ProjectDetails.module.css";
import SSidebar from "../Sidebar/Ssidebar";
import Header from "../../../components/Header/Header";
import {
  LuCalendar,
  LuClock,
  LuFileText,
  LuSquarePen,
  LuEllipsisVertical,
  LuMessageSquareText,
  LuChevronRight,
} from "react-icons/lu";

const ProjectDetails = () => {
  const { projectId: _projectId } = useParams();
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<"stream" | "work" | "grade">(
    "stream"
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
          {/* Overview Card */}
          <div className={styles.overviewCard}>
            <p className={styles.projectTitle}>{project.name}</p>
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
                <span className={styles.progressPercent}>{project.progress}%</span>
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
            <button
              className={activeTab === "stream" ? styles.activeTab : styles.tab}
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
              className={activeTab === "grade" ? styles.activeTab : styles.tab}
              onClick={() => setActiveTab("grade")}
            >
              Grade
            </button>
          </div>

          {/* Stream Tab */}
          {activeTab === "stream" && (
            <div className={styles.streamGrid}>
              {/* Sidebar */}
              <div className={styles.streamSidebar}>
                <div className={styles.sidebarCard}>
                  <p className={styles.sidebarTitle}>Upcoming</p>
                  <div className={styles.upcomingItem}>
                    <p className={styles.upcomingName}>Progress Report</p>
                    <div className={styles.upcomingDate}>
                      <LuClock size={12} />
                      <span>Due Mar 20, 2026</span>
                    </div>
                    <button className={styles.viewButton}>View</button>
                  </div>
                </div>
              </div>

              {/* Feed */}
              <div className={styles.streamFeed}>
                {/* Share Box */}
                <button className={styles.shareBox}>
                  <LuSquarePen size={14} />
                  <span>Share with your team</span>
                </button>

                {/* Post Card 1 - expanded */}
                <div className={styles.postCard}>
                  <div className={styles.postHeader}>
                    <div className={styles.avatarCircle}>MK</div>
                    <div className={styles.postMeta}>
                      <p className={styles.postAuthor}>Muhammad Kamran</p>
                      <p className={styles.postTime}>Today at 9:30 AM</p>
                    </div>
                    <button className={styles.moreBtn}>
                      <LuEllipsisVertical size={16} />
                    </button>
                  </div>
                  <div className={styles.postBody}>
                    <p className={styles.postHeading}>
                      Final Year Project - Important Deadlines Update
                    </p>
                    <p className={styles.postText}>Dear Students,</p>
                    <p className={styles.postText}>
                      Please note the following critical deadlines for your FYP:
                    </p>
                    <ul className={styles.postList}>
                      <li>Final documentation due: May 10, 2026</li>
                      <li>Project presentations: May 15-17, 2026</li>
                      <li>Code repository submission: May 9, 2026</li>
                    </ul>
                    <p className={styles.postText}>
                      Make sure all deliverables are completed on time. Late
                      submissions will not be accepted.
                    </p>
                  </div>
                  <button className={styles.replyButton}>
                    <LuMessageSquareText size={14} />
                    <span>Comment</span>
                  </button>
                </div>

                {/* Post Card 2 - compact */}
                <div className={styles.postCard}>
                  <div className={styles.postHeader}>
                    <div className={styles.avatarCircleGreen}>
                      <LuFileText size={16} />
                    </div>
                    <div className={styles.postMeta}>
                      <p className={styles.postAuthor}>
                        Muhammad Kamran posted:{" "}
                        <span className={styles.postTitleInline}>
                          FYP Presentation Guidelines
                        </span>
                      </p>
                      <p className={styles.postTime}>Yesterday</p>
                    </div>
                    <button className={styles.moreBtn}>
                      <LuEllipsisVertical size={16} />
                    </button>
                  </div>
                </div>

                {/* Post Card 3 - compact */}
                <div className={styles.postCard}>
                  <div className={styles.postHeader}>
                    <div className={styles.avatarCircleGreen}>
                      <LuFileText size={16} />
                    </div>
                    <div className={styles.postMeta}>
                      <p className={styles.postAuthor}>
                        Muhammad Kamran posted:{" "}
                        <span className={styles.postTitleInline}>
                          Mid-Term Report Template
                        </span>
                      </p>
                      <p className={styles.postTime}>2 days ago</p>
                    </div>
                    <button className={styles.moreBtn}>
                      <LuEllipsisVertical size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Work Tab */}
          {activeTab === "work" && (
            <div className={styles.workSections}>
              <div className={styles.request}>
                <div className={styles.requestHeader}>
                  <p className={styles.requestTitle}>Proposals</p>
                </div>
                <div className={styles.requestList}>
                  {[
                    { name: "Project Proposal v3.pdf", date: "Mar 10, 2026", size: "2.4 MB" },
                    { name: "Initial Proposal.pdf", date: "Feb 5, 2026", size: "1.8 MB" },
                  ].map((file, i) => (
                    <div key={i} className={styles.fileCard}>
                      <div className={styles.fileIcon}>
                        <LuFileText size={16} />
                      </div>
                      <div className={styles.fileInfo}>
                        <p className={styles.fileName}>{file.name}</p>
                        <div className={styles.fileMeta}>
                          <LuCalendar size={12} />
                          <span>Last modified: {file.date}</span>
                        </div>
                      </div>
                      <span className={styles.fileSize}>{file.size}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.request}>
                <div className={styles.requestHeader}>
                  <p className={styles.requestTitle}>Documents</p>
                </div>
                <div className={styles.requestList}>
                  {[
                    { name: "SRS_Document_Final.pdf", date: "Mar 12, 2026", size: "3.2 MB" },
                  ].map((file, i) => (
                    <div key={i} className={styles.fileCard}>
                      <div className={styles.fileIcon}>
                        <LuFileText size={16} />
                      </div>
                      <div className={styles.fileInfo}>
                        <p className={styles.fileName}>{file.name}</p>
                        <div className={styles.fileMeta}>
                          <LuCalendar size={12} />
                          <span>Last modified: {file.date}</span>
                        </div>
                      </div>
                      <span className={styles.fileSize}>{file.size}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Grade Tab */}
          {activeTab === "grade" && (
            <div className={styles.request}>
              <div className={styles.requestHeader}>
                <p className={styles.requestTitle}>Grade Overview</p>
              </div>
              <div className={styles.gradeCard}>
                <table className={styles.gradeTable}>
                  <thead>
                    <tr>
                      <th>Team Member</th>
                      {["Proposal", "SRS Doc", "Mid-Term Pres.", "Progress Report", "Literature Review"].map(
                        (title, i) => <th key={i}>{title}</th>
                      )}
                      <th>Average</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.grades.map((member, idx) => (
                      <tr key={idx}>
                        <td>
                          <div className={styles.memberInfo}>
                            <div className={styles.avatarSmall}>{member.initials}</div>
                            {member.name}
                          </div>
                        </td>
                        {member.scores.map((score, i) => (
                          <td key={i}>{score}</td>
                        ))}
                        <td>
                          <strong>{member.avg}</strong>
                          <span className={styles.gradeLabel}>{member.grade}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;