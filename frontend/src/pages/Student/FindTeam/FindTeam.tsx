import InitSidebar from "../Sidebar/InitSidebar";
import { type FC, useState, useRef, useEffect } from "react";
import styles from "./FindTeam.module.css";
import Header from "../../../components/Header/Header";
import { LuSearch, LuSend, LuFilter, LuChevronDown, LuX } from "react-icons/lu";
import {
  getStudentProfiles,
  sendGroupRequest,
} from "../../../services/studentService";

/* ================= TYPES ================= */
type Student = {
  id: string;
  name: string;
  rollNo: string;
  cgpa: number;
  interests: string[];
  batchYear: number | null;
};

const isMobile = () =>
  typeof window !== "undefined" && window.innerWidth <= 767;

/* ================= COMPONENT ================= */
const FindTeam: FC = () => {
  const [collapsed, setCollapsed] = useState(() => isMobile());
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [minCgpa, setMinCgpa] = useState<string>("");
  const [sending, setSending] = useState<Record<string, boolean>>({});
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 767) setCollapsed(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSendRequest = async (studentId: string) => {
    setSending((p) => ({ ...p, [studentId]: true }));
    try {
      await sendGroupRequest(studentId);
      setSending((p) => ({ ...p, [studentId]: "sent" as any }));
    } catch (err: any) {
      alert(err?.response?.data?.message ?? "Failed to send request.");
      setSending((p) => ({ ...p, [studentId]: false }));
    }
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const data = await getStudentProfiles();
        setStudents(data);
      } catch (err) {
        console.error("Failed to load students:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const activeFilterCount = minCgpa ? 1 : 0;
  const clearFilters = () => setMinCgpa("");

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      s.name?.toLowerCase().includes(q) ||
      s.rollNo?.toLowerCase().includes(q) ||
      (s.interests || []).some((i) => i.toLowerCase().includes(q));
    const matchesCgpa = !minCgpa || s.cgpa >= parseFloat(minCgpa);
    return matchesSearch && matchesCgpa;
  });

  if (loading) {
    return (
      <div className={styles.container}>
        <InitSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className={styles.main}>
          <Header title="Find Team" subtitle="Invite students to join your FYP group" />
          <div className={styles.content}>
            <div className={styles.emptyState}><p>Loading students...</p></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <InitSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={styles.main}>
        <Header
          title="Find Team"
          subtitle="Invite students to join your FYP group"
        />

        <div className={styles.content}>
          {/* TOP BAR */}
          <div className={styles.topBar}>
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

            <div className={styles.barDivider} />

            <div className={styles.searchInner}>
              <LuSearch size={15} color="#9CA3AF" />
              <input
                type="text"
                placeholder="Search by name, roll number, interest"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* GRID */}
          {filtered.length === 0 ? (
            <div className={styles.emptyState}>
              <LuSearch size={28} color="#D1D5DB" />
              <p className={styles.emptyText}>No students found</p>
              <p className={styles.emptySub}>Try adjusting search or filters.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {filtered.map((s) => (
                <div key={s.id} className={styles.card}>
                  <div className={styles.cardTop}>
                    <div className={styles.avatar}>
                      {s.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className={styles.cardMeta}>
                      <p className={styles.name}>{s.name}</p>
                      <div className={styles.subRow}>
                        <span className={styles.rollNo}>{s.rollNo}</span>
                        <div className={styles.tagGroup}>
                          {s.batchYear && (
                            <span className={styles.batchTag}>Batch {s.batchYear}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.infoBlock}>
                    <p className={styles.infoLabel}>CGPA</p>
                    <p className={styles.infoValue}>{s.cgpa.toFixed(2)}</p>
                  </div>

                  <div className={styles.infoBlock}>
                    <p className={styles.infoLabel}>Interests</p>
                    <div className={styles.tags}>
                      {s.interests?.map((tag, i) => (
                        <span key={i} className={styles.tag}>{tag}</span>
                      ))}
                    </div>
                  </div>

                  <button
                    className={styles.button}
                    onClick={() => handleSendRequest(s.id)}
                    disabled={!!sending[s.id]}
                  >
                    <LuSend size={14} />
                    {sending[s.id] === true
                      ? "Sending…"
                      : sending[s.id]
                        ? "Sent"
                        : "Send Request"}
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