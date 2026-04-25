import { LuCalendarCheck } from "react-icons/lu";
import Sidebar from "../../../components/Sidebar/Sidebar";
import { LuLayoutDashboard } from "react-icons/lu";
import type { FunctionComponent } from "react";
import { LuUsers } from "react-icons/lu";
import { LuFileSearch } from "react-icons/lu";

const studMenu = [
  {
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/student/dashboard",
  },
  { label: "Project", icon: LuUsers, path: "/student/project" },
  { label: "Meetings", icon: LuCalendarCheck, path: "/student/meetings" },
  { label: "FYP Repository", icon: LuFileSearch, path: "/repository" },
];

type StudSidebarProps = {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
};

const StudSidebar: FunctionComponent<StudSidebarProps> = ({
  collapsed,
  setCollapsed,
}) => {
  return (
    <Sidebar
      menuItems={studMenu}
      collapsed={collapsed}
      setCollapsed={setCollapsed}
    />
  );
};

export default StudSidebar;
