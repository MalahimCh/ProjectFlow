import InitSidebar from "../Sidebar/InitSidebar";
import { type FC, useState } from "react";
import styles from "./PendingRequest.module.css";
import Header from "../../../components/Header/Header";

/* ================= MOCK DATA ================= */

const requests = [
  {
    id: "1",
    name: "Ali Khan",
    rollNo: "23L-0512",
    message: "I would like to join your FYP group.",
  },
  {
    id: "2",
    name: "Sara Ahmed",
    rollNo: "23L-0745",
    message: "Rakh lo re baba 🙏🏻",
  },
  {
    id: "3",
    name: "Chaudhary Abdul Rehman",
    rollNo: "23L-2310",
    message: "I am retarded",
  },
  {
    id: "4",
    name: "Hira Malik",
    rollNo: "23L-0678",
    message: "Help pleaseee",
  },
  {
    id: "5",
    name: "Bilal Ahmed",
    rollNo: "23L-2533",
    message: "I want to die",
  },
];

/* ================= COMPONENT ================= */

const PendingRequest: FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={styles.container}>
      <InitSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={styles.main}>
        <Header
          title="Pending Requests"
          subtitle="View and manage your pending requests"
          userName="Malahim Chaudhary"
          userId="CO2024001"
        />

        <div className={styles.content}>
          <div className={styles.grid}>
            {requests.map((r) => (
              <div key={r.id} className={styles.card}>

                {/* TOP */}
                <div className={styles.top}>
                  <div className={styles.avatar}>
                    {r.name
                      .split(" ")
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>

                  <div>
                    <p className={styles.name}>{r.name}</p>
                    <p className={styles.reg}>{r.rollNo}</p>
                  </div>
                </div>

                {/* MESSAGE */}
                <p className={styles.message}>{r.message}</p>

                {/* BUTTONS */}
                <div className={styles.actions}>
                  <button className={styles.accept}>Accept</button>
                  <button className={styles.reject}>Reject</button>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingRequest;