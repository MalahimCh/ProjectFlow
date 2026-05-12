import SSidebar from "../Sidebar/Ssidebar";
import { type FC, type JSX, useState, useEffect } from "react";
import styles from "./SRequests.module.css";
import Header from "../../../components/Header/Header";
import StatsCard from "../../../components/StatsCard/StatsCard";
import {
  LuUsers,
  LuCalendar,
  LuUserCheck,
  LuMessageSquareText,
  LuCircleX,
  LuCircleCheck,
} from "react-icons/lu";
import {
  getSupervisorRequests,
  acceptSupervisorRequest,
  rejectSupervisorRequest,
} from "../../../services/supervisorService";

/* ── types ── */
type SupervisorRequest = {
  id: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  group: {
    id: string;
    name: string;
    status: string;
  };
  supervisor: {
    name: string;
    email: string;
  };
};

/* ── helpers ── */
const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(iso));

/* ── component ── */
const SRequests: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [requests, setRequests] = useState<SupervisorRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<
    Record<string, "accepting" | "rejecting">
  >({});

  useEffect(() => {
    const fetch_ = async () => {
      try {
        setLoading(true);
        const data = await getSupervisorRequests();
        setRequests(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, []);

  const handleAccept = async (id: string) => {
    setActing((p) => ({ ...p, [id]: "accepting" }));
    try {
      await acceptSupervisorRequest(id);
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "accepted" } : r)),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setActing((p) => {
        const n = { ...p };
        delete n[id];
        return n;
      });
    }
  };

  const handleReject = async (id: string) => {
    setActing((p) => ({ ...p, [id]: "rejecting" }));
    try {
      await rejectSupervisorRequest(id);
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r)),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setActing((p) => {
        const n = { ...p };
        delete n[id];
        return n;
      });
    }
  };

  const pending = requests.filter((r) => r.status === "pending").length;
  const accepted = requests.filter((r) => r.status === "accepted").length;
  const rejected = requests.filter((r) => r.status === "rejected").length;

  /* ── card renderers ── */
  const renderPendingCard = (r: SupervisorRequest) => {
    const busy = acting[r.id];
    return (
      <div key={r.id} className={styles.requestCard}>
        <div className={styles.cardTop}>
          <div>
            <p className={styles.groupName}>{r.group.name}</p>
            <p className={styles.meta}>
              <LuCalendar size={12} /> Submitted: {formatDate(r.createdAt)}
            </p>
          </div>
          <span className={styles.badgePending}>Pending</span>
        </div>

        <div className={styles.actionsRow}>
          <button
            className={styles.approve}
            onClick={() => handleAccept(r.id)}
            disabled={!!busy}
          >
            {busy === "accepting" ? (
              <span className={styles.spinner} />
            ) : (
              <LuCircleCheck size={14} />
            )}
            Approve
          </button>
          <button
            className={styles.reject}
            onClick={() => handleReject(r.id)}
            disabled={!!busy}
          >
            {busy === "rejecting" ? (
              <span className={styles.spinner} />
            ) : (
              <LuCircleX size={14} />
            )}
            Reject
          </button>
        </div>
      </div>
    );
  };

  const renderActionedCard = (r: SupervisorRequest) => (
    <div key={r.id} className={styles.requestCard}>
      <div className={styles.cardTop}>
        <div>
          <p className={styles.groupName}>{r.group.name}</p>
          <p className={styles.meta}>
            <LuCalendar size={12} />
            {r.status === "accepted" ? " Approved: " : " Rejected: "}
            {formatDate(r.createdAt)}
          </p>
        </div>
        <span
          className={
            r.status === "accepted"
              ? styles.badgeAccepted
              : styles.badgeRejected
          }
        >
          {r.status === "accepted" ? "Approved" : "Rejected"}
        </span>
      </div>
    </div>
  );

  /* ── section renderer ── */
  const Section = ({
    title,
    subtitle,
    items,
    renderer,
  }: {
    title: string;
    subtitle?: string;
    items: SupervisorRequest[];
    renderer: (r: SupervisorRequest) => JSX.Element;
  }) =>
    items.length === 0 ? (
      <div className={styles.request}>
        <div className={styles.requestHeader}>
          <p className={styles.requestTitle}>{title}</p>
        </div>

        <p className={styles.emptyText}>No requests for now</p>
      </div>
    ) : (
      <div className={styles.request}>
        <div className={styles.requestHeader}>
          <p className={styles.requestTitle}>{title}</p>
          {subtitle && <p className={styles.requestCountText}>{subtitle}</p>}
        </div>

        <div className={styles.requestList}>{items.map(renderer)}</div>
      </div>
    );

  return (
    <div className={styles.container}>
      <SSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={styles.main}>
        <Header title="Requests" subtitle="View and manage your requests" />

        <div className={styles.content}>
          {/* stats */}
          <div className={styles.statsGrid}>
            <StatsCard
              value={pending}
              label="Pending"
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
              label="Total"
              icon={<LuUserCheck />}
              bgColor="#FFF7ED"
              iconColor="#F59E0B"
            />
          </div>

          {loading && <p className={styles.loadingText}>Loading requests…</p>}

          {!loading && (
            <>
              <Section
                title="Pending Requests"
                subtitle={`${pending} awaiting`}
                items={requests.filter((r) => r.status === "pending")}
                renderer={renderPendingCard}
              />
              <Section
                title="Approved Requests"
                items={requests.filter((r) => r.status === "accepted")}
                renderer={renderActionedCard}
              />
              <Section
                title="Rejected Requests"
                items={requests.filter((r) => r.status === "rejected")}
                renderer={renderActionedCard}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SRequests;
