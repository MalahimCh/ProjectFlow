import Sidebar from "../../../components/Sidebar/Sidebar";
import {type FC} from "react";
import { FaProjectDiagram } from "react-icons/fa";
import { MdMeetingRoom } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { MdAssignment } from "react-icons/md";

const studentMenu = [
  { label: "Projects", icon: FaProjectDiagram },
  { label: "Meetings", icon: MdMeetingRoom },
  { label: "Assign Supervisor", icon: MdAssignment },
  { label: "Groups", icon: FaUsers },
];

const SDashboard:FC = () => {
    return (
            <Sidebar menuItems={studentMenu}/>
    );
}
export default SDashboard;

