import CoordSidebar from "../Sidebar/CoordSidebar";
import { type FC, useState } from "react";
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
  const [selectedRubric, setSelectedRubric] = useState<Rubric | null>(null);

  const [criteria, setCriteria] = useState<Criterion[]>([
    { name: "", marks: 0 },
  ]);

  const rubrics: Rubric[] = [
    {
      id: 1,
      type: "Proposal",
      name: "Proposal Evaluation Rubric",
      criteria: [
        { name: "Problem Statement", marks: 20 },
        { name: "Objectives & Scope", marks: 20 },
        { name: "Methodology", marks: 25 },
        { name: "Literature Review", marks: 20 },
        { name: "Timeline & Feasibility", marks: 15 },
      ],
    },
    {
      id: 2,
      type: "Presentation",
      name: "Mid-Term Presentation Rubric",
      criteria: [
        { name: "Technical Progress", marks: 40 },
        { name: "Presentation Skills", marks: 20 },
        { name: "Demonstration", marks: 20 },
        { name: "Q&A", marks: 20 },
      ],
    },
  ];

  const totalMarks = criteria.reduce(
    (sum, criterion) => sum + Number(criterion.marks || 0),
    0,
  );

  const openAddModal = () => {
    setSelectedRubric(null);
    setCriteria([{ name: "", marks: 0 }]);
    setShowModal(true);
  };

  const openEditModal = (rubric: Rubric) => {
    setSelectedRubric(rubric);
    setCriteria(rubric.criteria);
    setShowModal(true);
  };

  const openDeleteModal = (rubric: Rubric) => {
    setSelectedRubric(rubric);
    setDeleteModal(true);
  };

  const addCriterion = () => {
    setCriteria([...criteria, { name: "", marks: 0 }]);
  };

  const updateCriterion = (
    index: number,
    field: "name" | "marks",
    value: string,
  ) => {
    const updated = [...criteria];
    if (field === "marks") {
      updated[index].marks = Number(value);
    } else {
      updated[index].name = value;
    }
    setCriteria(updated);
  };

  const getRubricTotal = (rubric: Rubric) =>
    rubric.criteria.reduce((sum, c) => sum + c.marks, 0);

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
              value={rubrics.reduce(
                (sum, rubric) => sum + getRubricTotal(rubric),
                0,
              )}
              label="Total Marks Defined"
              icon={<LuCircleCheck />}
              bgColor="#F0FDF4"
              iconColor="#16A34A"
            />
          </div>

          {/* Toolbar */}
          <div className={styles.toolbar}>
            <button className={styles.addButton} onClick={openAddModal}>
              <LuPlus />
              Create Rubric
            </button>
          </div>

          {/* Rubrics List */}
          <div className={styles.rubricsList}>
            {rubrics.map((rubric) => (
              <div key={rubric.id} className={styles.rubricCard}>
                <div className={styles.rubricHeader}>
                  <div>
                    <h3>{rubric.name}</h3>
                    <p>
                      Total Marks: <strong>{getRubricTotal(rubric)}</strong>
                    </p>
                  </div>

                  <div className={styles.actions}>
                    <button
                      className={styles.editBtn}
                      onClick={() => openEditModal(rubric)}
                    >
                      <LuPencil />
                      Edit
                    </button>

                    <button
                      className={styles.deleteBtn}
                      onClick={() => openDeleteModal(rubric)}
                    >
                      <LuTrash2 />
                      Delete
                    </button>
                  </div>
                </div>

                <div className={styles.criteriaList}>
                  {rubric.criteria.map((criterion, index) => (
                    <div key={index} className={styles.criteriaItem}>
                      <span>{criterion.name}</span>
                      <span className={styles.criteriaMarks}>
                        {criterion.marks} marks
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{selectedRubric ? "Edit Rubric" : "Create New Rubric"}</h2>
              <button
                className={styles.closeBtn}
                onClick={() => setShowModal(false)}
              >
                <LuX />
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

              <div className={styles.criteriaSection}>
                <div className={styles.criteriaHeader}>
                  <h4>Evaluation Criteria</h4>
                </div>

                {criteria.map((criterion, index) => (
                  <div key={index} className={styles.criteriaRow}>
                    <input
                      type="text"
                      placeholder={`Criteria ${index + 1}`}
                      value={criterion.name}
                      onChange={(e) =>
                        updateCriterion(index, "name", e.target.value)
                      }
                    />

                    <input
                      type="number"
                      placeholder="Marks"
                      value={criterion.marks || ""}
                      onChange={(e) =>
                        updateCriterion(index, "marks", e.target.value)
                      }
                    />
                  </div>
                ))}

                <button
                  type="button"
                  className={styles.addCriteriaBtn}
                  onClick={addCriterion}
                >
                  <LuPlus />
                  Add Criteria
                </button>

                <div className={styles.totalMarksBox}>
                  Total Marks: <strong>{totalMarks}</strong>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
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
          <div className={styles.deleteModal}>
            <h3>Delete Rubric</h3>
            <p>
              Are you sure you want to delete
              <strong> {selectedRubric?.name}</strong>?
            </p>

            <div className={styles.modalFooter}>
              <button
                className={styles.cancelBtn}
                onClick={() => setDeleteModal(false)}
              >
                Cancel
              </button>
              <button className={styles.deleteConfirmBtn}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoordRubrics;
