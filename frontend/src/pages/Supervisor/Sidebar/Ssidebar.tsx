import Sidebar from "../../../components/Sidebar/Sidebar";
import type { FunctionComponent } from "react";
import { LuCalendarCheck, LuLayoutDashboard, LuUsers, LuGitPullRequestArrow, LuFileSearch } from "react-icons/lu";

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
