import SSidebar from "../Sidebar/Ssidebar";
import { type FC, useEffect, useState } from "react";
import styles from "./SMeetings.module.css";
import Header from "../../../components/Header/Header";
import StatsCard from "../../../components/StatsCard/StatsCard";
import {
  LuUsers,
  LuMessageSquareText,
  LuCalendar,
  LuUserCheck,
  LuVideo,
  LuClock,
  LuLink,
  LuTrash2,
  LuPencil,
} from "react-icons/lu";
import {
  getSupervisorMeetings,
  createSupervisorMeeting,
  updateMeeting,
  deleteMeeting,
  getSupervisorProjects,
} from "../../../services/supervisorService";
type Meeting = {
  id: string;
  projectName: string;
  projectId?: string;
  title: string;
  scheduledAt: string;
  link: string;
};
type Project = {
  id: string;
  title: string;
};

const SMeetings: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinLink, setJoinLink] = useState("");

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const fetchMeetings = async () => {
    try {
      const data = await getSupervisorMeetings();

      const formatted: Meeting[] = (data.meetings || []).map((m: any) => ({
        id: m.id,
        projectName: m.project?.title || "",
        projectId: m.project?.id,
        title: m.title,
        scheduledAt: m.scheduledAt,
        link: m.meetingUrl || "",
      }));

      setMeetings(formatted);
    } catch (err) {
      console.error("Failed to load meetings:", err);
    }
  };
  const fetchProjects = async () => {
    try {
      const data = await getSupervisorProjects();
      setProjects(data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchMeetings();
    fetchProjects();
  }, []);
  const [formData, setFormData] = useState({
    projectName: "",
    title: "",
    date: "",
    time: "",
  });

  const joinMeeting = (link: string) => {
    window.open(link, "_blank");
  };

  const handleJoinConfirm = () => {
    if (!joinLink.trim()) return;
    joinMeeting(joinLink.trim());
    setShowJoinModal(false);
    setJoinLink("");
  };

  const [meetLinkInput, setMeetLinkInput] = useState("");
  const [meetLinkStep, setMeetLinkStep] = useState<1 | 2>(1);

  const handleOpenCreateModal = () => {
    setMeetLinkStep(1);
    setMeetLinkInput("");
    setFormData({ projectName: "", title: "", date: "", time: "" });
    setShowCreateModal(true);
  };

  const handleGenerateLink = () => {
    window.open("https://meet.google.com/new", "_blank");
    setMeetLinkStep(2);
  };
  const handleEditMeeting = (meeting: Meeting) => {
    setEditingMeeting(meeting);

    const dt = new Date(meeting.scheduledAt);

    setFormData({
      projectName: meeting.projectName,
      title: meeting.title,
      date: dt.toISOString().split("T")[0],
      time: dt.toTimeString().slice(0, 5),
    });

    setMeetLinkInput(meeting.link);
    setSelectedProjectId(meeting.projectId || "");
    setMeetLinkStep(2);
    setShowCreateModal(true);
  };
  const handleDeleteMeeting = async (id: string) => {
    const ok = window.confirm("Delete meeting?");
    if (!ok) return;

    try {
      await deleteMeeting(id);
      fetchMeetings();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleCreateMeeting = async () => {
    if (!selectedProjectId || !formData.title || !meetLinkInput.trim()) {
      alert("Fill all fields and select project.");
      return;
    }

    try {
      const scheduledAt = new Date(
        `${formData.date}T${formData.time}`,
      ).toISOString();

      if (editingMeeting) {
        await updateMeeting(editingMeeting.id, {
          title: formData.title,
          scheduledAt,
          meetingUrl: meetLinkInput.trim(),
        });
      } else {
        await createSupervisorMeeting({
          projectId: selectedProjectId,
          title: formData.title,
          scheduledAt,
          meetingUrl: meetLinkInput.trim(),
        });
      }

      setShowCreateModal(false);
      setEditingMeeting(null);
      setMeetLinkStep(1);
      setMeetLinkInput("");
      setFormData({ projectName: "", title: "", date: "", time: "" });
      setSelectedProjectId("");

      await fetchMeetings();
    } catch (err) {
      alert("Failed to save meeting");
    }
  };
  const totalMeetings = meetings.length;

  const thisWeek = meetings.filter((m) => {
    const d = new Date(m.scheduledAt);
    const now = new Date();

    const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  }).length;

  const thisMonth = meetings.filter((m) => {
    const d = new Date(m.scheduledAt);
    const now = new Date();
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  }).length;

  return (
    <div className={styles.container}>
      <SSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={styles.main}>
        <Header title="Meetings" subtitle="Welcome back, Muhammad Kamran" />

        <div className={styles.content}>
          <div className={styles.topSection}>
            <div className={styles.meet}>
              <div className={styles.meetHeader}>
                <div className={styles.meetIconTitle}>
                  <LuVideo className={styles.videoIcon} />
                  <span>Meet</span>
                </div>
              </div>

              <div className={styles.meetActionsPrimary}>
                <button
                  className={styles.primaryBtn}
                  onClick={() => setShowJoinModal(true)}
                >
                  Join
                </button>

                <button
                  className={styles.outlineBtn}
                  onClick={handleOpenCreateModal}
                >
                  + New meeting
                </button>
              </div>
            </div>

            <div className={styles.statsGrid}>
              <StatsCard
                value={totalMeetings}
                label="Upcoming Meetings"
                icon={<LuCalendar />}
                bgColor="#EEF2FF"
                iconColor="#2563EB"
              />

              <StatsCard
                value={thisWeek}
                label="This Week"
                icon={<LuUsers />}
                bgColor="#ECFDF5"
                iconColor="#16A34A"
              />

              <StatsCard
                value={thisMonth}
                label="This Month"
                icon={<LuMessageSquareText />}
                bgColor="#FFF7ED"
                iconColor="#F59E0B"
              />

              <StatsCard
                value={totalMeetings}
                label="Total Meetings"
                icon={<LuUserCheck />}
                bgColor="#EFF6FF"
                iconColor="#2563EB"
              />
            </div>
          </div>

          <div className={styles.sectionHeader}>
            <div className={styles.sectionTop}>
              <p className={styles.title}>Upcoming Meetings</p>
              <span className={styles.badge}>{meetings.length} Scheduled</span>
            </div>

            <div className={styles.meetingList}>
              {meetings.map((m) => {
                const dt = new Date(m.scheduledAt);
                return (
                  <div key={m.id} className={styles.meetingCard}>
                    <div className={styles.meetingInfo}>
                      <div className={styles.titleRow}>
                        <h4>{m.projectName}</h4>
                        <span className={styles.sessionBadge}>{m.title}</span>
                      </div>

                      <div className={styles.dateTimeRow}>
                        <LuCalendar />{" "}
                        <span>
                          {dt.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <div className={styles.dateTimeRow}>
                        <LuClock />{" "}
                        <span>
                          {dt.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div className={styles.linkRow}>
                        <LuLink /> <span>{m.link}</span>
                      </div>
                    </div>

                    <div className={styles.meetingActions}>
                      <button
                        className={styles.joinBtn}
                        onClick={() => joinMeeting(m.link)}
                      >
                        Join Meeting
                      </button>
                      <div className={styles.cardActionIcons}>
                        <button onClick={() => handleEditMeeting(m)}>
                          <LuPencil size={15} />
                        </button>

                        <button onClick={() => handleDeleteMeeting(m.id)}>
                          <LuTrash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── JOIN MEETING MODAL ── */}
          {showJoinModal && (
            <div
              className={styles.overlay}
              onClick={() => {
                setShowJoinModal(false);
                setJoinLink("");
              }}
            >
              <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className={styles.modalTitle}>Join Meeting</h3>
                <p className={styles.modalSubtitle}>
                  Paste a meeting link to join instantly.
                </p>

                <div className={styles.inputGroup}>
                  <div className={styles.inputWithIcon}>
                    <LuLink size={15} className={styles.inputIcon} />
                    <input
                      type="text"
                      placeholder="https://meet.google.com/abc-xyz"
                      className={styles.textInput}
                      value={joinLink}
                      onChange={(e) => setJoinLink(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleJoinConfirm()
                      }
                      autoFocus
                    />
                  </div>
                </div>

                <div className={styles.modalActions}>
                  <button
                    className={styles.cancelBtn}
                    onClick={() => {
                      setShowJoinModal(false);
                      setJoinLink("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className={styles.confirmBtn}
                    onClick={handleJoinConfirm}
                    disabled={!joinLink.trim()}
                  >
                    Join
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── CREATE MEETING MODAL ── */}
          {showCreateModal && (
            <div
              className={styles.overlay}
              onClick={() => setShowCreateModal(false)}
            >
              <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className={styles.modalTitle}>Create Meeting</h3>

                <div className={styles.inputGroup}>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                  >
                    <option value="">Select Project</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Meeting Title"
                    className={styles.textInput}
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />

                  <input
                    type="date"
                    className={styles.dateInput}
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />

                  <input
                    type="time"
                    className={styles.timeInput}
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                  />

                  {/* Step 1 — generate link button */}
                  {meetLinkStep === 1 && (
                    <button
                      className={styles.generateLinkBtn}
                      onClick={handleGenerateLink}
                    >
                      <LuVideo size={14} />
                      Open Google Meet to get link
                    </button>
                  )}

                  {/* Step 2 — paste the real link back */}
                  {meetLinkStep === 2 && (
                    <div className={styles.pasteLinkWrapper}>
                      <p className={styles.pasteLinkHint}>
                        Copy the link from the Google Meet tab and paste it
                        below.
                      </p>
                      <div className={styles.inputWithIcon}>
                        <LuLink size={15} className={styles.inputIcon} />
                        <input
                          type="text"
                          placeholder="https://meet.google.com/abc-defg-hij"
                          className={styles.textInput}
                          value={meetLinkInput}
                          onChange={(e) => setMeetLinkInput(e.target.value)}
                          autoFocus
                        />
                      </div>
                      <button
                        className={styles.generateLinkBtn}
                        style={{ marginTop: 8 }}
                        onClick={handleGenerateLink}
                      >
                        Re-open Google Meet
                      </button>
                    </div>
                  )}
                </div>

                <div className={styles.modalActions}>
                  <button
                    className={styles.cancelBtn}
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className={styles.confirmBtn}
                    onClick={handleCreateMeeting}
                    disabled={meetLinkStep === 1 || !meetLinkInput.trim()}
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SMeetings;
