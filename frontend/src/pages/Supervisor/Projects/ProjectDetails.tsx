import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./ProjectDetails.module.css";

// ✅ mock detailed data (simulate API)
const projectDetailsData: Record<string, any> = {
  p1: {
    id: "p1",
    name: "AI Chatbot System",
    description: "Final year AI chatbot for student support",

    members: [
      { id: "s1", name: "Ali", grade: "A" },
      { id: "s2", name: "Sara", grade: "B+" }
    ],

    stream: [
      {
        id: "st1",
        type: "message",
        content: "Please submit milestone 1 by Friday",
        date: "2026-04-20"
      },
      {
        id: "st2",
        type: "deadline",
        title: "Milestone 1",
        dueDate: "2026-04-25",
        submissions: 2
      }
    ],

    work: {
      proposals: ["proposal_v1.pdf"],
      documents: ["report.docx"],
      code: ["github.com/repo"],
      dataset: ["dataset.csv"],
      diagrams: ["architecture.png"]
    }
  }
};

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"stream" | "work" | "grades">("stream");

  // ✅ simulate API call
  useEffect(() => {
    setTimeout(() => {
      if (projectId) {
        setProject(projectDetailsData[projectId]);
      }
    }, 300);
  }, [projectId]);

  if (!project) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      
      {/* 🔷 Header Card */}
      <div className={styles.headerCard}>
        <h1>{project.name}</h1>
        <p>{project.description}</p>
      </div>

      {/* 🔷 Tabs */}
      <div className={styles.tabs}>
        {["stream", "work", "grades"].map((tab) => (
          <button
            key={tab}
            className={`${styles.tab} ${
              activeTab === tab ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab(tab as any)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* 🔷 Content */}
      <div className={styles.content}>
        
        {/* 📢 STREAM */}
        {activeTab === "stream" && (
          <div className={styles.stream}>
            {project.stream.map((item: any) => (
              <div key={item.id} className={styles.card}>
                
                {item.type === "message" && (
                  <>
                    <p>{item.content}</p>
                    <span className={styles.date}>{item.date}</span>
                  </>
                )}

                {item.type === "deadline" && (
                  <>
                    <h3>{item.title}</h3>
                    <p>Due: {item.dueDate}</p>
                    <p>Submissions: {item.submissions}</p>
                  </>
                )}

              </div>
            ))}
          </div>
        )}

        {/* 📂 WORK */}
        {activeTab === "work" && (
          <div className={styles.work}>
            
            <div>
              <h3>Proposals</h3>
              {project.work.proposals.map((f: string) => (
                <p key={f}>{f}</p>
              ))}
            </div>

            <div>
              <h3>Documents</h3>
              {project.work.documents.map((f: string) => (
                <p key={f}>{f}</p>
              ))}
            </div>

            <div>
              <h3>Code</h3>
              {project.work.code.map((f: string) => (
                <p key={f}>{f}</p>
              ))}
            </div>

            <div>
              <h3>Dataset</h3>
              {project.work.dataset.map((f: string) => (
                <p key={f}>{f}</p>
              ))}
            </div>

            <div>
              <h3>Diagrams</h3>
              {project.work.diagrams.map((f: string) => (
                <p key={f}>{f}</p>
              ))}
            </div>

          </div>
        )}

        {/* 📊 GRADES */}
        {activeTab === "grades" && (
          <div className={styles.grades}>
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {project.members.map((m: any) => (
                  <tr key={m.id}>
                    <td>{m.name}</td>
                    <td>{m.grade}</td>
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