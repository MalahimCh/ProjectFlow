import StudSidebar from "../Sidebar/StudSidebar";
import { type FC, useState } from "react";
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
} from "react-icons/lu";

type Meeting = {
  id: string;
  title: string;
  date: string;
  time: string;
  link: string;
};

const StudMeetings: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinLink, setJoinLink] = useState("");

  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: "1",
      title: "Feedback Session",
      date: "Mar 18, 2026",
      time: "10:00 AM - 11:00 AM",
      link: "https://meet.google.com/abc-defg-hij",
    },
    {
      id: "2",
      title: "Progress Review",
      date: "Mar 19, 2026",
      time: "02:00 PM - 03:00 PM",
      link: "https://meet.google.com/xyz-mnp-qrs",
    },
  ]);
  const [formData, setFormData] = useState({
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
    setFormData({
      title: "",
      date: "",
      time: "",
    });
    setShowCreateModal(true);
  };

  const handleGenerateLink = () => {
    window.open("https://meet.google.com/new", "_blank");
    setMeetLinkStep(2);
  };

  const handleCreateMeeting = () => {
    if (!formData.title || !meetLinkInput.trim()) {
      alert("Fill all fields and paste the meeting link.");
      return;
    }

    const newMeeting: Meeting = {
      id: Date.now().toString(),
      title: formData.title,
      date: formData.date,
      time: formData.time,
      link: meetLinkInput.trim(),
    };

    setMeetings((prev) => [...prev, newMeeting]);
    setShowCreateModal(false);
    setMeetLinkStep(1);
    setMeetLinkInput("");
    setFormData({
      title: "",
      date: "",
      time: "",
    });
  };

  return (
    <div className={styles.container}>
      <StudSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={styles.main}>
        <Header
          title="Meetings"
          subtitle="Welcome back, Muhammad Kamran"
          userName="Muhammad Kamran"
          userId="SP2024001"
        />

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
                value={4}
                label="Upcoming Meetings"
                icon={<LuCalendar />}
                bgColor="#EEF2FF"
                iconColor="#2563EB"
              />
              <StatsCard
                value={3}
                label="This Week"
                icon={<LuUsers />}
                bgColor="#ECFDF5"
                iconColor="#16A34A"
              />
              <StatsCard
                value={8}
                label="Completed This Month"
                icon={<LuMessageSquareText />}
                bgColor="#FFF7ED"
                iconColor="#F59E0B"
              />
              <StatsCard
                value={11}
                label="Total This Year"
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
              {meetings.map((m) => (
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
                    <button
                      className={styles.joinBtn}
                      onClick={() => joinMeeting(m.link)}
                    >
                      Join Meeting
                    </button>
                  </div>
                </div>
              ))}
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

export default StudMeetings;
