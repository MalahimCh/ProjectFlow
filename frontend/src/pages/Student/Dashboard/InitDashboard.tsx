import InitSidebar from "../Sidebar/InitSidebar";
import { type FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./InitDashboard.module.css";
import Header from "../../../components/Header/Header";
import StatsCard from "../../../components/StatsCard/StatsCard";
import {
  LuUsers,
  LuCircleAlert,
  LuMessageSquareText,
  LuCalendar,
} from "react-icons/lu";

/* ================= MOCK DATA ================= */

// 👉 CHANGE THESE STATES TO TEST UI

const mockData = {
  group: {
    members: [
      {
        id: "1",
        name: "Malahim Chaudhary",
        reg: "2020-CS-123",
        isLeader: true,
      },
      { id: "2", name: "Minahil Mudassar", reg: "2020-CS-145" },
      { id: "3", name: "Abdullah Tahir", reg: "2020-CS-167" },
    ],
  },

  supervisor: {
    name: "Dr. Muhammad Kamran",
    requestedOn: "March 28, 2026",
    status: "accepted", // "none" | "pending" | "accepted"
  },
};

/* ================= COMPONENT ================= */

const InitDashboard: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const members = mockData.group.members;
  const supervisor = mockData.supervisor;

  /* ===== DERIVED STATE ===== */

  const isGroupComplete = members.length === 3;

  const hasSupervisorAssigned = supervisor?.status === "accepted";
  const hasSupervisorRequested = supervisor?.status === "pending";
  const noSupervisor = !supervisor || supervisor?.status === "none";

  const FindTeamMembersButtonClick = () => {
    navigate("/student/findteam");
  };

  const RequestSupervisorButtonClick = () => {
    navigate("/student/findsupervisor");
  };

  const SubmitButtonClicked = () => {
    navigate("/student/dashboard");
  };
  /* ===== STATS ===== */

  const groupCount = members.length;
  const pendingRequests = 3; // mock
  const supervisorStatus = noSupervisor
    ? "None"
    : hasSupervisorRequested
      ? "Pending"
      : "Accepted";

  return (
    <div className={styles.container}>
      <InitSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={styles.main}>
        <Header
          title="Dashboard"
          subtitle="Welcome back, Malahim Chaudhary"
          userName="Malahim Chaudhary"
          userId="CO2024001"
        />

        <div className={styles.content}>
          {/* ================= STATS ================= */}
          <div className={styles.statsGrid}>
            <StatsCard
              value={`${groupCount} / 3`}
              label="Group Members"
              icon={<LuUsers />}
              bgColor="#EFF6FF"
              iconColor="#0D3CCF"
            />

            <StatsCard
              value={pendingRequests}
              label="Pending Requests"
              icon={<LuMessageSquareText />}
              bgColor="#FEF2F2"
              iconColor="#DC2626"
            />

            <StatsCard
              value={supervisorStatus}
              label="Supervisor Status"
              icon={<LuCalendar />}
              bgColor="#F0FDF4"
              iconColor="#16A34A"
            />
          </div>

          {/* ================= BANNER ================= */}
          <div
            className={`${styles.completeGroup} ${
              hasSupervisorAssigned ? styles.successBox : ""
            }`}
          >
            <div className={styles.row}>
              <div className={styles.left}>
                <span className={styles.icon}>
                  {hasSupervisorAssigned ? "✓" : <LuCircleAlert />}
                </span>

                <div>
                  {/* 1. Incomplete */}
                  {!isGroupComplete && (
                    <>
                      <p className={styles.title}>Complete Your Group</p>
                      <p className={styles.subtitle}>
                        You need {3 - members.length} more members to complete
                        your group.
                      </p>
                    </>
                  )}

                  {/* 2. No supervisor */}
                  {isGroupComplete && noSupervisor && (
                    <>
                      <p className={styles.title}>Request Supervisor</p>
                      <p className={styles.subtitle}>
                        Request a supervisor to submit your group.
                      </p>
                    </>
                  )}

                  {/* 3. Pending */}
                  {isGroupComplete && hasSupervisorRequested && (
                    <>
                      <p className={styles.title}>Supervisor Requested</p>
                      <p className={styles.subtitle}>
                        Your request is pending approval.
                      </p>
                    </>
                  )}

                  {/* 4. Accepted */}
                  {isGroupComplete && hasSupervisorAssigned && (
                    <>
                      <p className={styles.title}>Group Ready for Submission</p>
                      <p className={styles.subtitle}>
                        Your group is complete and supervisor has accepted.
                        Submit your group for coordinator approval.
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* BUTTONS */}
              {!isGroupComplete && (
                <button
                  className={styles.action}
                  onClick={FindTeamMembersButtonClick}
                >
                  Find Team Members
                </button>
              )}

              {isGroupComplete && noSupervisor && (
                <button
                  className={styles.action}
                  onClick={RequestSupervisorButtonClick}
                >
                  Request Supervisor
                </button>
              )}

              {isGroupComplete && hasSupervisorRequested && (
                <button className={styles.action} disabled>
                  Waiting Approval
                </button>
              )}

              {isGroupComplete && hasSupervisorAssigned && (
                <button
                  className={styles.successBtn}
                  onClick={SubmitButtonClicked}
                >
                  Submit Group
                </button>
              )}
            </div>
          </div>

          {/* ================= GROUP ================= */}
          {members.length > 0 && (
            <div className={styles.card}>
              <h3>My Group</h3>

              {members.map((m) => (
                <div key={m.id} className={styles.listItem}>
                  <div className={styles.avatar}>
                    {m.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>

                  <div className={styles.info}>
                    <p className={styles.name}>{m.name}</p>
                    <p className={styles.reg}>{m.reg}</p>
                  </div>

                  {m.isLeader && <span className={styles.badge}>Leader</span>}
                </div>
              ))}
            </div>
          )}

          {/* ================= SUPERVISOR ================= */}
          {supervisor && supervisor.status !== "none" && (
            <div className={styles.card}>
              <h3>Supervisor</h3>

              <div className={styles.listItem}>
                <div>
                  <p className={styles.name}>{supervisor.name}</p>

                  <p className={styles.reg}>
                    {hasSupervisorAssigned
                      ? "Assigned Supervisor"
                      : `Requested on ${supervisor.requestedOn}`}
                  </p>
                </div>

                <span
                  className={`${styles.badge} ${
                    hasSupervisorAssigned ? styles.accepted : styles.pending
                  }`}
                >
                  {hasSupervisorAssigned ? "Accepted" : "Pending"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InitDashboard;
