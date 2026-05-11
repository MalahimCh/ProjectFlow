import CoordSidebar from "../Sidebar/CoordSidebar";
import { type FC, useState, useRef, useEffect } from "react";
import styles from "./CoordRubric.module.css";
import Header from "../../../components/Header/Header";
import StatsCard from "../../../components/StatsCard/StatsCard";
import {
  LuClipboardList,
  LuCircleCheck,
  LuPlus,
  LuPencil,
  LuTrash2,
  LuX,
  LuCheck,
} from "react-icons/lu";

interface Criterion {
  name: string;
  marks: number;
}

interface Rubric {
  id: number;
  type: string;
  name: string;
  criteria: Criterion[];
}

const CoordRubrics: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [selectedRubric, setSelectedRubric] = useState<Rubric | null>(null);
  const [criteria, setCriteria] = useState<Criterion[]>([{ name: "", marks: 0 }]);

  const modalRef = useRef<HTMLDivElement>(null);
  const deleteModalRef = useRef<HTMLDivElement>(null);

  const [rubrics, setRubrics] = useState<Rubric[]>([
    {
      id: 1,
      type: "Proposal",
      name: "Proposal Evaluation Rubric",
      criteria: [
        { name: "Problem Statement",     marks: 20 },
        { name: "Objectives & Scope",    marks: 20 },
        { name: "Methodology",           marks: 25 },
        { name: "Literature Review",     marks: 20 },
        { name: "Timeline & Feasibility",marks: 15 },
      ],
    },
    {
      id: 2,
      type: "Final",
      name: "Final Project Rubric",
      criteria: [
        { name: "Implementation Quality", marks: 30 },
        { name: "Documentation",          marks: 20 },
        { name: "Presentation",           marks: 25 },
        { name: "Innovation",             marks: 25 },
      ],
    },
  ]);

  /* close modal on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (showModal && modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowModal(false);
      }
      if (deleteModal && deleteModalRef.current && !deleteModalRef.current.contains(e.target as Node)) {
        setDeleteModal(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showModal, deleteModal]);

  const totalMarks = criteria.reduce((sum, c) => sum + Number(c.marks || 0), 0);
  const getRubricTotal = (rubric: Rubric) => rubric.criteria.reduce((sum, c) => sum + c.marks, 0);

  const openAddModal = () => {
    setSelectedRubric(null);
    setCriteria([{ name: "", marks: 0 }]);
    setShowModal(true);
  };

  const openEditModal = (rubric: Rubric) => {
    setSelectedRubric(rubric);
    setCriteria([...rubric.criteria]);
    setShowModal(true);
  };

  const openDeleteModal = (rubric: Rubric) => {
    setSelectedRubric(rubric);
    setDeleteModal(true);
  };

  const handleDelete = () => {
    if (selectedRubric) {
      setRubrics((prev) => prev.filter((r) => r.id !== selectedRubric.id));
    }
    setDeleteModal(false);
  };

  const addCriterion = () => setCriteria([...criteria, { name: "", marks: 0 }]);

  const removeCriterion = (index: number) =>
    setCriteria(criteria.filter((_, i) => i !== index));

  const updateCriterion = (index: number, field: "name" | "marks", value: string) => {
    const updated = [...criteria];
    if (field === "marks") updated[index].marks = Number(value);
    else updated[index].name = value;
    setCriteria(updated);
  };

  return (
    <div className={styles.container}>
      <CoordSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={styles.main}>
        <Header
          title="Rubrics"
          subtitle="Create and manage evaluation rubrics"
          userName="Junaid Hussain"
          userId="CO2024001"
        />

        <div className={styles.content}>
          {/* Stats */}
          <div className={styles.statsGrid}>
            <StatsCard
              value={rubrics.length}
              label="Total Rubrics"
              icon={<LuClipboardList />}
              bgColor="#EFF6FF"
              iconColor="#0D3CCF"
            />
            <StatsCard
              value={rubrics.reduce((sum, r) => sum + getRubricTotal(r), 0)}
              label="Total Marks Defined"
              icon={<LuCircleCheck />}
              bgColor="#F0FDF4"
              iconColor="#16A34A"
            />
          </div>

          {/* Create button row */}
          <div className={styles.addRow}>
            <button className={styles.addButton} onClick={openAddModal}>
              <LuPlus size={14} />
              Create Rubric
            </button>
          </div>

          {/* Rubrics List */}
          <div className={styles.rubricsList}>
            {rubrics.length === 0 ? (
              <div className={styles.emptyState}>
                <LuClipboardList size={28} className={styles.emptyIcon} />
                <p className={styles.emptyText}>No rubrics yet</p>
                <p className={styles.emptySub}>Click "+ Create Rubric" to add your first evaluation rubric.</p>
              </div>
            ) : (
              rubrics.map((rubric) => (
                <div key={rubric.id} className={styles.rubricCard}>
                  {/* Rubric Header */}
                  <div className={styles.rubricHeader}>
                    <div>
                      <p className={styles.rubricName}>{rubric.name}</p>
                      <p className={styles.rubricTotal}>
                        Total Marks: <span className={styles.rubricTotalVal}>{getRubricTotal(rubric)}</span>
                      </p>
                    </div>
                    <div className={styles.actions}>
                      <button className={styles.editBtn} onClick={() => openEditModal(rubric)}>
                        <LuPencil size={13} /> Edit
                      </button>
                      <button className={styles.deleteBtn} onClick={() => openDeleteModal(rubric)}>
                        <LuTrash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>

                  {/* Criteria */}
                  <div className={styles.criteriaList}>
                    {rubric.criteria.map((criterion, i) => (
                      <div key={i} className={styles.criteriaItem}>
                        <span className={styles.criteriaName}>{criterion.name}</span>
                        <span className={styles.criteriaMarks}>{criterion.marks} marks</span>
                      </div>
                    ))}
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
          <div className={styles.modal} ref={modalRef}>
            <div className={styles.modalHeader}>
              <p className={styles.modalTitle}>
                {selectedRubric ? "Edit Rubric" : "Create New Rubric"}
              </p>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}>
                <LuX size={16} />
              </button>
            </div>

            <div className={styles.form}>
              <div className={styles.formGroup}>
                <label>Rubric Name *</label>
                <input
                  type="text"
                  defaultValue={selectedRubric?.name || ""}
                  placeholder="e.g., Proposal Evaluation Rubric"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Rubric Type *</label>
                <input
                  type="text"
                  defaultValue={selectedRubric?.type || ""}
                  placeholder="e.g., Proposal"
                />
              </div>

              {/* Criteria section */}
              <div className={styles.criteriaSection}>
                <div className={styles.criteriaSectionHeader}>
                  <p className={styles.criteriaSectionTitle}>Evaluation Criteria</p>
                  <button type="button" className={styles.addCriteriaBtn} onClick={addCriterion}>
                    <LuPlus size={13} /> Add Criterion
                  </button>
                </div>

                <div className={styles.criteriaInputList}>
                  {criteria.map((criterion, index) => (
                    <div key={index} className={styles.criteriaRow}>
                      <input
                        type="text"
                        placeholder={`Criteria ${index + 1}`}
                        value={criterion.name}
                        onChange={(e) => updateCriterion(index, "name", e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Marks"
                        value={criterion.marks || ""}
                        onChange={(e) => updateCriterion(index, "marks", e.target.value)}
                      />
                      {criteria.length > 1 && (
                        <button
                          type="button"
                          className={styles.removeCriteriaBtn}
                          onClick={() => removeCriterion(index)}
                        >
                          <LuX size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className={styles.totalMarksBox}>
                  Total Marks: <span className={styles.totalMarksVal}>{totalMarks}</span>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
              <button className={styles.submitBtn}>
                {selectedRubric ? "Save Changes" : "Create Rubric"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div className={styles.overlay}>
          <div className={styles.deleteModal} ref={deleteModalRef}>
            <div className={styles.deleteModalTop}>
              <div>
                <p className={styles.deleteTitle}>Delete Rubric?</p>
                <p className={styles.deleteDesc}>This action can not be undone.</p>
              </div>
              <button className={styles.closeBtn} onClick={() => setDeleteModal(false)}>
                <LuX size={16} />
              </button>
            </div>

            <label className={styles.dontShowLabel}>
              <div
                className={`${styles.checkbox} ${dontShowAgain ? styles.checkboxActive : ""}`}
                onClick={() => setDontShowAgain((p) => !p)}
              >
                {dontShowAgain && <LuCheck size={13} color="#FFFFFF" strokeWidth={3} />}
              </div>
              <span>Don't show this again</span>
            </label>

            <div className={styles.deleteDivider} />

            <div className={styles.deleteFooter}>
              <button className={styles.cancelBtn} onClick={() => setDeleteModal(false)}>Cancel</button>
              <button className={styles.deleteConfirmBtn} onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoordRubrics;