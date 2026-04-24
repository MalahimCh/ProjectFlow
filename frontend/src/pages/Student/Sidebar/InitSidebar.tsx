import { LuCalendarCheck } from "react-icons/lu";
import Sidebar from "../../../components/Sidebar/Sidebar";
import { LuLayoutDashboard } from "react-icons/lu";
import type { FunctionComponent } from "react";
import { LuUsers } from "react-icons/lu";
import { LuGitPullRequestArrow } from "react-icons/lu";
import { LuFileSearch } from "react-icons/lu";

const initMenu = [
  {
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/student/initialdashboard",
  },
  { label: "Find Team", icon: LuUsers, path: "/student/findteam" },
  {
    label: "Supervisors",
    icon: LuCalendarCheck,
    path: "/student/findsupervisor",
  },
  {
    label: " Pending Requests",
    icon: LuGitPullRequestArrow,
    path: "/student/requests",
  },
  { label: "FYP Repository", icon: LuFileSearch, path: "/repository" },
];

type InitSidebarProps = {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
};

const InitSidebar: FunctionComponent<InitSidebarProps> = ({
  collapsed,
  setCollapsed,
}) => {
  return (
    <Sidebar
      menuItems={initMenu}
      collapsed={collapsed}
      setCollapsed={setCollapsed}
    />
  );
};

export default InitSidebar;
