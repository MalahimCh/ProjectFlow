import type { FunctionComponent } from "react";
import type { MenuItem } from "./types";
import { MdOutlineLogout } from "react-icons/md";
import { FiUser, FiSettings } from "react-icons/fi";
import styles from "./Sidebar.module.css";
import { LuGraduationCap } from "react-icons/lu";
import { useState } from "react";
import { FiMenu } from "react-icons/fi";

type SidebarProps = {
  menuItems: MenuItem[];
};

const Sidebar: FunctionComponent<SidebarProps> = ({ menuItems }) => {
  const [active, setActive] = useState("Dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const handleClick = (item: MenuItem) => {
    setActive(item.label);
    if (item.onClick) item.onClick();
  };

  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <div className={styles.header}>
        <button onClick={() => setCollapsed(!collapsed)}>
          <FiMenu size={18} />
        </button>
        {!collapsed && (
          <div className={styles.logoBox}>
            <LuGraduationCap size={20} color="#fff" />
          </div>
        )}
        {!collapsed && "ProjectFlow"}
      </div>

      <div className={styles.menu}>
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              title={collapsed ? item.label : ""}
              className={`${styles.menuItem} ${
                active === item.label ? styles.active : ""
              }`}
              onClick={() => handleClick(item)}
            >
              <Icon size={18} />
              <span>{!collapsed && item.label}</span>
            </div>
          );
        })}
      </div>

      <div className={styles.bottom}>
        <div
          title={collapsed ? "Profile" : ""}
          className={`${styles.menuItem} ${
            active === "Profile" ? styles.active : ""
          }`}
          onClick={() => setActive("Profile")}
        >
          <FiUser size={18} />
          <span>{!collapsed && "Profile"}</span>
        </div>

        <div
          title={collapsed ? "Settings" : ""}
          className={`${styles.menuItem} ${
            active === "Settings" ? styles.active : ""
          }`}
          onClick={() => setActive("Settings")}
        >
          <FiSettings size={18} />
          <span>{!collapsed && "Settings"}</span>
        </div>

        <div
          title={collapsed ? "Logout" : ""}
          className={styles.logout}
          onClick={() => console.log("Logout")}
        >
          <div className={styles.menuItem}>
            <MdOutlineLogout size={18} />
            <span>{!collapsed && "Logout"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
