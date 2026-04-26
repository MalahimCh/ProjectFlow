import InitSidebar from "../Sidebar/InitSidebar";
import { type FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./InitDashboard.module.css";
import Header from "../../../components/Header/Header";
import StatsCard from "../../../components/StatsCard/StatsCard";
import { LuUsers, LuCircleAlert, LuMessageSquareText, LuCalendar, LuCheck, LuUserPlus } from "react-icons/lu";

/* ================= MOCK DATA ================= */

// 👉 CHANGE THESE STATES TO TEST UI

const mockData = {
  group: {
    members: [
      { id: "1", name: "Malahim Chaudhary", reg: "23L-0840", isLeader: true },
      { id: "2", name: "Minahil Mudassar", reg: "23L-0877" },
      { id: "3", name: "Abdullah Tahir", reg: "23L-0602" },
    ],
  },

  // supervisor: {
  //   name: "none",
  //   requestedOn: "none",
  //   status: "none"
  // },

  // supervisor: {
  //   name: "Mr. Muhammad Kamran",
  //   requestedOn: "Mar 28, 2026",
  //   acceptedOn: "none",
  //   status: "pending", // "none" | "pending" | "accepted"
  // },

  supervisor: {
    name: "Mr. Muhammad Kamran",
    requestedOn: "Mar 28, 2026",
    acceptedOn: "Apr 22, 2026",
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
          userId="ST2024001"
        />

        <div className={styles.content}>
          {/* ================= STATS ================= */}
          <div className={styles.statsGrid}>
            <StatsCard value={`${groupCount} / 3`} label="Group Members" icon={<LuUsers />} bgColor="#EFF6FF" iconColor="#0D3CCF"/>
            <StatsCard value={pendingRequests} label="Pending Requests" icon={<LuMessageSquareText />} bgColor="#FEF2F2" iconColor="#DC2626"/>
            <StatsCard value={supervisorStatus} label="Supervisor Status" icon={<LuCalendar />} bgColor="#F0FDF4" iconColor="#16A34A"/>
          </div>

          {/* ================= BANNER ================= */}
          <div
            className={`${styles.completeGroup} ${
              hasSupervisorAssigned ? styles.successBox
                : hasSupervisorRequested ? styles.pendingBox : ""
            }`}
          >
            <div className={styles.row}>
              <div className={styles.left}>
                <span
                  className={`${styles.icon} ${
                    hasSupervisorAssigned ? styles.successIcon
                      : hasSupervisorRequested ? styles.pendingIcon : styles.primaryIcon
                  }`}
                >
                  {!isGroupComplete ? (
                    <LuCircleAlert />
                  ) : (
                    <LuCheck />
                  )}
                </span>

                <div>
                  {/* 1. Incomplete */}
                  {!isGroupComplete && (
                    <>
                      <p className={styles.title}>Complete Your Group</p>
                      <p className={styles.subtitle}>
                        You need {3 - members.length} more members to complete your group.
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
                        Your group is complete and supervisor has accepted. Submit your group for coordinator approval.
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* BUTTONS */}
              {!isGroupComplete && (
                <button
                  className={styles.action}
                  onClick={FindTeamMembersButtonClick}>
                  Find Team Members
                </button>
              )}

              {isGroupComplete && noSupervisor && (
                <button
                  className={styles.action}
                  onClick={RequestSupervisorButtonClick}>
                  Request Supervisor
                </button>
              )}

              {isGroupComplete && hasSupervisorRequested && (
                <button className={styles.pendingBtn} disabled>
                  Awaiting Approval
                </button>
              )}

              {isGroupComplete && hasSupervisorAssigned && (
                <button
                  className={styles.successBtn}
                  onClick={SubmitButtonClicked}>
                  Submit Group
                </button>
              )}
            </div>
          </div>

          {/* ================= GROUP ================= */}
          {members.length > 0 && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <p className={styles.cardHeading}>My Group</p>
              </div>
              <div className={styles.memberList}>
                {[...members, ...Array(3 - members.length).fill(null)].map(
                  (member, index) => (
                    <div
                      key={member ? member.id : `empty-${index}`}
                      className={
                        member ? styles.listItem : `${styles.listItem} ${styles.emptyWrapper}`
                      }
                    >
                      {member ? (
                        <>
                          <div className={styles.avatar}>
                            {member.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </div>
                            
                          <div className={styles.info}>
                            <p className={styles.name}>{member.name}</p>
                            <p className={styles.reg}>{member.reg}</p>
                          </div>
                            
                          {member.isLeader && (
                            <span className={styles.badge}>Leader</span>
                          )}
                        </>
                      ) : (
                        <div className={styles.emptySlot}>
                          <LuUserPlus className={styles.emptyIcon}/>
                          <p className={styles.emptyText}>Empty Slot</p>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* ================= SUPERVISOR ================= */}
          {supervisor && supervisor.status !== "none" && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <p className={styles.cardHeading}>Supervisor</p>
              </div>

              <div className={styles.listItem}>
                <div>
                  <p className={styles.name}>{supervisor.name}</p>

                  <p className={styles.reg}>
                    {hasSupervisorAssigned
                      ? `Accepted on ${supervisor.acceptedOn}`
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