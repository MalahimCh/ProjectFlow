import InitSidebar from "../Sidebar/InitSidebar";
import { type FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./InitDashboard.module.css";
import Header from "../../../components/Header/Header";
import StatsCard from "../../../components/StatsCard/StatsCard";
import { getInitDashboard } from "../../../services/studentService";
import {
  LuUsers,
  LuCircleAlert,
  LuMessageSquareText,
  LuCalendar,
  LuCheck,
  LuUserPlus,
} from "react-icons/lu";

import { useEffect } from "react";

/* ================= COMPONENT ================= */

const InitDashboard: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getInitDashboard();
        setDashboardData(data);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading || !dashboardData) {
    return <div>Loading dashboard...</div>;
  }
  console.log("Dashboard Data:", dashboardData);

  /* ================= EXTRACT DATA ================= */

  const { stats, group, supervisor } = dashboardData;

  const members = group.members;
  const maxMembers = group.maxMembers;

  /* ================= DERIVED STATE ================= */

  const groupCount = members.length;
  const remainingMembers = maxMembers - groupCount;
  const isGroupComplete = groupCount === maxMembers;

  const hasSupervisorAssigned = supervisor?.status === "accepted";
  const hasSupervisorRequested = supervisor?.status === "pending";
  const noSupervisor = !supervisor || supervisor?.status === "none";

  const supervisorStatus = noSupervisor
    ? "None"
    : hasSupervisorRequested
      ? "Pending"
      : "Accepted";

  /* ================= ACTION HANDLERS ================= */

  const handleFindTeamMembers = () => {
    navigate("/student/findteam");
  };

  const handleRequestSupervisor = () => {
    navigate("/student/findsupervisor");
  };

  const handleSubmitGroup = () => {
    navigate("/student/dashboard");
  };

  /* ================= BANNER CONTENT ================= */

  const bannerConfig = !isGroupComplete
    ? {
        title: "Complete Your Group",
        subtitle: `You need ${remainingMembers} more member${
          remainingMembers > 1 ? "s" : ""
        } to complete your group.`,
        buttonText: "Find Team Members",
        buttonClass: styles.action,
        buttonDisabled: false,
        onClick: handleFindTeamMembers,
        icon: <LuCircleAlert />,
        iconClass: styles.primaryIcon,
        containerClass: "",
      }
    : noSupervisor
      ? {
          title: "Request Supervisor",
          subtitle: "Request a supervisor to submit your group.",
          buttonText: "Request Supervisor",
          buttonClass: styles.action,
          buttonDisabled: false,
          onClick: handleRequestSupervisor,
          icon: <LuCheck />,
          iconClass: styles.primaryIcon,
          containerClass: "",
        }
      : hasSupervisorRequested
        ? {
            title: "Supervisor Requested",
            subtitle: "Your request is pending approval.",
            buttonText: "Awaiting Approval",
            buttonClass: styles.pendingBtn,
            buttonDisabled: true,
            onClick: undefined,
            icon: <LuCheck />,
            iconClass: styles.pendingIcon,
            containerClass: styles.pendingBox,
          }
        : {
            title: "Group Ready for Submission",
            subtitle:
              "Your group is complete and supervisor has accepted. Submit your group for coordinator approval.",
            buttonText: "Submit Group",
            buttonClass: styles.successBtn,
            buttonDisabled: false,
            onClick: handleSubmitGroup,
            icon: <LuCheck />,
            iconClass: styles.successIcon,
            containerClass: styles.successBox,
          };

  return (
    <div className={styles.container}>
      <InitSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={styles.main}>
        {/* ================= HEADER ================= */}
        <Header
          title="Dashboard"
          subtitle="A quick overview of your project progress."
        />

        <div className={styles.content}>
          {/* ================= STATS ================= */}
          <div className={styles.statsGrid}>
            <StatsCard
              value={`${groupCount} / ${maxMembers}`}
              label="Group Members"
              icon={<LuUsers />}
              bgColor="#EFF6FF"
              iconColor="#0D3CCF"
            />

            <StatsCard
              value={stats.pendingRequests}
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

          {/* ================= STATUS BANNER ================= */}
          <div
            className={`${styles.completeGroup} ${bannerConfig.containerClass}`}
          >
            <div className={styles.row}>
              <div className={styles.left}>
                <span className={`${styles.icon} ${bannerConfig.iconClass}`}>
                  {bannerConfig.icon}
                </span>

                <div>
                  <p className={styles.title}>{bannerConfig.title}</p>
                  <p className={styles.subtitle}>{bannerConfig.subtitle}</p>
                </div>
              </div>

              <button
                className={bannerConfig.buttonClass}
                disabled={bannerConfig.buttonDisabled}
                onClick={bannerConfig.onClick}
              >
                {bannerConfig.buttonText}
              </button>
            </div>
          </div>

          {/* ================= GROUP CARD ================= */}
          {groupCount > 0 && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <p className={styles.cardHeading}>My Group</p>
              </div>

              <div className={styles.memberList}>
                {[...members, ...Array(maxMembers - groupCount).fill(null)].map(
                  (member, index) => (
                    <div
                      key={member ? member.id : `empty-${index}`}
                      className={
                        member
                          ? styles.listItem
                          : `${styles.listItem} ${styles.emptyWrapper}`
                      }
                    >
                      {member ? (
                        <>
                          <div className={styles.avatar}>
                            {member.name
                              .split(" ")
                              .map((part: string) => part[0])
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
                          <LuUserPlus className={styles.emptyIcon} />
                          <p className={styles.emptyText}>Empty Slot</p>
                        </div>
                      )}
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

          {/* ================= SUPERVISOR CARD ================= */}
          {!noSupervisor && (
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
