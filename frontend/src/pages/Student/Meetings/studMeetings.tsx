import StudSidebar from "../Sidebar/StudSidebar";
import { type FC, useEffect, useState } from "react";
import styles from "./StudMeetings.module.css";
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
  LuPencil,
  LuTrash2,
} from "react-icons/lu";
import {
  getStudentMeetings,
  createStudentMeeting,
  updateMeeting,
  deleteMeeting,
} from "../../../services/studentService";

type Meeting = {
  id: string;
  title: string;
  date: string;
  time: string;
  link: string;
};

const isMobile = () =>
  typeof window !== "undefined" && window.innerWidth <= 767;

const StudMeetings: FC = () => {
  const [collapsed, setCollapsed] = useState(() => isMobile());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinLink, setJoinLink] = useState("");
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({ title: "", date: "", time: "" });
  const [meetLinkInput, setMeetLinkInput] = useState("");
  const [meetLinkStep, setMeetLinkStep] = useState<1 | 2>(1);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 767) setCollapsed(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const data = await getStudentMeetings();
      const formatted: Meeting[] = (data.meetings || []).map((m: any) => {
        const dt = new Date(m.scheduledAt);
        return {
          id: m.id,
          title: m.title,
          date: dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          time: dt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          link: m.meetingUrl || "",
        };
      });
      setMeetings(formatted);
    } catch (error) {
      console.error("Failed to fetch meetings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMeetings(); }, []);

  const joinMeeting = (link: string) => {
    if (!link) return;
    window.open(link, "_blank");
  };

  const handleJoinConfirm = () => {
    if (!joinLink.trim()) return;
    joinMeeting(joinLink.trim());
    setShowJoinModal(false);
    setJoinLink("");
  };

  const handleOpenCreateModal = () => {
    setEditingMeeting(null);
    setMeetLinkStep(1);
    setMeetLinkInput("");
    setFormData({ title: "", date: "", time: "" });
    setShowCreateModal(true);
  };

  const handleGenerateLink = () => {
    window.open("https://meet.google.com/new", "_blank");
    setMeetLinkStep(2);
  };

  const handleEditMeeting = (meeting: Meeting) => {
    setEditingMeeting(meeting);
    const parsedDate = new Date(`${meeting.date} ${meeting.time}`);
    const yyyy = parsedDate.getFullYear();
    const mm = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const dd = String(parsedDate.getDate()).padStart(2, "0");
    const hh = String(parsedDate.getHours()).padStart(2, "0");
    const min = String(parsedDate.getMinutes()).padStart(2, "0");
    setFormData({ title: meeting.title, date: `${yyyy}-${mm}-${dd}`, time: `${hh}:${min}` });
    setMeetLinkInput(meeting.link);
    setMeetLinkStep(2);
    setShowCreateModal(true);
  };

  const handleDeleteMeeting = async (meetingId: string) => {
    if (!window.confirm("Are you sure you want to delete this meeting?")) return;
    try {
      await deleteMeeting(meetingId);
      await fetchMeetings();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to delete meeting.");
    }
  };

  const handleCreateMeeting = async () => {
    if (!formData.title || !formData.date || !formData.time || !meetLinkInput.trim()) {
      alert("Fill all fields and paste the meeting link.");
      return;
    }
    try {
      setSubmitting(true);
      const scheduledAt = new Date(`${formData.date}T${formData.time}`).toISOString();
      if (editingMeeting) {
        await updateMeeting(editingMeeting.id, { title: formData.title, scheduledAt, meetingUrl: meetLinkInput.trim() });
      } else {
        await createStudentMeeting({ title: formData.title, scheduledAt, meetingUrl: meetLinkInput.trim() });
      }
      setShowCreateModal(false);
      setEditingMeeting(null);
      setMeetLinkStep(1);
      setMeetLinkInput("");
      setFormData({ title: "", date: "", time: "" });
      await fetchMeetings();
    } catch (error: any) {
      alert(error?.response?.data?.message || (editingMeeting ? "Failed to update meeting." : "Failed to create meeting."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <StudSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={styles.main}>
        <Header title="Meetings" subtitle="View your upcoming meetings" />

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
                <button className={styles.primaryBtn} onClick={() => setShowJoinModal(true)}>
                  Join
                </button>
                <button className={styles.outlineBtn} onClick={handleOpenCreateModal}>
                  + New meeting
                </button>
              </div>
            </div>

            <div className={styles.statsGrid}>
              <StatsCard value={meetings.length} label="Upcoming Meetings" icon={<LuCalendar />} bgColor="#EEF2FF" iconColor="#2563EB" />
              <StatsCard value={meetings.length} label="This Week" icon={<LuUsers />} bgColor="#ECFDF5" iconColor="#16A34A" />
              <StatsCard value={meetings.length} label="Completed This Month" icon={<LuMessageSquareText />} bgColor="#FFF7ED" iconColor="#F59E0B" />
              <StatsCard value={meetings.length} label="Total This Year" icon={<LuUserCheck />} bgColor="#EFF6FF" iconColor="#2563EB" />
            </div>
          </div>

          <div className={styles.sectionHeader}>
            <div className={styles.sectionTop}>
              <p className={styles.title}>Upcoming Meetings</p>
              <span className={styles.badge}>{meetings.length} Scheduled</span>
            </div>

            <div className={styles.meetingList}>
              {loading ? (
                <p>Loading meetings...</p>
              ) : meetings.length === 0 ? (
                <p>No meetings scheduled.</p>
              ) : (
                meetings.map((m) => (
                  <div key={m.id} className={styles.meetingCard}>
                    <div className={styles.meetingInfo}>
                      <div className={styles.titleRow}>
                        <h4>{m.title}</h4>
                      </div>
                      <div className={styles.dateTimeRow}>
                        <LuCalendar /> <span>{m.date}</span>
                      </div>
                      <div className={styles.dateTimeRow}>
                        <LuClock /> <span>{m.time}</span>
                      </div>
                      <div className={styles.linkRow}>
                        <LuLink /> <span>{m.link}</span>
                      </div>
                    </div>

                    <div className={styles.meetingActions}>
                      <button className={styles.joinBtn} onClick={() => joinMeeting(m.link)}>
                        Join Meeting
                      </button>
                      <div className={styles.cardActionIcons}>
                        <button type="button" className={styles.iconBtn} title="Edit Meeting" onClick={() => handleEditMeeting(m)}>
                          <LuPencil size={15} />
                        </button>
                        <button type="button" className={styles.iconBtnDanger} title="Delete Meeting" onClick={() => handleDeleteMeeting(m.id)}>
                          <LuTrash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* JOIN MEETING MODAL */}
          {showJoinModal && (
            <div className={styles.overlay} onClick={() => { setShowJoinModal(false); setJoinLink(""); }}>
              <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h3 className={styles.modalTitle}>Join Meeting</h3>
                <p className={styles.modalSubtitle}>Paste a meeting link to join instantly.</p>
                <div className={styles.inputGroup}>
                  <div className={styles.inputWithIcon}>
                    <LuLink size={15} className={styles.inputIcon} />
                    <input
                      type="text"
                      placeholder="https://meet.google.com/abc-xyz"
                      className={styles.textInput}
                      value={joinLink}
                      onChange={(e) => setJoinLink(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleJoinConfirm()}
                      autoFocus
                    />
                  </div>
                </div>
                <div className={styles.modalActions}>
                  <button className={styles.cancelBtn} onClick={() => { setShowJoinModal(false); setJoinLink(""); }}>Cancel</button>
                  <button className={styles.confirmBtn} onClick={handleJoinConfirm} disabled={!joinLink.trim()}>Join</button>
                </div>
              </div>
            </div>
          )}

          {/* CREATE / EDIT MEETING MODAL */}
          {showCreateModal && (
            <div className={styles.overlay} onClick={() => setShowCreateModal(false)}>
              <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h3 className={styles.modalTitle}>{editingMeeting ? "Edit Meeting" : "Create Meeting"}</h3>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    placeholder="Meeting Title"
                    className={styles.textInput}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                  <input
                    type="date"
                    className={styles.dateInput}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                  <input
                    type="time"
                    className={styles.timeInput}
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                  {meetLinkStep === 1 && (
                    <button className={styles.generateLinkBtn} onClick={handleGenerateLink}>
                      <LuVideo size={14} />
                      Open Google Meet to get link
                    </button>
                  )}
                  {meetLinkStep === 2 && (
                    <div className={styles.pasteLinkWrapper}>
                      <p className={styles.pasteLinkHint}>Copy the link from the Google Meet tab and paste it below.</p>
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
                      <button className={styles.generateLinkBtn} style={{ marginTop: 8 }} onClick={handleGenerateLink}>
                        Re-open Google Meet
                      </button>
                    </div>
                  )}
                </div>
                <div className={styles.modalActions}>
                  <button className={styles.cancelBtn} onClick={() => setShowCreateModal(false)}>Cancel</button>
                  <button
                    className={styles.confirmBtn}
                    onClick={handleCreateMeeting}
                    disabled={submitting || meetLinkStep === 1 || !meetLinkInput.trim()}
                  >
                    {submitting
                      ? editingMeeting ? "Updating..." : "Creating..."
                      : editingMeeting ? "Update" : "Create"}
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

export default StudMeetings;