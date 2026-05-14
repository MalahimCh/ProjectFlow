import { type FunctionComponent, useEffect, useState } from "react";
import { IoMdNotifications } from "react-icons/io";
import styles from "./Header.module.css";
import { getRollNumber } from "../../services/authService";

type HeaderProps = {
  title: string;
  subtitle: string;
};

type User = {
  name?: string;
  role?: string;
  studentId?: string;
  registrationNumber?: string;
  employeeId?: string;
  id?: string;
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const Header: FunctionComponent<HeaderProps> = ({ title, subtitle }) => {
  const storedUser = localStorage.getItem("user");

  let user: User = {};

  try {
    user = storedUser ? JSON.parse(storedUser) : {};
  } catch {
    user = {};
  }

  const userName = user.name || "User";
  const userId = user.id || "N/A";
  const userRole = user.role;

  // Default display is the user ID
  const [displayId, setDisplayId] = useState(userId);

  useEffect(() => {
    // Only fetch roll number for students
    if (userRole === "student") {
      getRollNumber()
        .then((rollNo) => {
          setDisplayId(rollNo || userId);
        })
        .catch(() => {
          setDisplayId(userId);
        });
    } else {
      setDisplayId(userId);
    }
  }, [userRole, userId]);

  const initials = getInitials(userName);

  return (
    <header className={styles.header}>
      {/* LEFT SIDE */}
      <div className={styles.left}>
        <div className={styles.title}>{title}</div>
        <div className={styles.subtitle}>{subtitle}</div>
      </div>

      {/* RIGHT SIDE */}
      <div className={styles.right}>
        {/* Notification */}
        <button className={styles.notification}>
          <span className={styles.icon}>
            <IoMdNotifications />
          </span>
          {/* <span className={styles.badge}>3</span> */}
        </button>

        {/* User Info */}
        <div className={styles.user}>
          <div className={styles.avatar}>{initials}</div>

          <div className={styles.userText}>
            <span className={styles.name}>{userName}</span>
            <span className={styles.id}>ID: {displayId}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
