import SSidebar from "../Sidebar/Ssidebar";
import { type FC, useState } from "react";
import styles from "./SRequests.module.css";
import Header from "../../../components/Header/Header";
import StatsCard from "../../../components/StatsCard/StatsCard";
import { LuUsers, LuMessageSquareText, LuCalendar, LuUserCheck, LuUser, LuClock, LuFileText, LuCircleX, LuCircleCheck } from "react-icons/lu";

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
    section: "BCS-8A",
    projectName: "AI Chatbot System",
    description: "AI chatbot for student queries using NLP.",
    submittedOn: "2026-04-18",
    lastDate: "2026-05-31",
    proposalLink: "https://example.com/proposal1.pdf",
    status: "pending",
  },
  {
    id: "r2",
    studentName: "Abdullah Tahir",
    rollNo: "23L-0602",
    section: "BCS-6H",
    projectName: "FYP Management System",
    description:
      "Web-based platform that manages FYP proposals, approvals and progress tracking in one centralized system.",
    submittedOn: "2026-04-19",
    lastDate: "2026-05-31",
    proposalLink: "https://example.com/proposal2.pdf",
    status: "pending",
  },
  {
    id: "r3",
    studentName: "Sara Khan",
    rollNo: "23L-0949",
    section: "BDS-8B",
    projectName: "Smart Attendance System",
    description: "Face recognition attendance system.",
    submittedOn: "2026-04-21",
    lastDate: "2026-05-31",
    proposalLink: "https://example.com/proposal3.pdf",
    status: "pending",
  },
];

const SRequests: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [requests, setRequests] = useState<Request[]>(initialRequests);

  const updateStatus = (id: string, status: "accepted" | "rejected") => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const viewProposal = (link: string) => {
    window.open(link, "_blank");
  };

  const pending = requests.filter((r) => r.status === "pending").length;
  const accepted = requests.filter((r) => r.status === "accepted").length;
  const rejected = requests.filter((r) => r.status === "rejected").length;

  const renderPendingCard = (r: Request) => (
    <>
      <div className={styles.studentInfo}>
        <div className={styles.userIcon}><LuUser /></div>
        <div>
          <p className={styles.studentName}>{r.studentName}</p>
          <span className={styles.studentRollNo}>{r.rollNo}</span>
          <span className={styles.studentSection}>{r.section}</span>
        </div>
      </div>

      <div className={styles.projectInfo}>
        <p className={styles.projectName}>{r.projectName}</p>
        <p className={styles.projectDescp}>{r.description}</p>

        <div className={styles.dates}>
          <div className={styles.singleDate}>
            <LuCalendar /> Submitted: {r.submittedOn}
          </div>
          <div className={styles.singleDate}>
            <LuClock /> Deadline: {r.lastDate}
          </div>
        </div>
      </div>

      <div className={styles.actionsRow}>
        <button
          className={styles.proposalButton}
          onClick={() => viewProposal(r.proposalLink)}
        >
          <LuFileText />
          <p>View Proposal</p>
        </button>

        {r.status === "pending" && (
          <div className={styles.rightActions}>
            <button
              className={styles.reject}
              onClick={() => updateStatus(r.id, "rejected")}
            >
              <LuCircleX />
              <p>Reject</p>
            </button>

            <button
              className={styles.approve}
              onClick={() => updateStatus(r.id, "accepted")}
            >
              <LuCircleCheck />
              <p>Approve</p>
            </button>
          </div>
        )}
      </div>
    </>
  );

  const renderAcceptedCard = (r: Request) => (
    <>
      <div className={styles.actionedTop}>
        <div className={styles.studentInfo}>
          <div className={styles.userIcon}><LuUser /></div>
          <div>
            <p className={styles.studentName}>{r.studentName}</p>
            <span className={styles.studentRollNo}>{r.rollNo}</span>
            <span className={styles.studentSection}>{r.section}</span>
          </div>
        </div>
        <div>
          <p className={styles.approveLabel}>Approved</p>
        </div>
      </div>

      <div className={styles.projectInfo}>
        <p className={styles.projectNameActioned}>{r.projectName}</p>
        <div className={styles.dates}>
          <div className={styles.singleDate}>
            <LuCalendar /> Approved on: {r.submittedOn}
          </div>
        </div>
      </div>

      <div className={styles.actionsRow}>
        <button
          className={styles.proposalButton}
          onClick={() => viewProposal(r.proposalLink)}
        >
          <LuFileText />
          <p>View Proposal</p>
        </button>
      </div>
    </>
  );

  const renderRejectedCard = (r: Request) => (
    <>
      <div className={styles.actionedTop}>
        <div className={styles.studentInfo}>
          <div className={styles.userIcon}><LuUser /></div>
          <div>
            <p className={styles.studentName}>{r.studentName}</p>
            <span className={styles.studentRollNo}>{r.rollNo}</span>
            <span className={styles.studentSection}>{r.section}</span>
          </div>
        </div>
        <div>
          <p className={styles.rejectLabel}>Rejected</p>
        </div>
      </div>

      <div className={styles.projectInfo}>
        <p className={styles.projectNameActioned}>{r.projectName}</p>
        <div className={styles.dates}>
          <div className={styles.singleDate}>
            <LuCalendar /> Approved on: {r.submittedOn}
          </div>
        </div>
      </div>

      <div className={styles.actionsRow}>
        <button
          className={styles.proposalButton}
          onClick={() => viewProposal(r.proposalLink)}
        >
          <LuFileText />
          <p>View Proposal</p>
        </button>
      </div>
    </>
  );

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
            <StatsCard value={pending} label="Pending Requests" icon={<LuUsers />} bgColor="#EFF6FF" iconColor="#0D3CCF" />
            <StatsCard value={accepted} label="Accepted" icon={<LuMessageSquareText />} bgColor="#F0FDF4" iconColor="#16A34A" />
            <StatsCard value={rejected} label="Rejected" icon={<LuCalendar />} bgColor="#FEF2F2" iconColor="#DC2626" />
            <StatsCard value={requests.length} label="Total Requests" icon={<LuUserCheck />} bgColor="#FFF7ED" iconColor="#F59E0B" />
          </div>

          <div className={styles.request}>
            <div className={styles.requestHeader}>
              <p className={styles.requestTitle}>Pending Requests</p>
              <p className={styles.requestCountText}>
                {pending} Awaiting Requests
              </p>
            </div>

            <div className={styles.requestList}>
              {requests
                .filter((r) => r.status === "pending")
                .map((r) => (
                  <div key={r.id} className={styles.requestCard}>
                    {renderPendingCard(r)}
                  </div>
                ))}
            </div>
          </div>

          {requests.filter((r) => r.status === "accepted").length > 0 && (
            <div className={styles.request}>
              <div className={styles.requestHeader}>
                <p className={styles.requestTitle}>Approved Requests</p>
              </div>

              <div className={styles.requestList}>
                {requests
                  .filter((r) => r.status === "accepted")
                  .map((r) => (
                    <div key={r.id} className={styles.requestCard}>
                      {renderAcceptedCard(r)}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {requests.filter((r) => r.status === "rejected").length > 0 && (
            <div className={styles.request}>
              <div className={styles.requestHeader}>
                <p className={styles.requestTitle}>Rejected Requests</p>
              </div>

              <div className={styles.requestList}>
                {requests
                  .filter((r) => r.status === "rejected")
                  .map((r) => (
                    <div key={r.id} className={styles.requestCard}>
                      {renderRejectedCard(r)}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SRequests;