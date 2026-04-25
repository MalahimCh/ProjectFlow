import SSidebar from "../Sidebar/Ssidebar";
import { type FC, useState } from "react";
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
  
} from "react-icons/lu";

type Meeting = {
  id: string;
  projectName: string;
  title: string;
  date: string;
  time: string;
  link: string;
};

const availableProjects = ["Mobile Mavericks", "Data Dynamics", "Alpha Innovators"];// dummy project to select from 

const SMeetings: FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: "1",
      projectName: "Mobile Mavericks",
      title: "Feedback Session",
      date: "Mar 18, 2026",
      time: "10:00 AM - 11:00 AM",
      link: "https://meet.google.com/abc-defg-hij",
    },
    {
      id: "2",
      projectName: "Data Dynamics",
      title: "Progress Review",
      date: "Mar 19, 2026",
      time: "02:00 PM - 03:00 PM",
      link: "https://meet.google.com/xyz-mnp-qrs",
    },
  ]);

  const [formData, setFormData] = useState({
    projectName: "",
    title: "",
    date: "",
    time: "",
  });

  const joinMeeting = (link: string) => {
    window.open(link, "_blank");
  };

  //generate dummy meet link
  const generateMeetLink = () => {
    return "https://meet.google.com/" + Math.random().toString(36).substring(7);
  };

  //create meeting handler
  const handleCreateMeeting = () => {
    if (!formData.projectName || !formData.title) {
      alert("Fill all fields");
      return;
    }

    const newMeeting: Meeting = {
      id: Date.now().toString(),
      projectName: formData.projectName,
      title: formData.title,
      date: formData.date,
      time: formData.time,
      link: generateMeetLink(),
    };

    setMeetings((prev) => [...prev, newMeeting]);
    setShowModal(false);

    setFormData({
      projectName: "",
      title: "",
      date: "",
      time: "",
    });
  };

  return (
    <div className={styles.container}>
      <SSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

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
                  onClick={() => {
                    const link = prompt("Enter meeting link");
                    if (link) joinMeeting(link);
                  }}
                >
                  Join
                </button>

                <button
                  className={styles.outlineBtn}
                  onClick={() => setShowModal(true)}
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
              <span className={styles.badge}>
                {meetings.length} Scheduled { }
              </span>
            </div>

      <div className={styles.meetingList}>
  {meetings.map((m) => (
    <div key={m.id} className={styles.meetingCard}>
      
      {/* details */}
      <div className={styles.meetingInfo}>
        <div className={styles.titleRow}>
          <h4>{m.projectName}</h4>
          <span className={styles.sessionBadge}>{m.title}</span>
        </div>
        
         {/* Row 2: Date */}
  <div className={styles.dateTimeRow}>
    <LuCalendar /> <span>{m.date}</span>
  </div>

  {/* Row 3: Time */}
  <div className={styles.dateTimeRow}>
    <LuClock /> <span>{m.time}</span>
  </div>

        <div className={styles.linkRow}>
          <LuLink /> <span>{m.link}</span>
        </div>
      </div>

      {/* join meeting */}
      <div className={styles.meetingActions}>
        <button className={styles.joinBtn} onClick={() => joinMeeting(m.link)}>
          Join Meeting
        </button>
       
      </div>

    </div>
  ))}
</div>
          </div>

         {/* MODAL SECTION */}
{showModal && (
  <div className={styles.overlay}>
    <div className={styles.modal}>
      <h3 className={styles.modalTitle}>Create Meeting</h3>

      <div className={styles.inputGroup}>
        <select
          className={styles.selectInput}
          value={formData.projectName}
          onChange={(e) =>
            setFormData({ ...formData, projectName: e.target.value })
          }
        >
          <option value="" disabled>Select Project</option>
          {availableProjects.map((project) => (
            <option key={project} value={project}>
              {project}
            </option>
          ))}
        </select>

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
      </div>

      <div className={styles.modalActions}>
        <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>
          Cancel
        </button>
        <button className={styles.confirmBtn} onClick={handleCreateMeeting}>
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