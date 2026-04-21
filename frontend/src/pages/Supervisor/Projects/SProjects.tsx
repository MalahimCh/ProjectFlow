import SSidebar from "../Sidebar/Ssidebar";
import { type FC, useState } from "react";
import styles from "./SProjects.module.css";
import Header from "../../../components/Header/Header";
import StatsCard from "../../../components/StatsCard/StatsCard";
import { LuUsers,LuMessageSquareText,LuCalendar, LuUserCheck } from "react-icons/lu"
import { useNavigate } from "react-router-dom";

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
      time: "15:00"
    }
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
      time: "11:00"
    }
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
      time: "10:30"
    }
  }
];

const SProjects: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const handleProjectClick = (id: string) => {
  navigate(`/supervisor/projects/${id}`);
};

  return (
    <div className={styles.container}>
      <SSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={styles.main}>
        <Header
          title="Projects"
          subtitle="View and manage your projects"
          userName="Junaid Hussain"
          userId="CO2024001"
        />

        <div className={styles.content}>
          
          <div className={styles.statsGrid}>
            <StatsCard value={2} label="Total Groups" icon={<LuUsers />} bgColor="#EFF6FF" iconColor="#0D3CCF"/>
            <StatsCard value={3} label="Total Students" icon={<LuMessageSquareText />} bgColor="#FFF7ED" iconColor="#F59E0B"/>
            <StatsCard value={0} label="Upcoming Deadlines" icon={<LuCalendar />} bgColor="#F0FDF4" iconColor="#16A34A"/>
            <StatsCard value={6} label="Lagging Groups" icon={<LuUserCheck />} bgColor="#FEF2F2" iconColor="#DC2626"/>
          </div>

        <div className={styles.sectionHeader}>
            <p className={styles.title}>All Supervised Groups</p>
          <div className={styles.projectGrid}>
  {projects.map((project) => (
    <div
      key={project.id}
      className={styles.projectCard}
      onClick={() => handleProjectClick(project.id)}
    >
      <h3>{project.name}</h3>

      <p className={styles.desc}>{project.description}</p>

      <div className={styles.meta}>
        <span>👥 {project.members} Members</span>
        <span>📊 {project.progress}%</span>
      </div>

      <div className={styles.deadline}>
        <strong>{project.deadline.type}</strong>
        <p>
          {project.deadline.dueDate} • {project.deadline.time}
        </p>
      </div>
    </div>
  ))}
</div>

</div>


        </div>
      </div>
    </div>
  );
};

export default SProjects;
