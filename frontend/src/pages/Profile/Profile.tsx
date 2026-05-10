// Profile.tsx
import { type FC, useState } from "react";
import CoordSidebar from "../Coordinator/Sidebar/CoordSidebar";
import SSidebar from "../Supervisor/Sidebar/Ssidebar";
import StudSidebar from "../Student/Sidebar/StudSidebar";
import Header from "../../components/Header/Header";
import {
  LuMail,
  LuPhone,
  LuBuilding2,
  LuIdCard,
  LuUser,
  LuBriefcase,
  LuPencil,
} from "react-icons/lu";
import styles from "./Profile.module.css";

type UserRole = "coordinator" | "supervisor" | "student";

const Profile: FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  // Change this value to test different sidebars
  const role: UserRole = "supervisor";

  // Hardcoded user data
  const profileData = {
    fullName: "Junaid Hussain",
    role: "FYP Coordinator",
    department: "Computer Science",
    email: "junaid.hussain@nu.edu.pk",
    phone: "+92 300 1234567",
    rollNumber: "CO2024001",
    bio: "Responsible for overseeing Final Year Projects, assigning supervisors, and ensuring smooth project coordination across departments.",
    specialization:
      "Software Engineering, Project Management, Educational Systems",
    office: "Block A, Room 204",
    joined: "August 2021",
  };

  const renderSidebar = () => {
    switch (role) {
      case "student":
        return (
          <StudSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        );
      case "supervisor":
        return <SSidebar collapsed={collapsed} setCollapsed={setCollapsed} />;
      case "coordinator":
      default:
        return (
          <CoordSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        );
    }
  };

  return (
    <div className={styles.container}>
      {renderSidebar()}

      <div className={styles.main}>
        <Header
          title="Profile"
          subtitle="View and manage your personal information"
          userName={profileData.fullName}
          userId={profileData.rollNumber}
        />

        <div className={styles.content}>
          {/* Top Profile Card */}
          <div className={styles.profileCard}>
            <div className={styles.avatar}>
              {profileData.fullName
                .split(" ")
                .map((name) => name[0])
                .join("")
                .slice(0, 2)}
            </div>

            <div className={styles.profileInfo}>
              <h2>{profileData.fullName}</h2>
              <p>{profileData.role}</p>
              <span>{profileData.department}</span>
            </div>

            <button className={styles.editButton}>
              <LuPencil />
              Edit Profile
            </button>
          </div>

          {/* Information Grid */}
          <div className={styles.infoGrid}>
            {/* Personal Information */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Personal Information</h3>
                <button className={styles.iconButton}>
                  <LuPencil />
                </button>
              </div>

              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <LuMail />
                  <div>
                    <span>Email</span>
                    <p>{profileData.email}</p>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <LuPhone />
                  <div>
                    <span>Phone</span>
                    <p>{profileData.phone}</p>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <LuIdCard />
                  <div>
                    <span>Roll Number</span>
                    <p>{profileData.rollNumber}</p>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <LuBuilding2 />
                  <div>
                    <span>Department</span>
                    <p>{profileData.department}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Professional Information</h3>
                <button className={styles.iconButton}>
                  <LuPencil />
                </button>
              </div>

              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <LuUser />
                  <div>
                    <span>Role</span>
                    <p>{profileData.role}</p>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <LuBriefcase />
                  <div>
                    <span>Specialization</span>
                    <p>{profileData.specialization}</p>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <LuBuilding2 />
                  <div>
                    <span>Office</span>
                    <p>{profileData.office}</p>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <LuIdCard />
                  <div>
                    <span>Joined</span>
                    <p>{profileData.joined}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>About</h3>
              <button className={styles.iconButton}>
                <LuPencil />
              </button>
            </div>
            <p className={styles.bio}>{profileData.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
