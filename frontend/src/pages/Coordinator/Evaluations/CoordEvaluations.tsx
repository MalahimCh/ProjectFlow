import CoordSidebar from "../Sidebar/CoordSidebar";
import { type FC, useState } from "react";
import styles from "./CoordEvaluations.module.css";
import Header from "../../../components/Header/Header";
import StatsCard from "../../../components/StatsCard/StatsCard";
import {
  LuUsers,
  LuCalendarDays,
  LuCircleCheck,
  LuClock3,
  LuPlus,
  LuPencil,
  LuTrash2,
  LuX,
  LuBookOpen,
  LuDoorOpen,
  LuFolder,
  LuTriangleAlert,
} from "react-icons/lu";

/* ─── Types ────────────────────────────────────────────────────── */

type Phase = "Mid-Term" | "Final" | "Pre-Defense";
type PanelStatus = "Upcoming" | "In Progress" | "Completed";

interface ScheduleSlot {
  groupId: string;
  date: string;
  time: string;
  room: string;
}

interface EvalPanel {
  id: number;
  name: string;
  phase: Phase;
  status: PanelStatus;
  supervisors: string[];
  projects: string[];
  slots: ScheduleSlot[];
  rubric: string;
}

interface SlotBuilderItem {
  groupId: string;
  date: string;
  time: string;
  room: string;
}

/* ─── Mock data ─────────────────────────────────────────────────── */

const ALL_SUPERVISORS = [
  "Dr. Aisha Malik",
  "Dr. Tariq Hussain",
  "Dr. Sana Rauf",
  "Prof. Bilal Ahmed",
  "Dr. Nadia Zafar",
  "Dr. Imran Sheikh",
];

const ALL_PROJECTS = [
  { id: "FYP-001", title: "AI-Based Traffic System", group: "G-01" },
  { id: "FYP-002", title: "Smart Agriculture Monitor", group: "G-02" },
  { id: "FYP-003", title: "E-Health Records Platform", group: "G-03" },
  { id: "FYP-004", title: "Real-Time Sign Language Translator", group: "G-04" },
  { id: "FYP-005", title: "Campus Navigation AR App", group: "G-05" },
  { id: "FYP-006", title: "Fraud Detection ML Pipeline", group: "G-06" },
  { id: "FYP-007", title: "Automated Code Reviewer", group: "G-07" },
  { id: "FYP-008", title: "Energy Consumption Dashboard", group: "G-08" },
];

const ALL_ROOMS = [
  "CR-101",
  "CR-102",
  "Lab-A",
  "Lab-B",
  "Seminar Hall",
  "R-201",
];

const ALL_RUBRICS = [
  "Standard FYP Rubric v2",
  "Research Focus Rubric",
  "Engineering Rubric v3",
  "CS Department Rubric",
];

const INITIAL_PANELS: EvalPanel[] = [
  {
    id: 1,
    name: "Panel A",
    phase: "Mid-Term",
    status: "Upcoming",
    supervisors: ["Dr. Aisha Malik", "Dr. Tariq Hussain", "Prof. Bilal Ahmed"],
    projects: ["FYP-001", "FYP-002", "FYP-003"],
    slots: [
      {
        groupId: "G-01",
        date: "May 20, 2026",
        time: "09:00 AM",
        room: "CR-101",
      },
      {
        groupId: "G-02",
        date: "May 20, 2026",
        time: "10:00 AM",
        room: "CR-101",
      },
      {
        groupId: "G-03",
        date: "May 20, 2026",
        time: "11:00 AM",
        room: "CR-101",
      },
    ],
    rubric: "Standard FYP Rubric v2",
  },
  {
    id: 2,
    name: "Panel B",
    phase: "Mid-Term",
    status: "Upcoming",
    supervisors: ["Dr. Sana Rauf", "Dr. Nadia Zafar"],
    projects: ["FYP-004", "FYP-005"],
    slots: [
      {
        groupId: "G-04",
        date: "May 21, 2026",
        time: "09:00 AM",
        room: "Lab-A",
      },
      {
        groupId: "G-05",
        date: "May 21, 2026",
        time: "10:30 AM",
        room: "Lab-A",
      },
    ],
    rubric: "Engineering Rubric v3",
  },
];

/* ─── Helpers ───────────────────────────────────────────────────── */

function getInitials(name: string) {
  return name
    .split(" ")
    .filter((w) => w.length > 1)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function phaseBadgeClass(phase: Phase, styles: Record<string, string>) {
  if (phase === "Mid-Term") return styles.phaseBadgeMid;
  if (phase === "Final") return styles.phaseBadgeFinal;
  return styles.phaseBadgePre;
}

function statusBadgeClass(status: PanelStatus, styles: Record<string, string>) {
  if (status === "Completed") return styles.statusCompleted;
  if (status === "In Progress") return styles.statusInProgress;
  return styles.statusUpcoming;
}

function projectById(id: string) {
  return ALL_PROJECTS.find((p) => p.id === id);
}

/* ─── Component ─────────────────────────────────────────────────── */

const CoordEvaluations: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activePhase, setActivePhase] = useState<Phase | "All">("All");
  const [panels, setPanels] = useState<EvalPanel[]>(INITIAL_PANELS);

  /* Modal state */
  const [showPanelModal, setShowPanelModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedPanel, setSelectedPanel] = useState<EvalPanel | null>(null);

  /* Form state */
  const [formName, setFormName] = useState("");
  const [formPhase, setFormPhase] = useState<Phase>("Mid-Term");
  const [formStatus, setFormStatus] = useState<PanelStatus>("Upcoming");
  const [formSupervisors, setFormSupervisors] = useState<string[]>([""]);
  const [formProjects, setFormProjects] = useState<string[]>([]);
  const [formRubric, setFormRubric] = useState(ALL_RUBRICS[0]);
  const [formSlots, setFormSlots] = useState<SlotBuilderItem[]>([
    { groupId: "", date: "", time: "", room: "" },
  ]);

  /* Derived */
  const scheduledProjectIds = panels.flatMap((p) => p.projects);
  const remainingProjects = ALL_PROJECTS.filter(
    (p) => !scheduledProjectIds.includes(p.id),
  );

  const filteredPanels =
    activePhase === "All"
      ? panels
      : panels.filter((p) => p.phase === activePhase);

  const completedCount = panels.filter((p) => p.status === "Completed").length;
  const upcomingCount = panels.filter((p) => p.status === "Upcoming").length;

  /* Open / close helpers */
  const openAddModal = () => {
    setSelectedPanel(null);
    setFormName("");
    setFormPhase("Mid-Term");
    setFormStatus("Upcoming");
    setFormSupervisors([""]);
    setFormProjects([]);
    setFormRubric(ALL_RUBRICS[0]);
    setFormSlots([{ groupId: "", date: "", time: "", room: "" }]);
    setShowPanelModal(true);
  };

  const openEditModal = (panel: EvalPanel) => {
    setSelectedPanel(panel);
    setFormName(panel.name);
    setFormPhase(panel.phase);
    setFormStatus(panel.status);
    setFormSupervisors([...panel.supervisors]);
    setFormProjects([...panel.projects]);
    setFormRubric(panel.rubric);
    setFormSlots(
      panel.slots.map((s) => ({
        groupId: s.groupId,
        date: s.date,
        time: s.time,
        room: s.room,
      })),
    );
    setShowPanelModal(true);
  };

  const openDeleteModal = (panel: EvalPanel) => {
    setSelectedPanel(panel);
    setDeleteModal(true);
  };

  /* Supervisor builder */
  const updateSupervisor = (idx: number, val: string) => {
    const next = [...formSupervisors];
    next[idx] = val;
    setFormSupervisors(next);
  };
  const addSupervisor = () => setFormSupervisors([...formSupervisors, ""]);
  const removeSupervisor = (idx: number) =>
    setFormSupervisors(formSupervisors.filter((_, i) => i !== idx));

  /* Project toggle */
  const toggleProject = (id: string) =>
    setFormProjects((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );

  /* Slot builder */
  const updateSlot = (
    idx: number,
    field: keyof SlotBuilderItem,
    val: string,
  ) => {
    const next = [...formSlots];
    next[idx] = { ...next[idx], [field]: val };
    setFormSlots(next);
  };
  const addSlot = () =>
    setFormSlots([...formSlots, { groupId: "", date: "", time: "", room: "" }]);
  const removeSlot = (idx: number) =>
    setFormSlots(formSlots.filter((_, i) => i !== idx));

  /* Save */
  const handleSave = () => {
    const panel: EvalPanel = {
      id: selectedPanel?.id ?? Date.now(),
      name: formName,
      phase: formPhase,
      status: formStatus,
      supervisors: formSupervisors.filter(Boolean),
      projects: formProjects,
      rubric: formRubric,
      slots: formSlots
        .filter((s) => s.groupId)
        .map((s) => ({
          groupId: s.groupId,
          date: s.date,
          time: s.time,
          room: s.room,
        })),
    };
    if (selectedPanel) {
      setPanels((prev) => prev.map((p) => (p.id === panel.id ? panel : p)));
    } else {
      setPanels((prev) => [...prev, panel]);
    }
    setShowPanelModal(false);
  };

  /* Delete */
  const handleDelete = () => {
    if (selectedPanel) {
      setPanels((prev) => prev.filter((p) => p.id !== selectedPanel.id));
    }
    setDeleteModal(false);
  };

  return (
    <div className={styles.container}>
      <CoordSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={styles.main}>
        <Header
          title="Evaluations"
          subtitle="Manage evaluation panels, schedules, and rubrics"
          userName="Junaid Hussain"
          userId="CO2024001"
        />

        <div className={styles.content}>
          {/* Stats */}
          <div className={styles.statsGrid}>
            <StatsCard
              value={panels.length}
              label="Total Panels"
              icon={<LuUsers />}
              bgColor="#EFF6FF"
              iconColor="#0D3CCF"
            />
            <StatsCard
              value={upcomingCount}
              label="Upcoming"
              icon={<LuClock3 />}
              bgColor="#F0FDF4"
              iconColor="#16A34A"
            />
            <StatsCard
              value={completedCount}
              label="Completed"
              icon={<LuCircleCheck />}
              bgColor="#FEF3C7"
              iconColor="#D97706"
            />
            <StatsCard
              value={remainingProjects.length}
              label="Unscheduled Projects"
              icon={<LuFolder />}
              bgColor="#FFF1F2"
              iconColor="#E11D48"
            />
          </div>

          {/* Remaining projects banner */}
          {remainingProjects.length > 0 && (
            <div className={styles.remainingBanner}>
              <LuTriangleAlert className={styles.remainingBannerIcon} />
              <div className={styles.remainingBannerText}>
                <strong>
                  {remainingProjects.length} project
                  {remainingProjects.length > 1 ? "s" : ""} not yet scheduled
                </strong>
                <span>
                  Assign these to a panel to complete the evaluation cycle.
                </span>
                <div className={styles.remainingList}>
                  {remainingProjects.map((p) => (
                    <span key={p.id} className={styles.remainingTag}>
                      {p.group} · {p.id}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Phase tabs + toolbar */}
          <div className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
              <div className={styles.phaseTabs}>
                {(["All", "Pre-Defense", "Mid-Term", "Final"] as const).map(
                  (ph) => (
                    <button
                      key={ph}
                      className={`${styles.phaseTab} ${activePhase === ph ? styles.phaseTabActive : ""}`}
                      onClick={() => setActivePhase(ph)}
                    >
                      {ph}
                    </button>
                  ),
                )}
              </div>
            </div>
            <div className={styles.toolbarRight}>
              <button className={styles.addButton} onClick={openAddModal}>
                <LuPlus size={14} />
                Create Panel
              </button>
            </div>
          </div>

          {/* Panels list */}
          <div className={styles.panelsList}>
            {filteredPanels.length === 0 ? (
              <div className={styles.emptyState}>
                <LuCalendarDays size={48} />
                <p className={styles.emptyStateTitle}>
                  No panels for this phase
                </p>
                <p className={styles.emptyStateText}>
                  Create a panel to start scheduling evaluations.
                </p>
              </div>
            ) : (
              filteredPanels.map((panel) => (
                <div key={panel.id} className={styles.panelCard}>
                  {/* Card header */}
                  <div className={styles.panelCardHeader}>
                    <div className={styles.panelIconWrapper}>
                      <LuUsers />
                    </div>

                    <div className={styles.panelMeta}>
                      <div className={styles.panelTitleRow}>
                        <h3>{panel.name}</h3>
                        <span
                          className={`${styles.phaseBadge} ${phaseBadgeClass(panel.phase, styles)}`}
                        >
                          {panel.phase}
                        </span>
                        <span
                          className={`${styles.statusBadge} ${statusBadgeClass(panel.status, styles)}`}
                        >
                          {panel.status}
                        </span>
                      </div>
                      <div className={styles.panelSubInfo}>
                        <span>
                          <LuUsers size={12} />
                          {panel.supervisors.length} supervisors
                        </span>
                        <span>
                          <LuFolder size={12} />
                          {panel.projects.length} projects
                        </span>
                        <span>
                          <LuCalendarDays size={12} />
                          {panel.slots.length} slots scheduled
                        </span>
                        <span>
                          <LuBookOpen size={12} />
                          {panel.rubric}
                        </span>
                      </div>
                    </div>

                    <div className={styles.panelActions}>
                      <button
                        className={styles.editBtn}
                        onClick={() => openEditModal(panel)}
                      >
                        <LuPencil size={12} />
                        Edit
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => openDeleteModal(panel)}
                      >
                        <LuTrash2 size={12} />
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Card body: supervisors / projects / schedule */}
                  <div className={styles.panelCardBody}>
                    <div className={styles.panelSection}>
                      <p className={styles.panelSectionTitle}>Supervisors</p>
                      <div className={styles.supervisorChips}>
                        {panel.supervisors.map((sv) => (
                          <div key={sv} className={styles.supervisorChip}>
                            <div className={styles.supervisorAvatar}>
                              {getInitials(sv)}
                            </div>
                            <span className={styles.supervisorName}>{sv}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={styles.panelSection}>
                      <p className={styles.panelSectionTitle}>
                        Projects Assigned
                      </p>
                      <div className={styles.projectPills}>
                        {panel.projects.map((pid) => {
                          const proj = projectById(pid);
                          return (
                            <div key={pid} className={styles.projectPill}>
                              <LuFolder size={11} />
                              <span>
                                <strong>{proj?.group}</strong> ·{" "}
                                {proj?.title ?? pid}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className={styles.panelSection}>
                      <p className={styles.panelSectionTitle}>Schedule</p>
                      <div className={styles.scheduleSlots}>
                        {panel.slots.map((slot, i) => (
                          <div key={i} className={styles.scheduleSlot}>
                            <span className={styles.slotGroup}>
                              {slot.groupId}
                            </span>
                            <span className={styles.slotTime}>
                              {slot.date} · {slot.time}
                            </span>
                            <span className={styles.slotRoom}>
                              <LuDoorOpen size={10} /> {slot.room}
                            </span>
                          </div>
                        ))}
                        {panel.slots.length === 0 && (
                          <span style={{ fontSize: 12, color: "#94a3b8" }}>
                            No slots scheduled yet
                          </span>
                        )}
                      </div>
                      <div style={{ marginTop: 10 }}>
                        <span className={styles.rubricTag}>
                          <LuBookOpen size={11} />
                          {panel.rubric}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Add / Edit Panel Modal ── */}
      {showPanelModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>
                {selectedPanel ? "Edit Panel" : "Create Evaluation Panel"}
              </h2>
              <button
                className={styles.closeBtn}
                onClick={() => setShowPanelModal(false)}
              >
                <LuX />
              </button>
            </div>

            <div className={styles.form}>
              {/* ── Basic Info ── */}
              <div className={styles.formSection}>
                <p className={styles.formSectionTitle}>Panel Details</p>
                <div className={styles.row}>
                  <div className={styles.formGroup}>
                    <label>Panel Name *</label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g., Panel A"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Evaluation Phase *</label>
                    <select
                      value={formPhase}
                      onChange={(e) => setFormPhase(e.target.value as Phase)}
                    >
                      <option value="Pre-Defense">Pre-Defense</option>
                      <option value="Mid-Term">Mid-Term</option>
                      <option value="Final">Final</option>
                    </select>
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.formGroup}>
                    <label>Status</label>
                    <select
                      value={formStatus}
                      onChange={(e) =>
                        setFormStatus(e.target.value as PanelStatus)
                      }
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Evaluation Rubric *</label>
                    <select
                      value={formRubric}
                      onChange={(e) => setFormRubric(e.target.value)}
                    >
                      {ALL_RUBRICS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* ── Supervisors ── */}
              <div className={styles.formSection}>
                <p className={styles.formSectionTitle}>Panel Supervisors</p>
                <div className={styles.supervisorBuilder}>
                  {formSupervisors.map((sv, idx) => (
                    <div key={idx} className={styles.supervisorEntry}>
                      <select
                        value={sv}
                        onChange={(e) => updateSupervisor(idx, e.target.value)}
                      >
                        <option value="">Select supervisor…</option>
                        {ALL_SUPERVISORS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      {formSupervisors.length > 1 && (
                        <button
                          className={styles.removeSupervisorBtn}
                          onClick={() => removeSupervisor(idx)}
                        >
                          <LuX size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    className={styles.addSupervisorBtn}
                    onClick={addSupervisor}
                  >
                    <LuPlus size={13} />
                    Add Supervisor
                  </button>
                </div>
              </div>

              {/* ── Projects ── */}
              <div className={styles.formSection}>
                <p className={styles.formSectionTitle}>Assign Projects</p>
                <div className={styles.projectMultiSelect}>
                  {ALL_PROJECTS.map((proj) => (
                    <label key={proj.id} className={styles.projectOption}>
                      <input
                        type="checkbox"
                        checked={formProjects.includes(proj.id)}
                        onChange={() => toggleProject(proj.id)}
                      />
                      <span className={styles.projectOptionLabel}>
                        <strong>{proj.group}</strong> · {proj.title}
                      </span>
                      <span className={styles.projectOptionGroup}>
                        {proj.id}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* ── Schedule Slots ── */}
              <div className={styles.formSection}>
                <p className={styles.formSectionTitle}>Presentation Schedule</p>
                <div className={styles.slotsBuilder}>
                  {formSlots.map((slot, idx) => (
                    <div key={idx} className={styles.slotBuilderEntry}>
                      <select
                        value={slot.groupId}
                        onChange={(e) =>
                          updateSlot(idx, "groupId", e.target.value)
                        }
                      >
                        <option value="">Group…</option>
                        {ALL_PROJECTS.map((p) => (
                          <option key={p.group} value={p.group}>
                            {p.group}
                          </option>
                        ))}
                      </select>
                      <input
                        type="date"
                        value={slot.date}
                        onChange={(e) =>
                          updateSlot(idx, "date", e.target.value)
                        }
                      />
                      <input
                        type="time"
                        value={slot.time}
                        onChange={(e) =>
                          updateSlot(idx, "time", e.target.value)
                        }
                      />
                      <select
                        value={slot.room}
                        onChange={(e) =>
                          updateSlot(idx, "room", e.target.value)
                        }
                        style={{
                          border: "1px solid #d1d5db",
                          borderRadius: 8,
                          padding: "8px 10px",
                          fontSize: 12,
                        }}
                      >
                        <option value="">Room…</option>
                        {ALL_ROOMS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                      <button
                        className={styles.removeSlotBtn}
                        onClick={() => removeSlot(idx)}
                      >
                        <LuX size={13} />
                      </button>
                    </div>
                  ))}
                  <button className={styles.addSlotBtn} onClick={addSlot}>
                    <LuPlus size={13} />
                    Add Slot
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowPanelModal(false)}
              >
                Cancel
              </button>
              <button className={styles.submitBtn} onClick={handleSave}>
                {selectedPanel ? "Save Changes" : "Create Panel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Modal ── */}
      {deleteModal && (
        <div className={styles.overlay}>
          <div className={styles.deleteModal}>
            <h3
              style={{
                margin: "0 0 10px",
                fontSize: 18,
                fontWeight: 700,
                color: "#1e293b",
              }}
            >
              Delete Panel
            </h3>
            <p style={{ margin: "0 0 20px", fontSize: 14, color: "#64748b" }}>
              Are you sure you want to delete{" "}
              <strong>{selectedPanel?.name}</strong>? All assigned projects and
              schedule slots will be unlinked.
            </p>
            <div
              className={styles.modalFooter}
              style={{ padding: 0, border: "none" }}
            >
              <button
                className={styles.cancelBtn}
                onClick={() => setDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className={styles.deleteConfirmBtn}
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoordEvaluations;
