import InitSidebar from "../Sidebar/InitSidebar";
import { type FC, useState, useEffect, useCallback } from "react";
import styles from "./PendingRequest.module.css";
import Header from "../../../components/Header/Header";
import { LuCheck, LuX, LuInbox } from "react-icons/lu";

import {
  getIncomingRequests,
  acceptGroupRequest,
  rejectGroupRequest,
  type IncomingRequest,
} from "../../../services/studentService";

/* ── helpers ─────────────────────────────────────── */
const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

/* ── component ───────────────────────────────────── */
const PendingRequest: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [requests, setRequests] = useState<IncomingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // per-card loading state: requestId → "accepting" | "rejecting" | null
  const [acting, setActing] = useState<
    Record<string, "accepting" | "rejecting">
  >({});

  /* fetch */
  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getIncomingRequests();
      setRequests(data);
    } catch {
      setError("Failed to load requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  /* accept */
  const handleAccept = async (req: IncomingRequest) => {
    setActing((p) => ({ ...p, [req.id]: "accepting" }));
    try {
      await acceptGroupRequest(req.id);
      // remove from list optimistically
      setRequests((p) => p.filter((r) => r.id !== req.id));
    } catch (err: any) {
      alert(err?.response?.data?.message ?? "Failed to accept request.");
    } finally {
      setActing((p) => {
        const n = { ...p };
        delete n[req.id];
        return n;
      });
    }
  };

  /* reject */
  const handleReject = async (req: IncomingRequest) => {
    setActing((p) => ({ ...p, [req.id]: "rejecting" }));
    try {
      await rejectGroupRequest(req.id);
      setRequests((p) => p.filter((r) => r.id !== req.id));
    } catch (err: any) {
      alert(err?.response?.data?.message ?? "Failed to reject request.");
    } finally {
      setActing((p) => {
        const n = { ...p };
        delete n[req.id];
        return n;
      });
    }
  };

  /* ── render ── */
  return (
    <div className={styles.container}>
      <InitSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={styles.main}>
        <Header
          title="Pending Requests"
          subtitle="View and manage incoming group requests"
        />

        <div className={styles.content}>
          {loading && (
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>Loading requests…</p>
            </div>
          )}

          {!loading && error && (
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>{error}</p>
              <button className={styles.retryBtn} onClick={fetchRequests}>
                Retry
              </button>
            </div>
          )}

          {!loading && !error && requests.length === 0 && (
            <div className={styles.emptyState}>
              <LuInbox size={28} color="#D1D5DB" />
              <p className={styles.emptyText}>No pending requests</p>
              <p className={styles.emptySub}>
                When someone sends you a group request it will appear here.
              </p>
            </div>
          )}

          {!loading && !error && requests.length > 0 && (
            <div className={styles.grid}>
              {requests.map((r) => {
                const busy = acting[r.id];

                return (
                  <div key={r.id} className={styles.card}>
                    {/* TOP */}
                    <div className={styles.top}>
                      <div className={styles.avatar}>
                        {getInitials(r.sender.name)}
                      </div>

                      <div className={styles.meta}>
                        <p className={styles.name}>{r.sender.name}</p>
                        <p className={styles.email}>{r.sender.email}</p>
                      </div>

                      <span className={styles.time}>
                        {timeAgo(r.createdAt)}
                      </span>
                    </div>

                    {/* ACTIONS */}
                    <div className={styles.actions}>
                      <button
                        className={styles.accept}
                        onClick={() => handleAccept(r)}
                        disabled={!!busy}
                      >
                        {busy === "accepting" ? (
                          <span className={styles.spinner} />
                        ) : (
                          <LuCheck size={14} />
                        )}
                        Accept
                      </button>

                      <button
                        className={styles.reject}
                        onClick={() => handleReject(r)}
                        disabled={!!busy}
                      >
                        {busy === "rejecting" ? (
                          <span className={styles.spinner} />
                        ) : (
                          <LuX size={14} />
                        )}
                        Decline
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
  );
};

export default PendingRequest;
