import InitSidebar from "../Sidebar/InitSidebar";
import { type FC, useState } from "react";
import styles from "./FindTeam.module.css";
import Header from "../../../components/Header/Header";
import { LuSearch, LuSend } from "react-icons/lu";

/* ================= MOCK DATA ================= */

const students = [
  {
    id: "1",
    name: "Sarah Ahmed",
    reg: "2020-CS-145",
    department: "Computer Science",
    cgpa: 3.6,
    interests: ["Machine Learning", "AI"],
  },
  {
    id: "2",
    name: "Ali Khan",
    reg: "2020-CS-101",
    department: "Computer Science",
    cgpa: 3.2,
    interests: ["Web Dev", "React"],
  },
  {
    id: "3",
    name: "Hassan Raza",
    reg: "2020-SE-167",
    department: "Software Engineering",
    cgpa: 3.8,
    interests: ["Data Science", "Python"],
  },
  {
    id: "4",
    name: "Ayesha Noor",
    reg: "2020-CS-189",
    department: "Computer Science",
    cgpa: 3.5,
    interests: ["UI/UX", "Figma"],
  },
  {
    id: "5",
    name: "Usman Tariq",
    reg: "2020-CS-110",
    department: "Computer Science",
    cgpa: 2.9,
    interests: ["Networking", "Cyber Security"],
  },
  {
    id: "6",
    name: "Fatima Zahra",
    reg: "2020-SE-121",
    department: "Software Engineering",
    cgpa: 3.7,
    interests: ["Mobile Apps", "Flutter"],
  },
  {
    id: "7",
    name: "Bilal Ahmed",
    reg: "2020-CS-133",
    department: "Computer Science",
    cgpa: 3.1,
    interests: ["Databases", "SQL"],
  },
  {
    id: "8",
    name: "Zainab Ali",
    reg: "2020-SE-144",
    department: "Software Engineering",
    cgpa: 3.9,
    interests: ["AI", "Deep Learning"],
  },
  {
    id: "9",
    name: "Omar Farooq",
    reg: "2020-CS-156",
    department: "Computer Science",
    cgpa: 2.8,
    interests: ["Web Dev", "Node.js"],
  },
  {
    id: "10",
    name: "Hira Malik",
    reg: "2020-CS-178",
    department: "Computer Science",
    cgpa: 3.4,
    interests: ["UI/UX", "CSS"],
  },
  {
    id: "11",
    name: "Danish Iqbal",
    reg: "2020-SE-190",
    department: "Software Engineering",
    cgpa: 3.3,
    interests: ["Cloud Computing", "AWS"],
  },
  {
    id: "12",
    name: "Noor Fatima",
    reg: "2020-CS-201",
    department: "Computer Science",
    cgpa: 3.9,
    interests: ["AI", "Machine Learning"],
  },
  {
    id: "13",
    name: "Hamza Saeed",
    reg: "2020-CS-212",
    department: "Computer Science",
    cgpa: 3.0,
    interests: ["Cyber Security", "Ethical Hacking"],
  },
  {
    id: "14",
    name: "Sana Javed",
    reg: "2020-SE-223",
    department: "Software Engineering",
    cgpa: 3.6,
    interests: ["React Native", "Mobile Apps"],
  },
  {
    id: "15",
    name: "Rehan Shah",
    reg: "2020-CS-234",
    department: "Computer Science",
    cgpa: 2.7,
    interests: ["Game Development", "Unity"],
  },
  {
    id: "16",
    name: "Laiba Khan",
    reg: "2020-CS-245",
    department: "Computer Science",
    cgpa: 3.5,
    interests: ["UI/UX", "Frontend"],
  },
  {
    id: "17",
    name: "Arslan Mehmood",
    reg: "2020-SE-256",
    department: "Software Engineering",
    cgpa: 3.2,
    interests: ["Backend", "Node.js"],
  },
  {
    id: "18",
    name: "Esha Butt",
    reg: "2020-CS-267",
    department: "Computer Science",
    cgpa: 3.8,
    interests: ["AI", "Data Science"],
  },
  {
    id: "19",
    name: "Muneeb Ali",
    reg: "2020-CS-278",
    department: "Computer Science",
    cgpa: 3.1,
    interests: ["DevOps", "Docker"],
  },
  {
    id: "20",
    name: "Iqra Anwar",
    reg: "2020-SE-289",
    department: "Software Engineering",
    cgpa: 3.7,
    interests: ["Mobile Apps", "Kotlin"],
  },
];

/* ================= COMPONENT ================= */

const FindTeam: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");

  /* ===== FILTER ===== */
  const filteredStudents = students.filter((s) => {
    const query = search.toLowerCase();

    return (
      s.name.toLowerCase().includes(query) ||
      s.reg.toLowerCase().includes(query) ||
      s.department.toLowerCase().includes(query) ||
      s.interests.some((i) => i.toLowerCase().includes(query))
    );
  });

  return (
    <div className={styles.container}>
      <InitSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={styles.main}>
        <Header
          title="Find Team"
          subtitle="Invite students to join your FYP group"
          userName="Malahim Chaudhary"
          userId="CO2024001"
        />

        <div className={styles.content}>
          {/* 🔍 SEARCH BAR */}
          <div className={styles.searchBar}>
            <LuSearch />
            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* 👤 GRID */}
          <div className={styles.grid}>
            {filteredStudents.map((s) => (
              <div key={s.id} className={styles.card}>
                {/* Avatar */}
                <div className={styles.top}>
                  <div className={styles.avatar}>
                    {s.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>

                  <div>
                    <p className={styles.name}>{s.name}</p>
                    <p className={styles.reg}>{s.reg}</p>
                  </div>
                </div>

                {/* Info */}
                <div className={styles.section}>
                  <p className={styles.label}>Department</p>
                  <p>{s.department}</p>
                </div>

                <div className={styles.section}>
                  <p className={styles.label}>CGPA</p>
                  <p>{s.cgpa}</p>
                </div>

                <div className={styles.section}>
                  <p className={styles.label}>Interests</p>
                  <div className={styles.tags}>
                    {s.interests.map((tag, i) => (
                      <span key={i} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Button */}
                <button className={styles.button}>
                  <LuSend /> Send Request
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindTeam;
