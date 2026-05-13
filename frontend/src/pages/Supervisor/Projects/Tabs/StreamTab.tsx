import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StreamTab.module.css";
import {
  LuSquarePen,
  LuEllipsisVertical,
  LuFileText,
  LuClipboardList,
  LuClock,
  LuX,
  LuPlus,
  LuTrash2,
  LuChevronRight,
} from "react-icons/lu";
import {
  fetchAnnouncements,
  postAnnouncement,
  removeAnnouncement,
  fetchMaterials,
  postMaterial,
  removeMaterial,
  fetchAssignments,
  postAssignment,
  removeAssignment,
} from "../../../../services/streamService";

type FeedItem =
  | {
      kind: "announcement";
      id: string;
      title: string;
      body: string;
      createdAt: string;
      postedBy: { name: string };
    }
  | {
      kind: "material";
      id: string;
      title: string;
      fileUrl: string;
      createdAt: string;
      uploadedBy: { name: string };
    }
  | {
      kind: "assignment";
      id: string;
      title: string;
      description: string;
      dueDate?: string;
      createdAt: string;
      createdBy: { name: string };
      mySubmission?: { status: string } | null;
    };

type ModalType = "announcement" | "material" | "assignment" | null;

interface Props {
  projectId: string;
  role: "supervisor" | "student";
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatDue = (iso?: string) => {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export default function StreamTab({ projectId, role }: Props) {
  const navigate = useNavigate();
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalType>(null);

  // Form state
  const [aTitle, setATitle] = useState("");
  const [aBody, setABody] = useState("");
  const [mTitle, setMTitle] = useState("");
  const [mFileUrl, setMFileUrl] = useState("");
  const [asTitle, setAsTitle] = useState("");
  const [asDesc, setAsDesc] = useState("");
  const [asDue, setAsDue] = useState("");
  const [asAttachments, setAsAttachments] = useState<
    { fileName: string; fileUrl: string }[]
  >([]);
  const [saving, setSaving] = useState(false);

  // Upcoming deadlines for sidebar (assignments with due dates)
  const upcoming = (
    feed.filter((f) => f.kind === "assignment" && f.dueDate) as Extract<
      FeedItem,
      { kind: "assignment" }
    >[]
  )
    .filter((a) => new Date(a.dueDate!) > new Date())
    .sort(
      (a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime(),
    )
    .slice(0, 3);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [anns, mats, asns] = await Promise.all([
        fetchAnnouncements(projectId),
        fetchMaterials(projectId),
        fetchAssignments(projectId),
      ]);

      const all: FeedItem[] = [
        ...anns.map((a: any) => ({ kind: "announcement" as const, ...a })),
        ...mats.map((m: any) => ({ kind: "material" as const, ...m })),
        ...asns.map((a: any) => ({ kind: "assignment" as const, ...a })),
      ].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      setFeed(all);
    } catch {
      // silently fail; real app should toast
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleDelete = async (item: FeedItem) => {
    setOpenMenu(null);
    try {
      if (item.kind === "announcement")
        await removeAnnouncement(projectId, item.id);
      if (item.kind === "material") await removeMaterial(projectId, item.id);
      if (item.kind === "assignment")
        await removeAssignment(projectId, item.id);
      setFeed((prev) => prev.filter((f) => f.id !== item.id));
    } catch {
      alert("Failed to delete. Please try again.");
    }
  };

  const handlePostAnnouncement = async () => {
    if (!aTitle.trim() || !aBody.trim()) return;
    setSaving(true);
    try {
      const created = await postAnnouncement(projectId, {
        title: aTitle,
        body: aBody,
      });
      setFeed((prev) => [{ kind: "announcement", ...created }, ...prev]);
      closeModal();
    } finally {
      setSaving(false);
    }
  };

  const handlePostMaterial = async () => {
    if (!mTitle.trim() || !mFileUrl.trim()) return;
    setSaving(true);
    try {
      const created = await postMaterial(projectId, {
        title: mTitle,
        fileUrl: mFileUrl,
      });
      setFeed((prev) => [{ kind: "material", ...created }, ...prev]);
      closeModal();
    } finally {
      setSaving(false);
    }
  };

  const handlePostAssignment = async () => {
    if (!asTitle.trim()) return;
    setSaving(true);
    try {
      const created = await postAssignment(projectId, {
        title: asTitle,
        description: asDesc,
        dueDate: asDue || undefined,
        attachments: asAttachments,
      });
      setFeed((prev) => [{ kind: "assignment", ...created }, ...prev]);
      closeModal();
    } finally {
      setSaving(false);
    }
  };

  const closeModal = () => {
    setModal(null);
    setATitle("");
    setABody("");
    setMTitle("");
    setMFileUrl("");
    setAsTitle("");
    setAsDesc("");
    setAsDue("");
    setAsAttachments([]);
  };

  const handleAssignmentClick = (
    item: Extract<FeedItem, { kind: "assignment" }>,
  ) => {
    const basePath =
      role === "student"
        ? `/student/projects/${projectId}`
        : `/projects/${projectId}`;

    navigate(`${basePath}/assignments/${item.id}`);
  };
  if (loading) {
    return <div className={styles.loading}>Loading stream...</div>;
  }

  return (
    <div className={styles.streamGrid}>
      {/* Left Sidebar */}
      <div className={styles.streamSidebar}>
        {/* Upcoming */}
        <div className={styles.sidebarCard}>
          <p className={styles.sidebarTitle}>Upcoming</p>
          {upcoming.length === 0 ? (
            <p className={styles.emptyUpcoming}>No upcoming deadlines</p>
          ) : (
            upcoming.map((item) => (
              <div
                key={item.id}
                className={styles.upcomingItem}
                onClick={() => handleAssignmentClick(item)}
              >
                <p className={styles.upcomingName}>{item.title}</p>
                <div className={styles.upcomingDate}>
                  <LuClock size={12} />
                  <span>Due {formatDue(item.dueDate)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Supervisor: Create new */}
        {role === "supervisor" && (
          <div className={styles.sidebarCard}>
            <p className={styles.sidebarTitle}>Post to Stream</p>
            <button
              className={styles.createBtn}
              onClick={() => setModal("announcement")}
            >
              <LuSquarePen size={14} /> Announcement
            </button>
            <button
              className={styles.createBtn}
              onClick={() => setModal("material")}
            >
              <LuFileText size={14} /> Material
            </button>
            <button
              className={styles.createBtn}
              onClick={() => setModal("assignment")}
            >
              <LuClipboardList size={14} /> Assignment
            </button>
          </div>
        )}
      </div>

      {/* Feed */}
      <div className={styles.streamFeed}>
        {feed.length === 0 && (
          <div className={styles.emptyFeed}>
            <p>No posts yet.</p>
            {role === "supervisor" && (
              <span>
                Use the sidebar to post an announcement, material, or
                assignment.
              </span>
            )}
          </div>
        )}

        {feed.map((item) => (
          <FeedCard
            key={`${item.kind}-${item.id}`}
            item={item}
            role={role}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
            onDelete={handleDelete}
            onAssignmentClick={handleAssignmentClick}
          />
        ))}
      </div>

      {/* Modals */}
      {modal && (
        <div className={styles.overlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>
                {modal === "announcement" && "New Announcement"}
                {modal === "material" && "Upload Material"}
                {modal === "assignment" && "Create Assignment"}
              </h3>
              <button className={styles.closeBtn} onClick={closeModal}>
                <LuX size={18} />
              </button>
            </div>

            {modal === "announcement" && (
              <div className={styles.modalBody}>
                <label className={styles.label}>Title</label>
                <input
                  className={styles.input}
                  placeholder="e.g. Final deadline reminder"
                  value={aTitle}
                  onChange={(e) => setATitle(e.target.value)}
                />
                <label className={styles.label}>Message</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Write your announcement..."
                  rows={5}
                  value={aBody}
                  onChange={(e) => setABody(e.target.value)}
                />
                <button
                  className={styles.submitBtn}
                  onClick={handlePostAnnouncement}
                  disabled={saving || !aTitle.trim() || !aBody.trim()}
                >
                  {saving ? "Posting..." : "Post Announcement"}
                </button>
              </div>
            )}

            {modal === "material" && (
              <div className={styles.modalBody}>
                <label className={styles.label}>Title</label>
                <input
                  className={styles.input}
                  placeholder="e.g. FYP Presentation Guidelines"
                  value={mTitle}
                  onChange={(e) => setMTitle(e.target.value)}
                />
                <label className={styles.label}>File URL</label>
                <input
                  className={styles.input}
                  placeholder="https://... (upload to storage first)"
                  value={mFileUrl}
                  onChange={(e) => setMFileUrl(e.target.value)}
                />
                <p className={styles.hint}>
                  Upload your file to your storage service (S3, Cloudinary,
                  etc.) and paste the URL above.
                </p>
                <button
                  className={styles.submitBtn}
                  onClick={handlePostMaterial}
                  disabled={saving || !mTitle.trim() || !mFileUrl.trim()}
                >
                  {saving ? "Uploading..." : "Post Material"}
                </button>
              </div>
            )}

            {modal === "assignment" && (
              <div className={styles.modalBody}>
                <label className={styles.label}>Title</label>
                <input
                  className={styles.input}
                  placeholder="e.g. SRS Document Submission"
                  value={asTitle}
                  onChange={(e) => setAsTitle(e.target.value)}
                />
                <label className={styles.label}>Instructions (optional)</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Describe the assignment..."
                  rows={4}
                  value={asDesc}
                  onChange={(e) => setAsDesc(e.target.value)}
                />
                <label className={styles.label}>Due Date (optional)</label>
                <input
                  className={styles.input}
                  type="datetime-local"
                  value={asDue}
                  onChange={(e) => setAsDue(e.target.value)}
                />
                <label className={styles.label}>Attachments (optional)</label>
                {asAttachments.map((att, i) => (
                  <div key={i} className={styles.attachRow}>
                    <input
                      className={styles.inputSm}
                      placeholder="File name"
                      value={att.fileName}
                      onChange={(e) => {
                        const next = [...asAttachments];
                        next[i].fileName = e.target.value;
                        setAsAttachments(next);
                      }}
                    />
                    <input
                      className={styles.inputSm}
                      placeholder="File URL"
                      value={att.fileUrl}
                      onChange={(e) => {
                        const next = [...asAttachments];
                        next[i].fileUrl = e.target.value;
                        setAsAttachments(next);
                      }}
                    />
                    <button
                      className={styles.removeAttach}
                      onClick={() =>
                        setAsAttachments((prev) =>
                          prev.filter((_, j) => j !== i),
                        )
                      }
                    >
                      <LuX size={14} />
                    </button>
                  </div>
                ))}
                <button
                  className={styles.addAttachBtn}
                  onClick={() =>
                    setAsAttachments((prev) => [
                      ...prev,
                      { fileName: "", fileUrl: "" },
                    ])
                  }
                >
                  <LuPlus size={14} /> Add Attachment
                </button>
                <button
                  className={styles.submitBtn}
                  onClick={handlePostAssignment}
                  disabled={saving || !asTitle.trim()}
                >
                  {saving ? "Creating..." : "Create Assignment"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Feed Card ──────────────────────────────────────────────── */
interface CardProps {
  item: FeedItem;
  role: "supervisor" | "student";
  openMenu: string | null;
  setOpenMenu: (id: string | null) => void;
  onDelete: (item: FeedItem) => void;
  onAssignmentClick: (item: Extract<FeedItem, { kind: "assignment" }>) => void;
}

function FeedCard({
  item,
  role,
  openMenu,
  setOpenMenu,
  onDelete,
  onAssignmentClick,
}: CardProps) {
  const menuId = `${item.kind}-${item.id}`;
  const isOpen = openMenu === menuId;

  const authorName =
    item.kind === "announcement"
      ? item.postedBy.name
      : item.kind === "material"
        ? item.uploadedBy.name
        : item.createdBy.name;

  const icon =
    item.kind === "material" ? (
      <div className={`${styles.avatar} ${styles.avatarFile}`}>
        <LuFileText size={16} />
      </div>
    ) : item.kind === "assignment" ? (
      <div className={`${styles.avatar} ${styles.avatarAssign}`}>
        <LuClipboardList size={16} />
      </div>
    ) : (
      <div className={styles.avatar}>{getInitials(authorName)}</div>
    );

  return (
    <div className={styles.postCard}>
      <div className={styles.postHeader}>
        {icon}
        <div className={styles.postMeta}>
          <p className={styles.postAuthor}>
            {item.kind === "material" ? (
              <>
                {authorName} posted:{" "}
                <span className={styles.postTitleInline}>{item.title}</span>
              </>
            ) : item.kind === "assignment" ? (
              <>
                {authorName} assigned:{" "}
                <span className={styles.postTitleInline}>{item.title}</span>
              </>
            ) : (
              authorName
            )}
          </p>
          <p className={styles.postTime}>{formatDate(item.createdAt)}</p>
        </div>

        {role === "supervisor" && (
          <div className={styles.menuWrapper}>
            <button
              className={styles.moreBtn}
              onClick={() => setOpenMenu(isOpen ? null : menuId)}
            >
              <LuEllipsisVertical size={16} />
            </button>
            {isOpen && (
              <div className={styles.dropMenu}>
                <button
                  className={`${styles.dropItem} ${styles.danger}`}
                  onClick={() => onDelete(item)}
                >
                  <LuTrash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Body */}
      {item.kind === "announcement" && (
        <div className={styles.postBody}>
          <p className={styles.postHeading}>{item.title}</p>
          <p className={styles.postText}>{item.body}</p>
        </div>
      )}

      {item.kind === "assignment" && (
        <div
          className={styles.assignmentCard}
          onClick={() => onAssignmentClick(item)}
        >
          {item.description && (
            <p className={styles.assignmentDesc}>{item.description}</p>
          )}
          <div className={styles.assignmentFooter}>
            {item.dueDate && (
              <span className={styles.dueChip}>
                <LuClock size={12} /> Due {formatDue(item.dueDate)}
              </span>
            )}
            {item.mySubmission ? (
              <span
                className={`${styles.statusChip} ${styles[item.mySubmission.status]}`}
              >
                {item.mySubmission.status.charAt(0).toUpperCase() +
                  item.mySubmission.status.slice(1)}
              </span>
            ) : null}
            <span className={styles.viewLink}>
              View Assignment <LuChevronRight size={14} />
            </span>
          </div>
        </div>
      )}

      {item.kind === "material" && (
        <div className={styles.materialLink}>
          <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">
            <LuFileText size={14} /> Open File
          </a>
        </div>
      )}
    </div>
  );
}
