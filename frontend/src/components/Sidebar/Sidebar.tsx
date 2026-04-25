import type { FunctionComponent } from "react";
import type { MenuItem } from "./types";
import styles from "./Sidebar.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import { LuLogOut, LuSettings, LuMenu, LuUser, LuGraduationCap } from "react-icons/lu";

type SidebarProps = {
  menuItems: MenuItem[];
   collapsed: boolean;
  setCollapsed: (val: boolean) => void;
};

const Sidebar: FunctionComponent<SidebarProps> = ({
  menuItems,
  collapsed,
  setCollapsed,
}) => {
  
  
const location = useLocation();
    const navigate = useNavigate();

    const handleClick = (item: MenuItem) => {
      navigate(item.path);
    };

  const handleLogout = () => {
    console.log("Logout");
    navigate("/Login");
  };
  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <div className={styles.header}>
        <button onClick={() => setCollapsed(!collapsed)}>
          <LuMenu size={18} />
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
  location.pathname === item.path ? styles.active : ""
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
  location.pathname === "/profile" ? styles.active : ""
}`}
         
        >
          <LuUser size={18} />
          <span>{!collapsed && "Profile"}</span>
        </div>

        <div
          title={collapsed ? "Settings" : ""}
          className={`${styles.menuItem} ${
  location.pathname === "/settings" ? styles.active : ""
}`}
         
        >
          <LuSettings size={18} />
          <span>{!collapsed && "Settings"}</span>
        </div>

        <div
          title={collapsed ? "Logout" : ""}
          className={styles.logout}
          onClick={() => console.log("Logout")}
        >
          <div className={styles.menuItem} onClick={handleLogout}>
            <LuLogOut size={18} />
            <span>{!collapsed && "Logout"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;