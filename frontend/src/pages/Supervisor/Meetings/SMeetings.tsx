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
} from "react-icons/lu";

type Meeting = {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  date: string;
  time: string;
  link: string;
};
const projects = [
  {
    id: "p1",
    name: "AI Chatbot System",
    description: "Final year AI chatbot for student support",
    members: 4,
    progress: 70,
    deadline: {
      type: "Milestone Submission",
      dueDate: "2026-04-25",
      time: "15:00",
    },
  },
  {
    id: "p2",
    name: "FYP Management Portal",
    description: "Web system to manage final year projects",
    members: 3,
    progress: 40,
    deadline: {
      type: "Report Submission",
      dueDate: "2026-04-28",
      time: "11:00",
    },
  },
  {
    id: "p3",
    name: "Smart Attendance System",
    description: "Face recognition based attendance system",
    members: 5,
    progress: 85,
    deadline: {
      type: "Demo",
      dueDate: "2026-05-02",
      time: "10:30",
    },
  },
];

const SMeetings: FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    projectId: "",
    title: "",
    date: "",
    time: "",
  });

  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: "m1",
      projectId: "p1",
      projectName: "AI Chatbot System",
      title: "Weekly Sync",
      date: "2026-04-22",
      time: "14:00",
      link: "https://meet.google.com/abc-defg-hij",
    },
  ]);
  const generateMeetLink = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    const random = () =>
      Array.from(
        { length: 3 },
        () => chars[Math.floor(Math.random() * chars.length)],
      ).join("");

    return `https://meet.google.com/${random()}-${random()}-${random()}`;
  };

  const handleCreateMeeting = () => {
    const selectedProject = projects.find((p) => p.id === formData.projectId);

    if (
      !selectedProject ||
      !formData.title ||
      !formData.date ||
      !formData.time
    ) {
      alert("Please fill all fields");
      return;
    }

    const newMeeting: Meeting = {
      id: Date.now().toString(),
      projectId: selectedProject.id,
      projectName: selectedProject.name,
      title: formData.title,
      date: formData.date,
      time: formData.time,
      link: generateMeetLink(),
    };

    setMeetings((prev) => [...prev, newMeeting]);

    // reset + close
    setFormData({
      projectId: "",
      title: "",
      date: "",
      time: "",
    });
    setShowModal(false);
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const joinMeeting = (link: string) => {
    window.open(link, "_blank");
  };
  return (
    <div className={styles.container}>
      <SSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={styles.main}>
        <Header
          title="Meetings"
          subtitle="View and manage your meetings"
          userName="Junaid Hussain"
          userId="CO2024001"
        />

        <div className={styles.content}>
          <div className={styles.topSection}>
            <div className={styles.meet}>
              <button onClick={() => setShowModal(true)}>+ New Meeting</button>

              <button
                onClick={() => {
                  const link = prompt("Enter meeting link");
                  if (link) joinMeeting(link);
                }}
              >
                Join with Code
              </button>
            </div>
            <div className={styles.statsGrid}>
              <StatsCard
                value={2}
                label="Total Groups"
                icon={<LuUsers />}
                bgColor="#EFF6FF"
                iconColor="#0D3CCF"
              />
              <StatsCard
                value={3}
                label="Total Students"
                icon={<LuMessageSquareText />}
                bgColor="#FFF7ED"
                iconColor="#F59E0B"
              />
              <StatsCard
                value={0}
                label="Upcoming Deadlines"
                icon={<LuCalendar />}
                bgColor="#F0FDF4"
                iconColor="#16A34A"
              />
              <StatsCard
                value={6}
                label="Lagging Groups"
                icon={<LuUserCheck />}
                bgColor="#FEF2F2"
                iconColor="#DC2626"
              />
            </div>
          </div>

          <div className={styles.sectionHeader}>
            <p className={styles.title}>Upcoming Meetings</p>
            <div className={styles.meetingList}>
              {meetings.map((m) => (
                <div key={m.id} className={styles.meetingCard}>
                  <div>
                    <h4>{m.projectName}</h4>
                    <p>{m.title}</p>
                    <p>
                      {m.date} | {m.time}
                    </p>
                  </div>

                  <div>
                    <a href={m.link} target="_blank">
                      {m.link}
                    </a>

                    <button onClick={() => joinMeeting(m.link)}>Join</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {showModal && (
            <div className={styles.overlay}>
              <div className={styles.modal}>
                <h3>Create Meeting</h3>

                <select
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleChange}
                >
                  <option value="">Select Project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  name="title"
                  placeholder="Meeting Title"
                  value={formData.title}
                  onChange={handleChange}
                />

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />

                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                />

                <div className={styles.modalActions}>
                  <button onClick={handleCreateMeeting}>Create</button>
                  <button onClick={() => setShowModal(false)}>Cancel</button>
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
