import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../ProjectDetails.module.css"; // reuse existing styles
import workStyles from "./WorkTab.module.css";
import {
  LuFileText,
  LuCalendar,
  LuClock,
  LuChevronRight,
  LuExternalLink,
} from "react-icons/lu";
import {
  fetchMaterials,
  fetchAssignments,
} from "../../../../services/streamService";

interface Material {
  id: string;
  title: string;
  fileUrl: string;
  createdAt: string;
  uploadedBy: { name: string };
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  createdAt: string;
  mySubmission?: { status: string } | null;
}

interface Props {
  projectId: string;
  role: "supervisor" | "student";
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const isOverdue = (dueDate?: string) =>
  dueDate ? new Date() > new Date(dueDate) : false;

export default function WorkTab({ projectId, role }: Props) {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [mats, asns] = await Promise.all([
        fetchMaterials(projectId),
        fetchAssignments(projectId),
      ]);
      setMaterials(mats);
      setAssignments(asns);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <div className={workStyles.loading}>Loading work...</div>;
  }

  return (
    <div className={workStyles.workSections}>
      {/* Materials */}
      <div className={styles.request}>
        <div className={styles.requestHeader}>
          <p className={styles.requestTitle}>Materials ({materials.length})</p>
        </div>

        {materials.length === 0 ? (
          <div className={workStyles.empty}>No materials posted yet.</div>
        ) : (
          <div className={styles.requestList}>
            {materials.map((m) => (
              <div key={m.id} className={styles.fileCard}>
                <div className={styles.fileIcon}>
                  <LuFileText size={16} />
                </div>
                <div className={styles.fileInfo}>
                  <p className={styles.fileName}>{m.title}</p>
                  <div className={styles.fileMeta}>
                    <LuCalendar size={12} />
                    <span>Posted {formatDate(m.createdAt)}</span>
                  </div>
                </div>
                <a
                  href={m.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={workStyles.openBtn}
                >
                  <LuExternalLink size={14} />
                  Open
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assignments */}
      <div className={styles.request}>
        <div className={styles.requestHeader}>
          <p className={styles.requestTitle}>
            Assignments ({assignments.length})
          </p>
        </div>

        {assignments.length === 0 ? (
          <div className={workStyles.empty}>No assignments yet.</div>
        ) : (
          <div className={workStyles.assignmentList}>
            {assignments.map((a) => {
              const overdue = isOverdue(a.dueDate);
              const sub = a.mySubmission;

              return (
                <div
                  key={a.id}
                  className={workStyles.assignmentRow}
                  onClick={() =>
                    navigate(`/projects/${projectId}/assignments/${a.id}`)
                  }
                >
                  <div className={workStyles.assignIcon}>
                    <LuFileText size={18} />
                  </div>
                  <div className={workStyles.assignInfo}>
                    <p className={workStyles.assignTitle}>{a.title}</p>
                    {a.dueDate && (
                      <span
                        className={`${workStyles.dueLabel} ${overdue ? workStyles.overdue : ""}`}
                      >
                        <LuClock size={11} />
                        {overdue ? "Was due" : "Due"} {formatDate(a.dueDate)}
                      </span>
                    )}
                  </div>
                  <div className={workStyles.assignRight}>
                    {role === "student" && sub && (
                      <span
                        className={`${workStyles.badge} ${
                          sub.status === "submitted"
                            ? workStyles.green
                            : sub.status === "late"
                              ? workStyles.red
                              : workStyles.gray
                        }`}
                      >
                        {sub.status.charAt(0).toUpperCase() +
                          sub.status.slice(1)}
                      </span>
                    )}
                    {role === "student" && !sub && (
                      <span
                        className={`${workStyles.badge} ${workStyles.gray}`}
                      >
                        Not submitted
                      </span>
                    )}
                    <LuChevronRight size={16} className={workStyles.chevron} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
