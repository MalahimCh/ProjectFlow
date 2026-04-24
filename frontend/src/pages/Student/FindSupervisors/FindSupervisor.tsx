import InitSidebar from "../Sidebar/InitSidebar";
import { type FC, useState } from "react";
import styles from "./FindSupervisor.module.css";
import Header from "../../../components/Header/Header";
import {
  LuSearch,
  LuSend,
  LuMail,
  LuUser,
  LuBookOpen,
  LuUsers,
} from "react-icons/lu";

/* ================= MOCK DATA ================= */

const supervisors = [
  {
    id: "1",
    name: "Dr. Ayesha Malik",
    qualification: "PhD in Artificial Intelligence",
    department: "Computer Science",
    mail: "ayesha.malik@uni.edu",
    specialization: ["Machine Learning", "Deep Learning", "AI"],
    currentLoad: 3,
    maxLoad: 4,
  },
  {
    id: "2",
    name: "Dr. Usman Tariq",
    qualification: "PhD in Software Engineering",
    department: "Software Engineering",
    mail: "usman.tariq@uni.edu",
    specialization: ["Web Engineering", "React", "System Design"],
    currentLoad: 2,
    maxLoad: 4,
  },
  {
    id: "3",
    name: "Dr. Hira Shah",
    qualification: "PhD in Data Science",
    department: "Computer Science",
    mail: "hira.shah@uni.edu",
    specialization: ["Data Mining", "Python", "Analytics"],
    currentLoad: 4,
    maxLoad: 4,
  },
  {
    id: "4",
    name: "Dr. Ali Raza",
    qualification: "PhD in Cyber Security",
    department: "Computer Science",
    mail: "ali.raza@uni.edu",
    specialization: ["Ethical Hacking", "Network Security", "Cryptography"],
    currentLoad: 1,
    maxLoad: 4,
  },
  {
    id: "5",
    name: "Dr. Sara Khan",
    qualification: "PhD in Human Computer Interaction",
    department: "Software Engineering",
    mail: "sara.khan@uni.edu",
    specialization: ["UI/UX", "Usability", "Figma"],
    currentLoad: 2,
    maxLoad: 4,
  },
  {
    id: "6",
    name: "Dr. Hassan Raza",
    qualification: "PhD in Cloud Computing",
    department: "Computer Science",
    mail: "hassan.raza@uni.edu",
    specialization: ["AWS", "Azure", "Distributed Systems"],
    currentLoad: 3,
    maxLoad: 4,
  },
  {
    id: "7",
    name: "Dr. Areeba Noor",
    qualification: "PhD in Machine Learning",
    department: "Computer Science",
    mail: "areeba.noor@uni.edu",
    specialization: ["AI", "Neural Networks", "Deep Learning"],
    currentLoad: 4,
    maxLoad: 4,
  },
  {
    id: "8",
    name: "Dr. Bilal Ahmed",
    qualification: "PhD in Database Systems",
    department: "Computer Science",
    mail: "bilal.ahmed@uni.edu",
    specialization: ["SQL", "NoSQL", "Data Warehousing"],
    currentLoad: 2,
    maxLoad: 4,
  },
  {
    id: "9",
    name: "Dr. Fatima Zahra",
    qualification: "PhD in Mobile Computing",
    department: "Software Engineering",
    mail: "fatima.zahra@uni.edu",
    specialization: ["Android", "Flutter", "iOS Development"],
    currentLoad: 3,
    maxLoad: 4,
  },
  {
    id: "10",
    name: "Dr. Omar Farooq",
    qualification: "PhD in DevOps",
    department: "Computer Science",
    mail: "omar.farooq@uni.edu",
    specialization: ["Docker", "Kubernetes", "CI/CD"],
    currentLoad: 1,
    maxLoad: 4,
  },
  {
    id: "11",
    name: "Dr. Zainab Ali",
    qualification: "PhD in Artificial Intelligence",
    department: "Computer Science",
    mail: "zainab.ali@uni.edu",
    specialization: ["AI", "Robotics", "Computer Vision"],
    currentLoad: 3,
    maxLoad: 4,
  },
  {
    id: "12",
    name: "Dr. Hamza Saeed",
    qualification: "PhD in Information Security",
    department: "Computer Science",
    mail: "hamza.saeed@uni.edu",
    specialization: ["Cyber Security", "Penetration Testing", "Forensics"],
    currentLoad: 2,
    maxLoad: 4,
  },
  {
    id: "13",
    name: "Dr. Laiba Khan",
    qualification: "PhD in Frontend Engineering",
    department: "Software Engineering",
    mail: "laiba.khan@uni.edu",
    specialization: ["React", "Next.js", "CSS Architecture"],
    currentLoad: 1,
    maxLoad: 4,
  },
  {
    id: "14",
    name: "Dr. Arslan Mehmood",
    qualification: "PhD in Backend Systems",
    department: "Software Engineering",
    mail: "arslan.mehmood@uni.edu",
    specialization: ["Node.js", "APIs", "Microservices"],
    currentLoad: 3,
    maxLoad: 4,
  },
  {
    id: "15",
    name: "Dr. Esha Butt",
    qualification: "PhD in Big Data Analytics",
    department: "Computer Science",
    mail: "esha.butt@uni.edu",
    specialization: ["Hadoop", "Spark", "Data Engineering"],
    currentLoad: 4,
    maxLoad: 4,
  },
];

/* ================= COMPONENT ================= */

const FindSupervisor: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = supervisors.filter((s) => {
    const q = search.toLowerCase();

    return (
      s.name.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q) ||
      s.qualification.toLowerCase().includes(q) ||
      s.specialization.some((sp) => sp.toLowerCase().includes(q))
    );
  });

  return (
    <div className={styles.container}>
      <InitSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={styles.main}>
        <Header
          title="Find Supervisor"
          subtitle="Select a supervisor for your FYP guidance"
          userName="Malahim Chaudhary"
          userId="CO2024001"
        />

        <div className={styles.content}>
          {/* SEARCH */}
          <div className={styles.searchBar}>
            <LuSearch />
            <input
              placeholder="Search supervisors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* GRID */}
          <div className={styles.grid}>
            {filtered.map((s) => {
              return (
                <div key={s.id} className={styles.card}>
                  {/* NAME + QUALIFICATION */}
                  <div className={styles.top}>
                    <div className={styles.avatar}>
                      <LuUser />
                    </div>

                    <div>
                      <p className={styles.name}>{s.name}</p>
                      <p className={styles.qual}>{s.qualification}</p>
                    </div>
                  </div>

                  {/* DEPARTMENT */}
                  <div className={styles.row}>
                    <LuBookOpen />
                    <span>{s.department}</span>
                  </div>

                  {/* EMAIL */}
                  <div className={styles.row}>
                    <LuMail />
                    <span>{s.mail}</span>
                  </div>

                  {/* SPECIALIZATION */}
                  <div className={styles.section}>
                    <p className={styles.label}>Specialization</p>
                    <div className={styles.tags}>
                      {s.specialization.map((sp, i) => (
                        <span key={i} className={styles.tag}>
                          {sp}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* WORKLOAD */}
                  <div className={styles.workloadHeader}>
                    <LuUsers />
                    <span>Current Workload</span>
                    <span className={styles.loadText}>
                      {s.currentLoad}/{s.maxLoad}
                    </span>
                  </div>

                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{
                        width: `${(s.currentLoad / s.maxLoad) * 100}%`,
                        background:
                          s.currentLoad === 4
                            ? "#ef4444" // red
                            : s.currentLoad === 3
                              ? "#f59e0b" // orange
                              : "#22c55e", // green
                      }}
                    />
                  </div>

                  {/* BUTTON */}
                  <button className={styles.button}>
                    <LuSend /> Request Supervisor
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindSupervisor;
