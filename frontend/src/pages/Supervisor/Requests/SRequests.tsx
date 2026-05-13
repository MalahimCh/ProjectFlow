import SSidebar from "../Sidebar/Ssidebar";
import { type FC, useState, useEffect, useCallback } from "react";
import styles from "./SRequests.module.css";
import Header from "../../../components/Header/Header";
import { LuCalendar, LuCircleCheck, LuCircleX, LuInbox } from "react-icons/lu";

import {
  getSupervisorRequests,
  acceptSupervisorRequest,
  rejectSupervisorRequest,
} from "../../../services/supervisorService";

/* ── types ───────────────────────────────────── */
type SupervisorRequest = {
  id: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  message: string;
  fypName: string;
  fypDescription: string;
  group: {
    id: string;
    name: string;
    status: string;
    members: { id: string; name: string; email: string; role: string }[];
  };
  supervisor: {
    name: string;
    email: string;
  };
};

/* ── helpers ─────────────────────────────────── */
const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(iso));

/* ── component ───────────────────────────────── */
const SRequests: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [requests, setRequests] = useState<SupervisorRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [acting, setActing] = useState<
    Record<string, "accepting" | "rejecting">
  >({});

  /* ── fetch requests ── */
  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getSupervisorRequests();

      const pendingRequests = (data ?? []).filter(
        (r: SupervisorRequest) => r.status === "pending",
      );

      setRequests(pendingRequests);
    } catch (err) {
      console.error(err);
      setError("Failed to load requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  /* ── accept ── */
  const handleAccept = async (req: SupervisorRequest) => {
    setActing((prev) => ({ ...prev, [req.id]: "accepting" }));

    try {
      await acceptSupervisorRequest(req.id);
      setRequests((prev) => prev.filter((r) => r.id !== req.id));
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message ?? "Failed to approve request.");
    } finally {
      setActing((prev) => {
        const next = { ...prev };
        delete next[req.id];
        return next;
      });
    }
  };

  /* ── reject ── */
  const handleReject = async (req: SupervisorRequest) => {
    setActing((prev) => ({ ...prev, [req.id]: "rejecting" }));

    try {
      await rejectSupervisorRequest(req.id);
      setRequests((prev) => prev.filter((r) => r.id !== req.id));
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message ?? "Failed to reject request.");
    } finally {
      setActing((prev) => {
        const next = { ...prev };
        delete next[req.id];
        return next;
      });
    }
  };

  /* ── render ── */
  return (
    <div className={styles.container}>
      <SSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={styles.main}>
        <Header
          title="Requests"
          subtitle="View and manage incoming supervisor requests"
        />

        <div className={styles.content}>
          <div className={styles.page}>
            {/* Loading */}
            {loading && (
              <div className={styles.emptyState}>
                <p className={styles.emptyText}>Loading requests…</p>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className={styles.emptyState}>
                <p className={styles.emptyText}>{error}</p>
                <button className={styles.retryBtn} onClick={fetchRequests}>
                  Retry
                </button>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && requests.length === 0 && (
              <div className={styles.emptyState}>
                <LuInbox size={28} color="#D1D5DB" />
                <p className={styles.emptyText}>No pending requests</p>
              </div>
            )}

            {/* Requests */}
            {!loading && !error && requests.length > 0 && (
              <div className={styles.requestList}>
                {requests.map((r) => {
                  const busy = acting[r.id];

                  return (
                    <div key={r.id} className={styles.requestCard}>
                      <div className={styles.cardTop}>
                        <div>
                          <p className={styles.groupName}>{r.group.name}</p>
                          <p className={styles.meta}>
                            <LuCalendar size={12} />
                            {formatDate(r.createdAt)}
                          </p>
                        </div>

                        <span className={styles.badge}>Pending</span>
                      </div>

                      <div className={styles.body}>
                        {r.fypName && (
                          <div className={styles.fypInfo}>
                            <p className={styles.fypName}>{r.fypName}</p>
                            {r.fypDescription && (
                              <p className={styles.fypDesc}>
                                {r.fypDescription}
                              </p>
                            )}
                          </div>
                        )}

                        {r.message && (
                          <p className={styles.message}>{r.message}</p>
                        )}

                        {r.group.members.length > 0 && (
                          <div className={styles.members}>
                            {r.group.members.map((m) => (
                              <span key={m.id} className={styles.member}>
                                {m.name}
                                {m.role === "leader" && <b> • Leader</b>}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className={styles.actions}>
                        <button
                          className={styles.approve}
                          onClick={() => handleAccept(r)}
                          disabled={!!acting[r.id]}
                        >
                          Approve
                        </button>

                        <button
                          className={styles.reject}
                          onClick={() => handleReject(r)}
                          disabled={!!acting[r.id]}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SRequests;
