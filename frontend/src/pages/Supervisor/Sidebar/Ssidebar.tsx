import { LuCalendarCheck } from "react-icons/lu";
import Sidebar from "../../../components/Sidebar/Sidebar";
import { LuLayoutDashboard } from "react-icons/lu";
import type { FunctionComponent } from "react";
import { LuUsers } from "react-icons/lu";
import { LuGitPullRequestArrow } from "react-icons/lu";
import { LuFileSearch } from "react-icons/lu";

const supervisorMenu = [
  { label: "Dashboard", icon: LuLayoutDashboard, path: "/supervisor/dashboard" },
  { label: "Projects", icon: LuUsers, path: "/supervisor/projects" },
  { label: "Meetings", icon: LuCalendarCheck, path: "/supervisor/meetings" },
  { label: "Requests", icon: LuGitPullRequestArrow, path: "/supervisor/requests" },
  { label: "FYP Repository", icon: LuFileSearch, path: "/repository" }
];

type SSidebarProps = {
   collapsed: boolean;
  setCollapsed: (val: boolean) => void;
};

const SSidebar: FunctionComponent<SSidebarProps> = ({
  collapsed,
  setCollapsed,
}) => {
  return (
  <Sidebar 
      menuItems={supervisorMenu}
      collapsed={collapsed}
      setCollapsed={setCollapsed}
    />
  );
}

export default SSidebar;
