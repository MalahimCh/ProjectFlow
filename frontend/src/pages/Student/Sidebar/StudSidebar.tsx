import {
  LuCalendarCheck,
  LuLayoutDashboard,
  LuUsers,
  LuFileSearch,
} from "react-icons/lu";
import type { FunctionComponent } from "react";
import { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar/Sidebar";
import { getStudentProjectId } from "../../../services/studentService";

type StudSidebarProps = {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
};

const StudSidebar: FunctionComponent<StudSidebarProps> = ({
  collapsed,
  setCollapsed,
}) => {
  const [projectId, setProjectId] = useState<string | null>(null);

  useEffect(() => {
    const fetchId = async () => {
      try {
        const id = await getStudentProjectId();

        // IMPORTANT: ensure it's not a Promise
        setProjectId(typeof id === "string" ? id : id ? String(id) : null);
      } catch (err) {
        console.error("Failed to get projectId", err);
      }
    };

    fetchId();
  }, []);

  const studMenu = [
    {
      label: "Dashboard",
      icon: LuLayoutDashboard,
      path: "/student/dashboard",
    },
    {
      label: "Project",
      icon: LuUsers,
      path: projectId ? `/student/projects/${projectId}` : "/student/dashboard",
    },
    {
      label: "Meetings",
      icon: LuCalendarCheck,
      path: "/student/meetings",
    },
    {
      label: "FYP Repository",
      icon: LuFileSearch,
      path: "/repository",
    },
  ];

  return (
    <Sidebar
      menuItems={studMenu}
      collapsed={collapsed}
      setCollapsed={setCollapsed}
    />
  );
};

export default StudSidebar;
