import InitSidebar from "../Sidebar/InitSidebar";
import { type FC, useState, useRef, useEffect } from "react";
import styles from "./FindTeam.module.css";
import Header from "../../../components/Header/Header";
import { LuSearch, LuSend, LuFilter, LuChevronDown, LuCheck, LuX } from "react-icons/lu";

/* ================= TYPES ================= */
type Department = "Computer Science" | "Software Engineering" | "Data Science";

type Student = {
  id: string;
  name: string;
  rollNo: string;
  department: Department;
  cgpa: number;
  interests: string[];
};

/* ================= MOCK DATA ================= */
const students: Student[] = [
  { id: "1",  name: "Sarah Ahmed",     rollNo: "23L-0876", department: "Computer Science",    cgpa: 3.6, interests: ["Machine Learning", "AI"] },
  { id: "2",  name: "Ali Khan",        rollNo: "23L-0512", department: "Computer Science",    cgpa: 3.2, interests: ["Web Dev", "React"] },
  { id: "3",  name: "Hassan Raza",     rollNo: "23L-0731", department: "Software Engineering", cgpa: 3.8, interests: ["Data Science", "Python"] },
  { id: "4",  name: "Ayesha Noor",     rollNo: "23L-0654", department: "Computer Science",    cgpa: 3.5, interests: ["UI/UX", "Figma"] },
  { id: "5",  name: "Usman Tariq",     rollNo: "23L-0589", department: "Computer Science",    cgpa: 2.9, interests: ["Networking", "Cyber Security"] },
  { id: "6",  name: "Fatima Zahra",    rollNo: "23L-0812", department: "Software Engineering", cgpa: 3.7, interests: ["Mobile Apps", "Flutter"] },
  { id: "7",  name: "Bilal Ahmed",     rollNo: "23L-0503", department: "Computer Science",    cgpa: 3.1, interests: ["Databases", "SQL"] },
  { id: "8",  name: "Zainab Ali",      rollNo: "23L-0967", department: "Software Engineering", cgpa: 3.9, interests: ["AI", "Deep Learning"] },
  { id: "9",  name: "Omar Farooq",     rollNo: "23L-2645", department: "Data Science",        cgpa: 2.8, interests: ["Web Dev", "Node.js"] },
  { id: "10", name: "Hira Malik",      rollNo: "23L-0778", department: "Computer Science",    cgpa: 3.4, interests: ["UI/UX", "CSS"] },
  { id: "11", name: "Danish Iqbal",    rollNo: "23L-0834", department: "Software Engineering", cgpa: 3.3, interests: ["Cloud Computing", "AWS"] },
  { id: "12", name: "Noor Fatima",     rollNo: "23L-2921", department: "Data Science",        cgpa: 3.9, interests: ["AI", "Machine Learning"] },
  { id: "13", name: "Hamza Saeed",     rollNo: "23L-0556", department: "Computer Science",    cgpa: 3.0, interests: ["Cyber Security", "Ethical Hacking"] },
  { id: "14", name: "Sana Javed",      rollNo: "23L-0743", department: "Software Engineering", cgpa: 3.6, interests: ["React Native", "Mobile Apps"] },
  { id: "15", name: "Rehan Shah",      rollNo: "23L-2619", department: "Data Science",        cgpa: 2.7, interests: ["Data Visualization", "Python"] },
  { id: "16", name: "Laiba Khan",      rollNo: "23L-0882", department: "Computer Science",    cgpa: 3.5, interests: ["UI/UX", "Frontend"] },
  { id: "17", name: "Arslan Mehmood",  rollNo: "23L-0507", department: "Software Engineering", cgpa: 3.2, interests: ["Backend", "Node.js"] },
  { id: "18", name: "Esha Butt",       rollNo: "23L-2994", department: "Data Science",        cgpa: 3.8, interests: ["AI", "Data Science"] },
  { id: "19", name: "Muneeb Ali",      rollNo: "23L-0671", department: "Computer Science",    cgpa: 3.1, interests: ["DevOps", "Docker"] },
  { id: "20", name: "Iqra Anwar",      rollNo: "23L-0758", department: "Software Engineering", cgpa: 3.7, interests: ["Mobile Apps", "Kotlin"] },
];

const DEPARTMENTS: Department[] = ["Computer Science", "Software Engineering", "Data Science"];

const deptColor: Record<Department, { bg: string; text: string }> = {
  "Computer Science":    { bg: "#EFF6FF", text: "#0D3CCF" },
  "Software Engineering":{ bg: "#F0FDF4", text: "#16A34A" },
  "Data Science":        { bg: "#FFF7ED", text: "#F59E0B" },
};

/* ================= COMPONENT ================= */
const FindTeam: FC = () => {
  const [collapsed, setCollapsed]         = useState(false);
  const [search, setSearch]               = useState("");
  const [filterOpen, setFilterOpen]       = useState(false);
  const [selectedDepts, setSelectedDepts] = useState<Department[]>([]);
  const [minCgpa, setMinCgpa]             = useState<string>("");
  const filterRef = useRef<HTMLDivElement>(null);

  /* close dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleDept = (dept: Department) => {
    setSelectedDepts((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    );
  };

  const clearFilters = () => {
    setSelectedDepts([]);
    setMinCgpa("");
  };

  const activeFilterCount = selectedDepts.length + (minCgpa ? 1 : 0);

  /* ===== FILTER + SEARCH ===== */
  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.rollNo.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q) ||
      s.interests.some((i) => i.toLowerCase().includes(q));

    const matchesDept =
      selectedDepts.length === 0 || selectedDepts.includes(s.department);

    const matchesCgpa =
      !minCgpa || s.cgpa >= parseFloat(minCgpa);

    return matchesSearch && matchesDept && matchesCgpa;
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

          {/* ── Search + Filter bar ── */}
          <div className={styles.topBar}>
            {/* Filter button + dropdown */}
            <div className={styles.filterWrapper} ref={filterRef}>
              <button
                className={styles.filterBtn}
                onClick={() => setFilterOpen((p) => !p)}
              >
                <LuFilter size={14} />
                Filter
                {activeFilterCount > 0 && (
                  <span className={styles.filterBadge}>{activeFilterCount}</span>
                )}
                <LuChevronDown size={13} />
              </button>

              {filterOpen && (
                <div className={styles.filterDropdown}>
                  <div className={styles.filterSection}>
                    <p className={styles.filterLabel}>Department</p>
                    {DEPARTMENTS.map((dept) => (
                      <div
                        key={dept}
                        className={styles.filterOption}
                        onClick={() => toggleDept(dept)}
                      >
                        <div className={`${styles.checkbox} ${selectedDepts.includes(dept) ? styles.checkboxActive : ""}`}>
                          {selectedDepts.includes(dept) && <LuCheck size={10} />}
                        </div>
                        <span>{dept}</span>
                      </div>
                    ))}
                  </div>

                  <div className={styles.filterSection}>
                    <p className={styles.filterLabel}>Minimum CGPA</p>
                    <input
                      type="number"
                      min="0"
                      max="4"
                      step="0.1"
                      placeholder="e.g. 3.0"
                      value={minCgpa}
                      onChange={(e) => setMinCgpa(e.target.value)}
                      className={styles.cgpaInput}
                    />
                  </div>

                  {activeFilterCount > 0 && (
                    <button className={styles.clearBtn} onClick={clearFilters}>
                      <LuX size={12} /> Clear filters
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className={styles.barDivider} />

            {/* Search */}
            <div className={styles.searchInner}>
              <LuSearch size={15} color="#9CA3AF" />
              <input
                type="text"
                placeholder="Search by name, roll number, department, or interest"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* ── Grid ── */}
          {filtered.length === 0 ? (
            <div className={styles.emptyState}>
              <LuSearch size={28} color="#D1D5DB" />
              <p className={styles.emptyText}>No students found</p>
              <p className={styles.emptySub}>Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {filtered.map((s) => (
                <div key={s.id} className={styles.card}>
                  {/* Top: avatar + name + rollNo + dept tag */}
                  <div className={styles.cardTop}>
                    <div className={styles.avatar}>
                      {s.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className={styles.cardMeta}>
                      <p className={styles.name}>{s.name}</p>
                      <div className={styles.subRow}>
                        <span className={styles.rollNo}>{s.rollNo}</span>
                        <span
                          className={styles.deptTag}
                          style={{
                            background: deptColor[s.department].bg,
                            color: deptColor[s.department].text,
                          }}
                        >
                          {s.department}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* CGPA */}
                  <div className={styles.infoBlock}>
                    <p className={styles.infoLabel}>CGPA</p>
                    <p className={styles.infoValue}>{s.cgpa.toFixed(2)}</p>
                  </div>

                  {/* Interests */}
                  <div className={styles.infoBlock}>
                    <p className={styles.infoLabel}>Interests</p>
                    <div className={styles.tags}>
                      {s.interests.map((tag, i) => (
                        <span key={i} className={styles.tag}>{tag}</span>
                      ))}
                    </div>
                  </div>

                  {/* Button */}
                  <button className={styles.button}>
                    <LuSend size={14} />
                    Send Request
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindTeam;