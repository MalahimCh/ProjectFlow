import SSidebar from "../Sidebar/Ssidebar";
import { type FC, useState } from "react";
import styles from "./SRequests.module.css";
import Header from "../../../components/Header/Header";
import StatsCard from "../../../components/StatsCard/StatsCard";
import {
  LuUsers,
  LuMessageSquareText,
  LuCalendar,
  LuUserCheck,
} from "react-icons/lu";

type Request = {
  id: string;
  studentName: string;
  rollNo: string;
  section: string;
  projectName: string;
  description: string;
  submittedOn: string;
  lastDate: string;
  proposalLink: string;
  status: "pending" | "accepted" | "rejected";
};

const initialRequests: Request[] = [
  {
    id: "r1",
    studentName: "Ali Raza",
    rollNo: "23L-0948",
    section: "BSCS-8A",
    projectName: "AI Chatbot System",
    description: "AI chatbot for student queries using NLP",
    submittedOn: "2026-04-20",
    lastDate: "2026-04-25",
    proposalLink: "https://example.com/proposal1.pdf",
    status: "pending",
  },
  {
    id: "r2",
    studentName: "Sara Khan",
    rollNo: "23L-0949",
    section: "BSCS-8B",
    projectName: "Smart Attendance System",
    description: "Face recognition attendance system",
    submittedOn: "2026-04-19",
    lastDate: "2026-04-24",
    proposalLink: "https://example.com/proposal2.pdf",
    status: "pending",
  },
];

const SRequests: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [requests, setRequests] = useState<Request[]>(initialRequests);

  const updateStatus = (id: string, status: "accepted" | "rejected") => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r)),
    );
  };

  const viewProposal = (link: string) => {
    window.open(link, "_blank");
  };
  const pending = requests.filter((r) => r.status === "pending").length;
  const accepted = requests.filter((r) => r.status === "accepted").length;
  const rejected = requests.filter((r) => r.status === "rejected").length;

  return (
    <div className={styles.container}>
      <SSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={styles.main}>
        <Header
          title="Requests"
          subtitle="View and manage your requests"
          userName="Junaid Hussain"
          userId="CO2024001"
        />

        <div className={styles.content}>
          <div className={styles.statsGrid}>
            <StatsCard
              value={pending}
              label="Pending Requests"
              icon={<LuUsers />}
              bgColor="#EFF6FF"
              iconColor="#0D3CCF"
            />
            <StatsCard
              value={accepted}
              label="Accepted"
              icon={<LuMessageSquareText />}
              bgColor="#F0FDF4"
              iconColor="#16A34A"
            />
            <StatsCard
              value={rejected}
              label="Rejected"
              icon={<LuCalendar />}
              bgColor="#FEF2F2"
              iconColor="#DC2626"
            />
            <StatsCard
              value={requests.length}
              label="Total Requests"
              icon={<LuUserCheck />}
              bgColor="#FFF7ED"
              iconColor="#F59E0B"
            />
          </div>

          <div className={styles.sectionHeader}>
            <p className={styles.title}>Pending Requests</p>

            <div className={styles.requestList}>
              {requests.map((r) => (
                <div key={r.id} className={styles.requestCard}>
                  {/* TOP ROW */}
                  <div className={styles.topRow}>
                    <div className={styles.studentInfo}>
                      <div className={styles.avatar}>👤</div>

                      <div>
                        <p className={styles.studentName}>{r.studentName}</p>
                        <span className={styles.meta}>{r.rollNo}</span>
                        <span className={styles.badge}>{r.section}</span>
                      </div>
                    </div>

                    <div className={styles.statusBadge}>
                      {r.status === "pending" ? "Awaiting Review" : r.status}
                    </div>
                  </div>

                  {/* PROJECT INFO */}
                  <div className={styles.projectInfo}>
                    <h4>{r.projectName}</h4>
                    <p>{r.description}</p>
                  </div>

                  {/* DATES */}
                  <div className={styles.dates}>
                    <span>📅 Submitted: {r.submittedOn}</span>
                    <span>⏰ Deadline: {r.lastDate}</span>
                  </div>

                  {/* ACTIONS */}
                  <div className={styles.actionsRow}>
                    <button onClick={() => viewProposal(r.proposalLink)}>
                      📄 View Proposal
                    </button>

                    {r.status === "pending" && (
                      <div className={styles.rightActions}>
                        <button
                          className={styles.reject}
                          onClick={() => updateStatus(r.id, "rejected")}
                        >
                          Reject
                        </button>

                        <button
                          className={styles.approve}
                          onClick={() => updateStatus(r.id, "accepted")}
                        >
                          Approve
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SRequests;
