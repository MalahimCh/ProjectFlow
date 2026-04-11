import type { FunctionComponent } from "react";
import type { MenuItem } from "./types";
import { MdOutlineLogout } from "react-icons/md";
import { FiUser, FiSettings } from "react-icons/fi";
import styles from "./Sidebar.module.css";
import { LuGraduationCap } from "react-icons/lu";
import { useState } from "react";

type SidebarProps = {
  menuItems: MenuItem[];
};



const Sidebar: FunctionComponent<SidebarProps> = ({ menuItems }) => {
	const [active, setActive] = useState("Dashboard"); // default
 const handleClick = (item: MenuItem) => {
  setActive(item.label);

  if (item.onClick) item.onClick();
};

  return (
    <div className={styles.sidebar}>
      
      {/* Logo */}
	<div className={styles.header}>
	  <div className={styles.logoBox}>
		<LuGraduationCap size={20} color="#fff" />
	  </div>
	  ProjectFlow
	</div>

      {/* Dynamic Menu */}
      <div className={styles.menu}>
        {menuItems.map((item, index) => {
          const Icon = item.icon;

          return (
           <div
			key={index}
			className={`${styles.menuItem} ${
				active === item.label ? styles.active : ""
			}`}
			onClick={() => handleClick(item)}
			>
			<Icon size={18} />
			<span>{item.label}</span>
			</div>
          );
        })}
      </div>

      {/* Fixed Bottom */}
      <div className={styles.bottom}>
        
        <div
		className={`${styles.menuItem} ${
			active === "Profile" ? styles.active : ""
		}`}
		onClick={() => {
			setActive("Profile");
		}}
		>
		<FiUser size={18} />
		<span>Profile</span>
		</div>

        <div className={`${styles.menuItem} ${
				active === "Settings" ? styles.active : ""
			}`}
			onClick={() => {
				setActive("Settings");
			}}
			>
          <FiSettings size={18} />
          <span>Settings</span>
        </div>
		</div>

        <div
          className={styles.logout}
          onClick={() => console.log("Logout")}
        >
          <div className={styles.menuItem}>
          <MdOutlineLogout size={18} />
          <span>Logout</span>
        </div>
        </div>

      

    </div>
  );
};

export default Sidebar;