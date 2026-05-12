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
  LuBrain,
} from "react-icons/lu";

import { getSupervisors } from "../../../services/studentService";

/* ================= TYPES ================= */
type Supervisor = {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  specialization: string[];
  interests: string[];
  workload: number;
  maxLoad: number;
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

const getWorkloadColor = (load: number, max: number): string => {
  const ratio = load / max;
  if (ratio <= 0.4) return "#16A34A";
  if (ratio <= 0.75) return "#F59E0B";
  return "#DC2626";
};

/* ================= COMPONENT ================= */
const FindSupervisor: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getSupervisors();
        setSupervisors(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load supervisors");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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

  const clearFilters = () => setAvailableOnly(false);
  const activeFilterCount = availableOnly ? 1 : 0;

  const filtered = supervisors.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.designation.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.specialization.some((sp) => sp.toLowerCase().includes(q));
    const matchAvail = !availableOnly || s.workload < s.maxLoad;
    return matchSearch && matchAvail;
  });

  if (loading)
    return (
      <div className={styles.emptyState}>
        <p>Loading supervisors...</p>
      </div>
    );

  if (error)
    return (
      <div className={styles.emptyState}>
        <p>{error}</p>
      </div>
    );

  return (
    <div className={styles.container}>
      <InitSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={styles.main}>
        <Header
          title="Find Supervisor"
          subtitle="Select a supervisor for your FYP guidance"
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
                  <span className={styles.filterBadge}>
                    {activeFilterCount}
                  </span>
                )}
                <LuChevronDown size={13} />
              </button>

              {filterOpen && (
                <div className={styles.filterDropdown}>
                  <div className={styles.filterSection}>
                    <p className={styles.filterLabel}>Availability</p>
                    <div
                      className={styles.filterOption}
                      onClick={() => setAvailableOnly((p) => !p)}
                    >
                      <div
                        className={`${styles.checkbox} ${availableOnly ? styles.checkboxActive : ""}`}
                      >
                        {availableOnly && <LuCheck size={10} />}
                      </div>
                      <span>Available slots only</span>
                    </div>
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
                placeholder="Search by name, email, specialization"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* GRID */}
          {filtered.length === 0 ? (
            <div className={styles.emptyState}>
              <LuSearch size={28} color="#D1D5DB" />
              <p className={styles.emptyText}>No supervisors found</p>
              <p className={styles.emptySub}>
                Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            <div className={styles.grid}>
              {filtered.map((s) => {
                const barColor = getWorkloadColor(s.workload, s.maxLoad);

                return (
                  <div key={s.id} className={styles.card}>
                    {/* TOP: avatar + name + designation + dept tag */}
                    <div className={styles.cardTop}>
                      <div className={styles.avatar}>{getInitials(s.name)}</div>
                      <div className={styles.cardMeta}>
                        <p className={styles.name}>{s.name}</p>
                        <div className={styles.subRow}>
                          <span className={styles.designation}>
                            {s.designation}
                          </span>
                          {s.department && (
                            <span className={styles.deptTag}>
                              {s.department}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* EMAIL */}
                    <div className={styles.infoRow}>
                      <LuMail size={13} className={styles.infoIcon} />
                      <span className={styles.infoText}>{s.email}</span>
                    </div>

                    {/* SPECIALIZATION */}
                    {s.specialization.length > 0 && (
                      <div
                        className={styles.infoRow}
                        style={{ alignItems: "flex-start" }}
                      >
                        <LuGraduationCap
                          size={13}
                          className={styles.infoIcon}
                          style={{ marginTop: 2 }}
                        />
                        <div>
                          <p className={styles.infoLabel}>Specialization</p>
                          <div className={styles.tags}>
                            {s.specialization.map((sp, i) => (
                              <span key={i} className={styles.tag}>
                                {sp}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* INTERESTS */}
                    {s.interests.length > 0 && (
                      <div
                        className={styles.infoRow}
                        style={{ alignItems: "flex-start" }}
                      >
                        <LuBrain
                          size={13}
                          className={styles.infoIcon}
                          style={{ marginTop: 2 }}
                        />
                        <div>
                          <p className={styles.infoLabel}>Interests</p>
                          <div className={styles.tags}>
                            {s.interests.map((interest, i) => (
                              <span
                                key={i}
                                className={`${styles.tag} ${styles.tagInterest}`}
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* WORKLOAD */}
                    <div className={styles.workloadRow}>
                      <LuUsers size={13} className={styles.infoIcon} />
                      <span className={styles.workloadLabel}>
                        Current Workload
                      </span>
                      <span
                        className={styles.workloadCount}
                        style={{ color: barColor }}
                      >
                        {s.workload}/{s.maxLoad}
                      </span>
                    </div>

                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{
                          width: `${(s.workload / s.maxLoad) * 100}%`,
                          backgroundColor: barColor,
                        }}
                      />
                    </div>

                    {/* BUTTON */}
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
