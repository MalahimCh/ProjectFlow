import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./AssignmentDetail.module.css";
import SSidebar from "../../Sidebar/Ssidebar";
import StudSidebar from "../../../Student/Sidebar/StudSidebar";
import Header from "../../../../components/Header/Header";
import {
  LuArrowLeft,
  LuClock,
  LuFileText,
  LuPaperclip,
  LuX,
  LuCheck,
  LuUpload,
  LuExternalLink,
  LuUser,
  LuCircleAlert,
} from "react-icons/lu";
import {
  fetchAssignmentDetail,
  submitAssignment,
} from "../../../../services/streamService";

interface Attachment {
  id: string;
  fileName?: string;
  fileUrl: string;
}

interface Submission {
  id: string;
  content: string;
  status: "draft" | "submitted" | "late";
  submittedAt?: string;
  attachments: Attachment[];
  student?: { id: string; name: string; email: string };
}

interface AssignmentData {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  createdAt: string;
  createdBy: { name: string };
  attachments: Attachment[];
  mySubmission?: Submission | null; // student role
  submissions?: Submission[]; // supervisor role
}

interface Props {
  role?: "supervisor" | "student";
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const isOverdue = (dueDate?: string) =>
  dueDate ? new Date() > new Date(dueDate) : false;

export default function AssignmentDetail({ role = "student" }: Props) {
  const { projectId, assignmentId } = useParams<{
    projectId: string;
    assignmentId: string;
  }>();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [assignment, setAssignment] = useState<AssignmentData | null>(null);
  const [loading, setLoading] = useState(true);

  const Sidebar = role === "supervisor" ? SSidebar : StudSidebar;
  const getProjectBase = () =>
    role === "student"
      ? `/student/projects/${projectId}`
      : `/projects/${projectId}`;
  // Student submission state
  const [content, setContent] = useState("");
  const [attachUrls, setAttachUrls] = useState<string[]>([""]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const load = useCallback(async () => {
    if (!projectId || !assignmentId) return;
    setLoading(true);
    try {
      const data = await fetchAssignmentDetail(projectId, assignmentId);
      setAssignment(data);
      if (data.mySubmission) {
        setContent(data.mySubmission.content || "");
        setSubmitted(data.mySubmission.status !== "draft");
      }
    } catch {
      // handle
    } finally {
      setLoading(false);
    }
  }, [projectId, assignmentId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async () => {
    if (!projectId || !assignmentId) return;
    setSubmitting(true);
    try {
      const validUrls = attachUrls.filter((u) => u.trim());
      await submitAssignment(projectId, assignmentId, {
        content,
        attachments: validUrls.map((u) => ({ fileUrl: u })),
      });
      setSubmitted(true);
      await load();
    } catch {
      alert("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const overdue = isOverdue(assignment?.dueDate);

  if (loading) {
    return (
      <div className={styles.container}>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className={styles.main}>
          <Header title="Assignment" subtitle="" />
          <div className={styles.loadingState}>Loading assignment...</div>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className={styles.container}>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className={styles.main}>
          <Header title="Assignment" subtitle="" />
          <div className={styles.loadingState}>Assignment not found.</div>
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
          {/* Back */}
          <button
            className={styles.backBtn}
            onClick={() => navigate(getProjectBase())}
          >
            <LuArrowLeft size={16} />
            Back to Project
          </button>

          <div className={styles.layout}>
            {/* Left: Assignment details */}
            <div className={styles.leftCol}>
              <div className={styles.assignmentHeader}>
                <h1 className={styles.assignmentTitle}>{assignment.title}</h1>
                <div className={styles.assignmentMeta}>
                  <span className={styles.metaChip}>
                    Posted by {assignment.createdBy.name}
                  </span>
                  {assignment.dueDate && (
                    <span
                      className={`${styles.metaChip} ${overdue ? styles.overdue : styles.upcoming}`}
                    >
                      <LuClock size={13} />
                      {overdue ? "Was due" : "Due"}{" "}
                      {formatDate(assignment.dueDate)}
                    </span>
                  )}
                </div>
              </div>

              {assignment.description && (
                <div className={styles.descCard}>
                  <p>{assignment.description}</p>
                </div>
              )}

              {/* Assignment Attachments */}
              {assignment.attachments.length > 0 && (
                <div className={styles.attachSection}>
                  <p className={styles.sectionLabel}>Attachments</p>
                  <div className={styles.attachList}>
                    {assignment.attachments.map((att) => (
                      <a
                        key={att.id}
                        href={att.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.attachChip}
                      >
                        <LuFileText size={14} />
                        <span>{att.fileName || "View File"}</span>
                        <LuExternalLink size={12} />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Supervisor: Submissions Panel */}
              {role === "supervisor" && (
                <SubmissionPanel submissions={assignment.submissions || []} />
              )}
            </div>

            {/* Right: Student submission box */}
            {role === "student" && (
              <div className={styles.rightCol}>
                <StudentSubmissionBox
                  submission={assignment.mySubmission}
                  content={content}
                  setContent={setContent}
                  attachUrls={attachUrls}
                  setAttachUrls={setAttachUrls}
                  onSubmit={handleSubmit}
                  submitting={submitting}
                  submitted={submitted}
                  overdue={overdue}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Student Submission Box ─────────────────────────────────── */
interface SubmissionBoxProps {
  submission?: Submission | null;
  content: string;
  setContent: (v: string) => void;
  attachUrls: string[];
  setAttachUrls: (v: string[]) => void;
  onSubmit: () => void;
  submitting: boolean;
  submitted: boolean;
  overdue: boolean;
}

function StudentSubmissionBox({
  submission,
  content,
  setContent,
  attachUrls,
  setAttachUrls,
  onSubmit,
  submitting,
  submitted,
  overdue,
}: SubmissionBoxProps) {
  return (
    <div className={styles.submissionBox}>
      <div className={styles.boxHeader}>
        <p className={styles.boxTitle}>Your Work</p>
        {submission && <StatusBadge status={submission.status} />}
      </div>

      {/* Existing submission files */}
      {submission?.attachments && submission.attachments.length > 0 && (
        <div className={styles.existingAttach}>
          <p className={styles.smallLabel}>Submitted files</p>
          {submission.attachments.map((att) => (
            <a
              key={att.id}
              href={att.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.attachChipGreen}
            >
              <LuFileText size={13} />
              <span>View file</span>
              <LuExternalLink size={11} />
            </a>
          ))}
          {submission.submittedAt && (
            <p className={styles.submittedAt}>
              Submitted {formatDate(submission.submittedAt)}
            </p>
          )}
        </div>
      )}

      {/* Editable area */}
      <label className={styles.smallLabel}>Notes (optional)</label>
      <textarea
        className={styles.noteArea}
        rows={4}
        placeholder="Add a note for your supervisor..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <label className={styles.smallLabel}>
        <LuPaperclip size={13} /> Attach files (paste URLs)
      </label>
      {attachUrls.map((url, i) => (
        <div key={i} className={styles.urlRow}>
          <input
            className={styles.urlInput}
            placeholder="https://..."
            value={url}
            onChange={(e) => {
              const next = [...attachUrls];
              next[i] = e.target.value;
              setAttachUrls(next);
            }}
          />
          {attachUrls.length > 1 && (
            <button
              className={styles.removeUrl}
              onClick={() =>
                setAttachUrls(attachUrls.filter((_, j) => j !== i))
              }
            >
              <LuX size={13} />
            </button>
          )}
        </div>
      ))}
      <button
        className={styles.addUrlBtn}
        onClick={() => setAttachUrls([...attachUrls, ""])}
      >
        + Add another file
      </button>

      {overdue && !submission && (
        <div className={styles.lateWarning}>
          <LuCircleAlert size={14} />
          This assignment is past due. Your submission will be marked late.
        </div>
      )}

      <button
        className={styles.submitBtn}
        onClick={onSubmit}
        disabled={submitting}
      >
        {submitting ? (
          "Submitting..."
        ) : submitted ? (
          <>
            <LuCheck size={15} /> Resubmit Work
          </>
        ) : (
          <>
            <LuUpload size={15} /> Submit Assignment
          </>
        )}
      </button>
    </div>
  );
}

/* ── Status Badge ───────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const map = {
    submitted: { label: "Submitted", cls: styles.badgeGreen },
    late: { label: "Late", cls: styles.badgeRed },
    draft: { label: "Draft", cls: styles.badgeGray },
  } as const;

  const s = map[status as keyof typeof map] || map.draft;
  return <span className={`${styles.badge} ${s.cls}`}>{s.label}</span>;
}

/* ── Supervisor Submissions Panel ───────────────────────────── */
function SubmissionPanel({ submissions }: { submissions: Submission[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className={styles.submissionsPanel}>
      <p className={styles.sectionLabel}>
        Student Submissions ({submissions.length})
      </p>

      {submissions.length === 0 ? (
        <div className={styles.noSubs}>No submissions yet.</div>
      ) : (
        <div className={styles.subList}>
          {submissions.map((sub) => (
            <div key={sub.id} className={styles.subRow}>
              <div
                className={styles.subRowHeader}
                onClick={() => setOpen(open === sub.id ? null : sub.id)}
              >
                <div className={styles.subStudent}>
                  <div className={styles.studentAvatar}>
                    <LuUser size={14} />
                  </div>
                  <div>
                    <p className={styles.studentName}>{sub.student?.name}</p>
                    <p className={styles.studentEmail}>{sub.student?.email}</p>
                  </div>
                </div>
                <div className={styles.subRight}>
                  <StatusBadge status={sub.status} />
                  {sub.submittedAt && (
                    <p className={styles.subTime}>
                      {formatDate(sub.submittedAt)}
                    </p>
                  )}
                </div>
              </div>

              {open === sub.id && (
                <div className={styles.subDetail}>
                  {sub.content && (
                    <p className={styles.subContent}>{sub.content}</p>
                  )}
                  {sub.attachments.length > 0 && (
                    <div className={styles.subAttachments}>
                      {sub.attachments.map((att) => (
                        <a
                          key={att.id}
                          href={att.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.attachChip}
                        >
                          <LuFileText size={13} />
                          View file
                          <LuExternalLink size={11} />
                        </a>
                      ))}
                    </div>
                  )}
                  {!sub.content && sub.attachments.length === 0 && (
                    <p className={styles.emptyDetail}>No content submitted.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
