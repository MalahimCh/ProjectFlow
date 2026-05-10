import Sidebar from "../../../components/Sidebar/Sidebar";
import { LuLayoutDashboard } from "react-icons/lu";
import type { FunctionComponent } from "react";
import {
  LuUsers,
  LuFolderClock,
  LuClipboardCheck,
  LuLayoutList,
  LuFileUser,
} from "react-icons/lu";

const coordMenu = [
  {
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/coordinator/dashboard",
  },
  { label: "Projects", icon: LuUsers, path: "/coordinator/projects" },
  { label: "Deadlines", icon: LuFolderClock, path: "/coordinator/deadlines" },
  {
    label: "Rubric",
    icon: LuLayoutList,
    path: "/coordinator/rubrics",
  },
  {
    label: "Evaluations",
    icon: LuClipboardCheck,
    path: "/coordinator/evaluations",
  },
  {
    label: "Supervisor Workload",
    icon: LuFileUser,
    path: "/coordinator/workload",
  },
];

type CoordSidebarProps = {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
};

const CoordSidebar: FunctionComponent<CoordSidebarProps> = ({
  collapsed,
  setCollapsed,
}) => {
  return (
    <Sidebar
      menuItems={coordMenu}
      collapsed={collapsed}
      setCollapsed={setCollapsed}
    />
  );
};

export default CoordSidebar;
