// Settings.tsx
import { type FC, useState } from "react";
import CoordSidebar from "../Coordinator/Sidebar/CoordSidebar";
import SSidebar from "../Supervisor/Sidebar/Ssidebar";
import StudSidebar from "../Student/Sidebar/StudSidebar";
import Header from "../../components/Header/Header";
import {
  LuBell,
  LuLock,
  LuMail,
  LuMoon,
  LuPencil,
  LuShield,
  LuUser,
} from "react-icons/lu";
import styles from "./Settings.module.css";

type UserRole = "coordinator" | "supervisor" | "student";

const Settings: FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  // Change this to test different sidebars
  const role: UserRole = "coordinator";

  // Hardcoded settings data
  const settings = {
    emailNotifications: true,
    smsNotifications: false,
    weeklyReports: true,
    twoFactorAuth: true,
    profileVisibility: "University Only",
    theme: "Light",
    language: "English",
    loginEmail: "junaid.hussain@nu.edu.pk",
  };

  const renderSidebar = () => {
    switch (role) {
      case "student":
        return (
          <StudSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        );
      case "supervisor":
        return <SSidebar collapsed={collapsed} setCollapsed={setCollapsed} />;
      case "coordinator":
      default:
        return (
          <CoordSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        );
    }
  };

  const renderValue = (value: boolean | string) =>
    typeof value === "boolean" ? (value ? "Enabled" : "Disabled") : value;

  return (
    <div className={styles.container}>
      {renderSidebar()}

      <div className={styles.main}>
        <Header
          title="Settings"
          subtitle="Manage your account preferences and security"
          userName="Junaid Hussain"
          userId="CO2024001"
        />

        <div className={styles.content}>
          {/* Account Settings */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>Account Settings</h3>
              <button className={styles.iconButton}>
                <LuPencil />
              </button>
            </div>

            <div className={styles.settingsList}>
              <div className={styles.settingItem}>
                <LuUser />
                <div>
                  <span>Login Email</span>
                  <p>{settings.loginEmail}</p>
                </div>
              </div>

              <div className={styles.settingItem}>
                <LuMoon />
                <div>
                  <span>Theme</span>
                  <p>{settings.theme}</p>
                </div>
              </div>

              <div className={styles.settingItem}>
                <LuMail />
                <div>
                  <span>Language</span>
                  <p>{settings.language}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>Notifications</h3>
              <button className={styles.iconButton}>
                <LuPencil />
              </button>
            </div>

            <div className={styles.settingsList}>
              <div className={styles.settingItem}>
                <LuBell />
                <div>
                  <span>Email Notifications</span>
                  <p>{renderValue(settings.emailNotifications)}</p>
                </div>
              </div>

              <div className={styles.settingItem}>
                <LuBell />
                <div>
                  <span>SMS Notifications</span>
                  <p>{renderValue(settings.smsNotifications)}</p>
                </div>
              </div>

              <div className={styles.settingItem}>
                <LuBell />
                <div>
                  <span>Weekly Reports</span>
                  <p>{renderValue(settings.weeklyReports)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>Security & Privacy</h3>
              <button className={styles.iconButton}>
                <LuPencil />
              </button>
            </div>

            <div className={styles.settingsList}>
              <div className={styles.settingItem}>
                <LuLock />
                <div>
                  <span>Two-Factor Authentication</span>
                  <p>{renderValue(settings.twoFactorAuth)}</p>
                </div>
              </div>

              <div className={styles.settingItem}>
                <LuShield />
                <div>
                  <span>Profile Visibility</span>
                  <p>{settings.profileVisibility}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
