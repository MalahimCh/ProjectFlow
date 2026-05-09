import InitSidebar from "../Sidebar/InitSidebar";
import { type FC, useState, useRef, useEffect } from "react";
import styles from "./FindSupervisor.module.css";
import Header from "../../../components/Header/Header";
import {
  LuSearch,
  LuSend,
  LuMail,
  LuGraduationCap,
  LuUsers,
  LuFilter,
  LuChevronDown,
  LuCheck,
  LuX,
} from "react-icons/lu";

/* ================= TYPES ================= */
type Rank = "Lecturer" | "Assistant Professor" | "Associate Professor" | "Professor";
type Department = "Computer Science" | "Software Engineering" | "Data Science";

type Supervisor = {
  id: string;
  name: string;
  rank: Rank;
  department: Department;
  mail: string;
  specialization: string[];
  currentLoad: number;
  maxLoad: 4;
};

/* ================= HELPERS ================= */
const getInitials = (name: string) =>
  name
    .replace(/^(Dr\.|Mr\.|Ms\.|Prof\.)\s*/i, "")
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const getWorkloadColor = (load: number): string => {
  if (load <= 1) return "#16A34A";
  if (load <= 3) return "#F59E0B";
  return "#DC2626";
};

const deptColor: Record<Department, { bg: string; text: string }> = {
  "Computer Science":     { bg: "#EFF6FF", text: "#0D3CCF" },
  "Software Engineering": { bg: "#F0FDF4", text: "#16A34A" },
  "Data Science":         { bg: "#FFF7ED", text: "#F59E0B" },
};

const DEPARTMENTS: Department[] = ["Computer Science", "Software Engineering", "Data Science"];
const RANKS: Rank[] = ["Lecturer", "Associate Professor", "Professor"];

/* ================= MOCK DATA ================= */
const supervisors: Supervisor[] = [
  { id: "1",  name: "Dr. Ayesha Malik",   rank: "Associate Professor", department: "Computer Science",     mail: "a.malik@lhr.nu.edu.pk",   specialization: ["Machine Learning", "Deep Learning", "AI"],            currentLoad: 4, maxLoad: 4 },
  { id: "2",  name: "Dr. Usman Tariq",    rank: "Assistant Professor", department: "Software Engineering", mail: "u.tariq@lhr.nu.edu.pk",   specialization: ["Web Engineering", "React", "System Design"],          currentLoad: 2, maxLoad: 4 },
  { id: "3",  name: "Dr. Hira Shah",      rank: "Professor",           department: "Computer Science",     mail: "h.shah@lhr.nu.edu.pk",    specialization: ["Data Mining", "Python", "Analytics"],                 currentLoad: 4, maxLoad: 4 },
  { id: "4",  name: "Dr. Ali Raza",       rank: "Lecturer",            department: "Computer Science",     mail: "a.raza@lhr.nu.edu.pk",    specialization: ["Ethical Hacking", "Network Security", "Cryptography"], currentLoad: 1, maxLoad: 4 },
  { id: "5",  name: "Dr. Sara Khan",      rank: "Assistant Professor", department: "Software Engineering", mail: "s.khan@lhr.nu.edu.pk",    specialization: ["UI/UX", "Usability", "Figma"],                        currentLoad: 2, maxLoad: 4 },
  { id: "6",  name: "Dr. Hassan Raza",    rank: "Associate Professor", department: "Computer Science",     mail: "h.raza@lhr.nu.edu.pk",    specialization: ["AWS", "Azure", "Distributed Systems"],                currentLoad: 3, maxLoad: 4 },
  { id: "7",  name: "Dr. Areeba Noor",    rank: "Professor",           department: "Computer Science",     mail: "a.noor@lhr.nu.edu.pk",    specialization: ["AI", "Neural Networks", "Deep Learning"],             currentLoad: 4, maxLoad: 4 },
  { id: "8",  name: "Dr. Bilal Ahmed",    rank: "Lecturer",            department: "Computer Science",     mail: "b.ahmed@lhr.nu.edu.pk",   specialization: ["SQL", "NoSQL", "Data Warehousing"],                   currentLoad: 2, maxLoad: 4 },
  { id: "9",  name: "Dr. Fatima Zahra",   rank: "Assistant Professor", department: "Software Engineering", mail: "f.zahra@lhr.nu.edu.pk",   specialization: ["Android", "Flutter", "iOS Development"],              currentLoad: 3, maxLoad: 4 },
  { id: "10", name: "Dr. Omar Farooq",    rank: "Associate Professor", department: "Computer Science",     mail: "o.farooq@lhr.nu.edu.pk",  specialization: ["Docker", "Kubernetes", "CI/CD"],                      currentLoad: 1, maxLoad: 4 },
  { id: "11", name: "Dr. Zainab Ali",     rank: "Professor",           department: "Computer Science",     mail: "z.ali@lhr.nu.edu.pk",     specialization: ["AI", "Robotics", "Computer Vision"],                  currentLoad: 3, maxLoad: 4 },
  { id: "12", name: "Dr. Hamza Saeed",    rank: "Lecturer",            department: "Computer Science",     mail: "h.saeed@lhr.nu.edu.pk",   specialization: ["Cyber Security", "Penetration Testing", "Forensics"], currentLoad: 2, maxLoad: 4 },
  { id: "13", name: "Dr. Laiba Khan",     rank: "Assistant Professor", department: "Software Engineering", mail: "l.khan@lhr.nu.edu.pk",    specialization: ["React", "Next.js", "CSS Architecture"],               currentLoad: 1, maxLoad: 4 },
  { id: "14", name: "Dr. Arslan Mehmood", rank: "Associate Professor", department: "Software Engineering", mail: "a.mehmood@lhr.nu.edu.pk", specialization: ["Node.js", "APIs", "Microservices"],                   currentLoad: 3, maxLoad: 4 },
  { id: "15", name: "Dr. Esha Butt",      rank: "Professor",           department: "Data Science",         mail: "e.butt@lhr.nu.edu.pk",    specialization: ["Hadoop", "Spark", "Data Engineering"],                currentLoad: 4, maxLoad: 4 },
];

/* ================= COMPONENT ================= */
const FindSupervisor: FC = () => {
  const [collapsed, setCollapsed]         = useState(false);
  const [search, setSearch]               = useState("");
  const [filterOpen, setFilterOpen]       = useState(false);
  const [selectedDepts, setSelectedDepts] = useState<Department[]>([]);
  const [selectedRanks, setSelectedRanks] = useState<Rank[]>([]);
  const [availableOnly, setAvailableOnly] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  /* close dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node))
        setFilterOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleDept = (d: Department) =>
    setSelectedDepts((p) => p.includes(d) ? p.filter((x) => x !== d) : [...p, d]);

  const toggleRank = (r: Rank) =>
    setSelectedRanks((p) => p.includes(r) ? p.filter((x) => x !== r) : [...p, r]);

  const clearFilters = () => {
    setSelectedDepts([]);
    setSelectedRanks([]);
    setAvailableOnly(false);
  };

  const activeFilterCount =
    selectedDepts.length + selectedRanks.length + (availableOnly ? 1 : 0);

  /* filter + search */
  const filtered = supervisors.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.rank.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q) ||
      s.mail.toLowerCase().includes(q) ||
      s.specialization.some((sp) => sp.toLowerCase().includes(q));

    const matchDept   = selectedDepts.length === 0 || selectedDepts.includes(s.department);
    const matchRank   = selectedRanks.length === 0 || selectedRanks.includes(s.rank);
    const matchAvail  = !availableOnly || s.currentLoad < s.maxLoad;

    return matchSearch && matchDept && matchRank && matchAvail;
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

          {/* ── Top bar ── */}
          <div className={styles.topBar}>

            {/* Filter */}
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

                  {/* Department */}
                  <div className={styles.filterSection}>
                    <p className={styles.filterLabel}>Department</p>
                    {DEPARTMENTS.map((dept) => (
                      <div key={dept} className={styles.filterOption} onClick={() => toggleDept(dept)}>
                        <div className={`${styles.checkbox} ${selectedDepts.includes(dept) ? styles.checkboxActive : ""}`}>
                          {selectedDepts.includes(dept) && <LuCheck size={10} />}
                        </div>
                        <span>{dept}</span>
                      </div>
                    ))}
                  </div>

                  {/* Rank */}
                  <div className={styles.filterSection}>
                    <p className={styles.filterLabel}>Rank</p>
                    {RANKS.map((rank) => (
                      <div key={rank} className={styles.filterOption} onClick={() => toggleRank(rank)}>
                        <div className={`${styles.checkbox} ${selectedRanks.includes(rank) ? styles.checkboxActive : ""}`}>
                          {selectedRanks.includes(rank) && <LuCheck size={10} />}
                        </div>
                        <span>{rank}</span>
                      </div>
                    ))}
                  </div>

                  {/* Availability */}
                  <div className={styles.filterSection}>
                    <p className={styles.filterLabel}>Availability</p>
                    <div className={styles.filterOption} onClick={() => setAvailableOnly((p) => !p)}>
                      <div className={`${styles.checkbox} ${availableOnly ? styles.checkboxActive : ""}`}>
                        {availableOnly && <LuCheck size={10} />}
                      </div>
                      <span>Available slots only</span>
                    </div>
                  </div>

                  {/* Clear */}
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
                placeholder="Search by name, rank, department, or specialization"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* ── Grid ── */}
          {filtered.length === 0 ? (
            <div className={styles.emptyState}>
              <LuSearch size={28} color="#D1D5DB" />
              <p className={styles.emptyText}>No supervisors found</p>
              <p className={styles.emptySub}>Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {filtered.map((s) => {
                const barColor  = getWorkloadColor(s.currentLoad);

                return (
                  <div key={s.id} className={styles.card}>

                    {/* Top */}
                    <div className={styles.cardTop}>
                      <div className={styles.avatar}>{getInitials(s.name)}</div>
                      <div className={styles.cardMeta}>
                        <p className={styles.name}>{s.name}</p>
                        <div className={styles.subRow}>
                          <span className={styles.rank}>{s.rank}</span>
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

                    {/* Email */}
                    <div className={styles.infoRow}>
                      <LuMail size={13} className={styles.infoIcon} />
                      <span className={styles.infoText}>{s.mail}</span>
                    </div>

                    {/* Specialization */}
                    <div className={styles.infoRow} style={{ alignItems: "flex-start" }}>
                      <LuGraduationCap size={13} className={styles.infoIcon} style={{ marginTop: 2 }} />
                      <div>
                        <p className={styles.infoLabel}>Specialization</p>
                        <div className={styles.tags}>
                          {s.specialization.map((sp, i) => (
                            <span key={i} className={styles.tag}>{sp}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Workload */}
                    <div className={styles.workloadRow}>
                      <LuUsers size={13} className={styles.infoIcon} />
                      <span className={styles.workloadLabel}>Current Workload</span>
                      <span className={styles.workloadCount} style={{ color: barColor }}>
                        {s.currentLoad}/{s.maxLoad}
                      </span>
                    </div>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{
                          width: `${(s.currentLoad / s.maxLoad) * 100}%`,
                          backgroundColor: barColor,
                        }}
                      />
                    </div>

                    {/* Button */}
                    <button className={styles.button}>
                      <LuSend size={14} />
                      Request Supervisor
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindSupervisor;