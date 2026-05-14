import CoordSidebar from "../Sidebar/CoordSidebar";
import { type FC, useState, useRef, useEffect } from "react";
import styles from "./CoordDeadlines.module.css";
import Header from "../../../components/Header/Header";
import StatsCard from "../../../components/StatsCard/StatsCard";
import { LuCalendarDays, LuClock, LuCircleCheck, LuPlus, LuPencil, LuTrash2, LuCalendar, LuX, LuSearch, LuFilter, LuChevronDown, LuCheck, LuTriangleAlert } from "react-icons/lu";

type DeadlineStatus = "Upcoming" | "Completed" | "Pending";
type DeadlineType = "Proposal" | "Report" | "Presentation" | "Submission";

interface Deadline {
  id: number;
  type: DeadlineType;
  title: string;
  description: string;
  date: string;
  time: string;
  daysRemaining: number;
  status: DeadlineStatus;
}

const TYPES: DeadlineType[] = ["Proposal", "Report", "Presentation", "Submission"];

const STATUS_LIST: DeadlineStatus[] = ["Upcoming", "Pending", "Completed"];

const CoordDeadlines: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedDeadline, setSelectedDeadline] = useState<Deadline | null>(null);
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<DeadlineType[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<DeadlineStatus[]>([]);
  const filterRef = useRef<HTMLDivElement>(null);

  const [deadlines, setDeadlines] = useState<Deadline[]>([
    {
      id: 1,
      type: "Proposal",
      title: "FYP Proposal Submission",
      description: "All groups must submit their project proposals including objectives, methodology, and timeline.",
      date: "April 15, 2026",
      time: "11:59 PM",
      daysRemaining: 23,
      status: "Upcoming",
    },
    {
      id: 2,
      type: "Report",
      title: "Mid-Term Progress Report",
      description: "Submit mid-term progress report with completed milestones and current status.",
      date: "April 30, 2026",
      time: "11:59 PM",
      daysRemaining: 28,
      status: "Upcoming",
    },
    {
      id: 3,
      type: "Presentation",
      title: "Progress Presentation",
      description: "Groups will present their current progress to the evaluation committee.",
      date: "May 15, 2026",
      time: "11:59 AM",
      daysRemaining: 53,
      status: "Upcoming",
    },
    {
      id: 4,
      type: "Submission",
      title: "Final Project Submission",
      description: "Final submission of complete project including documentation, code, and presentation materials.",
      date: "May 30, 2026",
      time: "11:59 PM",
      daysRemaining: 68,
      status: "Upcoming",
    },
  ]);

  /* close filter dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleType = (t: DeadlineType) =>
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );

  const toggleStatus = (s: DeadlineStatus) =>
    setSelectedStatuses((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedStatuses([]);
  };

  const activeFilterCount = selectedTypes.length + selectedStatuses.length;

  /* search + filter */
  const filtered = deadlines.filter((d) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      d.title.toLowerCase().includes(q) ||
      d.type.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q) ||
      d.date.toLowerCase().includes(q);

    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(d.type);
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(d.status);

    return matchesSearch && matchesType && matchesStatus;
  });

  const upcoming = deadlines.filter((d) => d.status === "Upcoming").length;
  const pending = deadlines.filter((d) => d.status === "Pending").length;
  const completed = deadlines.filter((d) => d.status === "Completed").length;

  const openAddModal = () => { setSelectedDeadline(null); setShowModal(true); };
  const openEditModal = (d: Deadline) => { setSelectedDeadline(d); setShowModal(true); };
  const openDeleteModal = (d: Deadline) => { setSelectedDeadline(d); setDeleteModal(true); };
  const handleDelete = () => {
    if (selectedDeadline) setDeadlines((prev) => prev.filter((d) => d.id !== selectedDeadline.id));
    setDeleteModal(false);
  };

  const countdownColor = (days: number) => {
    if (days <= 7) return "#DC2626";
    if (days <= 30) return "#D97706";
    return "#16A34A";
  };

  const statusBadgeStyle = (status: DeadlineStatus) => {
    if (status === "Completed") return { color: "#16A34A", background: "#F0FDF4" };
    if (status === "Pending") return { color: "#D97706", background: "#FFF7ED" };
    return { color: "#0D3CCF", background: "#EFF6FF" };
  };

  return (
    <div className={styles.container}>
      <CoordSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={styles.main}>
        <Header
          title="Deadlines"
          subtitle="Set and manage project submission deadlines"
        />

        <div className={styles.content}>
          {/* Stats */}
          <div className={styles.statsGrid}>
            <StatsCard value={upcoming} label="Upcoming Deadlines" icon={<LuCalendarDays />} bgColor="#EFF6FF" iconColor="#0D3CCF" />
            <StatsCard value={pending}  label="Pending Deadlines"  icon={<LuTriangleAlert />} bgColor="#FFF7ED" iconColor="#D97706" />
            <StatsCard value={completed} label="Passed Deadlines"  icon={<LuCircleCheck />}  bgColor="#F0FDF4" iconColor="#16A34A" />
          </div>

          {/* Search + Filter + Add bar */}
          <div className={styles.toolbar}>
            {/* Filter */}
            <div className={styles.filterWrapper} ref={filterRef}>
              <button className={styles.filterBtn} onClick={() => setFilterOpen((p) => !p)}>
                <LuFilter size={13} />
                <span>Filter</span>
                {activeFilterCount > 0 && (
                  <span className={styles.filterBadge}>{activeFilterCount}</span>
                )}
                <LuChevronDown size={12} />
              </button>

              {filterOpen && (
                <div className={styles.filterDropdown}>
                  <div className={styles.filterSection}>
                    <p className={styles.filterLabel}>Type</p>
                    {TYPES.map((t) => (
                      <div key={t} className={styles.filterOption} onClick={() => toggleType(t)}>
                        <div className={`${styles.checkbox} ${selectedTypes.includes(t) ? styles.checkboxActive : ""}`}>
                          {selectedTypes.includes(t) && <LuCheck size={11} color="#FFFFFF" strokeWidth={3} />}
                        </div>
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.filterSection}>
                    <p className={styles.filterLabel}>Status</p>
                    {STATUS_LIST.map((s) => (
                      <div key={s} className={styles.filterOption} onClick={() => toggleStatus(s)}>
                        <div className={`${styles.checkbox} ${selectedStatuses.includes(s) ? styles.checkboxActive : ""}`}>
                          {selectedStatuses.includes(s) && <LuCheck size={11} color="#FFFFFF" strokeWidth={3} />}
                        </div>
                        <span>{s}</span>
                      </div>
                    ))}
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
              <LuSearch size={14} color="#9CA3AF" />
              <input
                type="text"
                placeholder="Search by project name, or label"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

          </div>

          {/* Add button row */}
          <div className={styles.addRow}>
            <button className={styles.addButton} onClick={openAddModal}>
              <LuPlus size={15} />
              Add Deadline
            </button>
          </div>

          {/* Deadline Cards */}
          <div className={styles.deadlinesList}>
            {filtered.length === 0 ? (
              <div className={styles.emptyState}>
                <LuSearch size={28} color="#D1D5DB" />
                <p className={styles.emptyText}>No deadlines found</p>
                <p className={styles.emptySub}>Try adjusting your search or filters.</p>
              </div>
            ) : (
              filtered.map((deadline) => (
                <div key={deadline.id} className={styles.deadlineCard}>
                  {/* Icon */}
                  <div className={styles.iconWrapper}>
                    <LuCalendar size={20} />
                  </div>

                  {/* Body */}
                  <div className={styles.deadlineBody}>
                    <div className={styles.titleRow}>
                      <p className={styles.deadlineTitle}>{deadline.title}</p>
                      <span
                        className={styles.statusBadge}
                        style={statusBadgeStyle(deadline.status)}
                      >
                        {deadline.status}
                      </span>
                    </div>

                    <p className={styles.deadlineDesc}>{deadline.description}</p>

                    <div className={styles.metaRow}>
                      <span className={styles.metaItem}>
                        <LuCalendar size={12} />
                        {deadline.date}
                      </span>
                      <span className={styles.metaItem}>
                        <LuClock size={12} />
                        {deadline.time}
                      </span>
                      <span
                        className={styles.countdown}
                        style={{ color: countdownColor(deadline.daysRemaining) }}
                      >
                        {deadline.daysRemaining} days remaining
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className={styles.actions}>
                    <button className={styles.editBtn} onClick={() => openEditModal(deadline)}>
                      <LuPencil size={13} />
                      Edit
                    </button>
                    <button className={styles.deleteBtn} onClick={() => openDeleteModal(deadline)}>
                      <LuTrash2 size={13} />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <p className={styles.modalTitle}>{selectedDeadline ? "Edit Deadline" : "Add New Deadline"}</p>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}>
                <LuX size={18} />
              </button>
            </div>

            <div className={styles.form}>
              <div className={styles.formGroup}>
                <label>Deadline Type *</label>
                <input type="text" defaultValue={selectedDeadline?.type || ""} placeholder="e.g. Proposal" />
              </div>
              <div className={styles.formGroup}>
                <label>Title *</label>
                <input type="text" defaultValue={selectedDeadline?.title || ""} placeholder="e.g. FYP Proposal Submission" />
              </div>
              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label>Date *</label>
                  <input type="date" />
                </div>
                <div className={styles.formGroup}>
                  <label>Time *</label>
                  <input type="time" />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea rows={4} defaultValue={selectedDeadline?.description || ""} placeholder="Enter deadline description and requirements..." />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
              <button className={styles.submitBtn}>{selectedDeadline ? "Save Changes" : "Add Deadline"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div className={styles.overlay}>
          <div className={styles.deleteModal}>
            <p className={styles.deleteTitle}>Delete Deadline</p>
            <p className={styles.deleteDesc}>
              Are you sure you want to delete <strong>{selectedDeadline?.title}</strong>? This action cannot be undone.
            </p>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setDeleteModal(false)}>Cancel</button>
              <button className={styles.deleteConfirmBtn} onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoordDeadlines;