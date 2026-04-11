// import { MdOutlineDashboard } from "react-icons/md";
// import { FaProjectDiagram } from "react-icons/fa";
// import { MdPersonAdd, MdWork, MdOutlineCalendarToday, MdRateReview, MdPresentToAll, MdPerson, MdArchive, MdSettings } from "react-icons/md";

// const menuItems = [
//   { label: "Dashboard", icon: MdOutlineDashboard  },
//   { label: "Projects", icon: FaProjectDiagram },
//   { label: "Assign Supervisor", icon: MdPersonAdd },
//   { label: "Supervisor Workload", icon: MdWork },
//   { label: "Manage Deadlines", icon: MdOutlineCalendarToday },
//   { label: "Evaluations", icon: MdRateReview },
//   { label: "Presentations", icon: MdPresentToAll },
//   { label: "Profile", icon: MdPerson },
// ];

// const bottomItems = [
//   { label: "Archive", icon: MdArchive },
//   { label: "Settings", icon: MdSettings },
// ];

// export { menuItems, bottomItems };

import type { IconType } from "react-icons";

export type MenuItem = {
  label: string;
  icon: IconType;
  onClick?: () => void; // optional (for routing later)
};