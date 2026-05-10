import CoordSidebar from "../Sidebar/CoordSidebar";
import { type FC, useState } from "react";
import styles from "./CoordDeadlines.module.css";
import Header from "../../../components/Header/Header";
import StatsCard from "../../../components/StatsCard/StatsCard";
import {
  LuCalendarDays,
  LuClock3,
  LuCircleCheck,
  LuPlus,
  LuPencil,
  LuTrash2,
  LuCalendar,
  LuX,
} from "react-icons/lu";

interface Deadline {
  id: number;
  type: string;
  title: string;
  description: string;
  date: string;
  time: string;
  countdown: string;
  status: "Upcoming" | "Completed";
}

const CoordDeadlines: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedDeadline, setSelectedDeadline] = useState<Deadline | null>(
    null,
  );

  const deadlines: Deadline[] = [
    {
      id: 1,
      type: "Proposal",
      title: "FYP Proposal Submission",
      description:
        "All groups must submit their project proposals including objectives, methodology, and timeline.",
      date: "April 15, 2026",
      time: "11:59 PM",
      countdown: "23 days remaining",
      status: "Upcoming",
    },
    {
      id: 2,
      type: "Report",
      title: "Mid-Term Progress Report",
      description:
        "Submit mid-term progress report with completed milestones and current status.",
      date: "April 30, 2026",
      time: "11:59 PM",
      countdown: "28 days remaining",
      status: "Upcoming",
    },
    {
      id: 3,
      type: "Presentation",
      title: "Progress Presentation",
      description:
        "Groups will present their current progress to the evaluation committee.",
      date: "May 15, 2026",
      time: "11:59 AM",
      countdown: "53 days remaining",
      status: "Upcoming",
    },
  ];

  const openAddModal = () => {
    setSelectedDeadline(null);
    setShowModal(true);
  };

  const openEditModal = (deadline: Deadline) => {
    setSelectedDeadline(deadline);
    setShowModal(true);
  };

  const openDeleteModal = (deadline: Deadline) => {
    setSelectedDeadline(deadline);
    setDeleteModal(true);
  };

  return (
    <div className={styles.container}>
      <CoordSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={styles.main}>
        <Header
          title="Deadlines"
          subtitle="Set and manage project submission deadlines"
          userName="Junaid Hussain"
          userId="CO2024001"
        />

        <div className={styles.content}>
          {/* Stats */}
          <div className={styles.statsGrid}>
            <StatsCard
              value={deadlines.length}
              label="Total Deadlines"
              icon={<LuCalendarDays />}
              bgColor="#EFF6FF"
              iconColor="#0D3CCF"
            />
            <StatsCard
              value={3}
              label="Upcoming"
              icon={<LuClock3 />}
              bgColor="#F0FDF4"
              iconColor="#16A34A"
            />
            <StatsCard
              value={0}
              label="Completed"
              icon={<LuCircleCheck />}
              bgColor="#FEF3C7"
              iconColor="#D97706"
            />
          </div>

          {/* Toolbar */}
          <div className={styles.toolbar}>
            <button className={styles.addButton} onClick={openAddModal}>
              <LuPlus />
              Add Deadline
            </button>
          </div>

          {/* Deadline Cards */}
          <div className={styles.deadlinesList}>
            {deadlines.map((deadline) => (
              <div key={deadline.id} className={styles.deadlineCard}>
                <div className={styles.iconWrapper}>
                  <LuCalendar />
                </div>

                <div className={styles.deadlineBody}>
                  <div className={styles.titleRow}>
                    <h3>{deadline.title}</h3>
                    <span className={styles.statusBadge}>
                      {deadline.status}
                    </span>
                  </div>

                  <p>{deadline.description}</p>

                  <div className={styles.metaRow}>
                    <span>{deadline.date}</span>
                    <span>{deadline.time}</span>
                    <span className={styles.countdown}>
                      {deadline.countdown}
                    </span>
                  </div>
                </div>

                <div className={styles.actions}>
                  <button
                    className={styles.editBtn}
                    onClick={() => openEditModal(deadline)}
                  >
                    <LuPencil />
                    Edit
                  </button>

                  <button
                    className={styles.deleteBtn}
                    onClick={() => openDeleteModal(deadline)}
                  >
                    <LuTrash2 />
                    Delete
                  </button>
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
              <h2>{selectedDeadline ? "Edit Deadline" : "Add New Deadline"}</h2>
              <button
                className={styles.closeBtn}
                onClick={() => setShowModal(false)}
              >
                <LuX />
              </button>
            </div>

            <div className={styles.form}>
              <div className={styles.formGroup}>
                <label>Deadline Type *</label>
                <input
                  type="text"
                  defaultValue={selectedDeadline?.type || ""}
                  placeholder="Proposal"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Title *</label>
                <input
                  type="text"
                  defaultValue={selectedDeadline?.title || ""}
                  placeholder="e.g., FYP Proposal Submission"
                />
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
                <textarea
                  rows={5}
                  defaultValue={selectedDeadline?.description || ""}
                  placeholder="Enter deadline description and requirements..."
                />
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
                {selectedDeadline ? "Save Changes" : "Add Deadline"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div className={styles.overlay}>
          <div className={styles.deleteModal}>
            <h3>Delete Deadline</h3>
            <p>
              Are you sure you want to delete
              <strong> {selectedDeadline?.title}</strong>?
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

export default CoordDeadlines;
