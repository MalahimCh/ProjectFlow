import { LuCalendarCheck } from "react-icons/lu";
import Sidebar from "../../../components/Sidebar/Sidebar";
import { LuLayoutDashboard } from "react-icons/lu";
import type { FunctionComponent } from "react";
import { LuUsers } from "react-icons/lu";
import { LuGitPullRequestArrow } from "react-icons/lu";
import { LuFileSearch } from "react-icons/lu";

const supervisorMenu = [
  { label: "Dashboard", icon: LuLayoutDashboard },
  { label: "Groups", icon: LuUsers },
  { label: "Meetings", icon: LuCalendarCheck },
  { label: "Requests", icon: LuGitPullRequestArrow },
  { label: "FYP Repository", icon: LuFileSearch }
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
