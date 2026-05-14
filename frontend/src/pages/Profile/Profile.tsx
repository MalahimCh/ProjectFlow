// Profile.tsx
import { type FC, useState, useEffect } from "react";
import CoordSidebar from "../Coordinator/Sidebar/CoordSidebar";
import SSidebar from "../Supervisor/Sidebar/Ssidebar";
import StudSidebar from "../Student/Sidebar/StudSidebar";
import Header from "../../components/Header/Header";
import EditProfileModal from "./editProfileModal";
import InitSidebar from "../Student/Sidebar/InitSidebar";
import ResetPasswordModal from "./resetPasswordModal";
import {
  LuMail,
  LuPhone,
  LuBuilding2,
  LuIdCard,
  LuUser,
  LuBriefcase,
  LuPencil,
  LuLock,
  LuMapPin,
  LuGraduationCap,
  LuTag,
  LuLoader,
} from "react-icons/lu";
import styles from "./Profile.module.css";
import {
  fetchProfile,
  updateProfile,
  type Profile as ProfileData,
  type StudentProfile,
  type SupervisorProfile,
} from "../../services/profileService";

import { getUser } from "../../services/authService";

type UserRole = "istudent" | "coordinator" | "supervisor" | "student";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getRoleLabel(role: string): string {
  switch (role) {
    case "student":
      return "Student";
    case "supervisor":
      return "Supervisor";
    case "coordinator":
      return "FYP Coordinator";
    default:
      return role;
  }
}

const isMobile = () =>
  typeof window !== "undefined" && window.innerWidth <= 767;

// ─── Sub-components ───────────────────────────────────────────────────────────

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number | null | undefined;
}

const InfoItem: FC<InfoItemProps> = ({ icon, label, value }) => (
  <div className={styles.infoItem}>
    {icon}
    <div>
      <span>{label}</span>
      <p>{value ?? "—"}</p>
    </div>
  </div>
);

// ─── Role-specific info panels ────────────────────────────────────────────────

const StudentInfoPanel: FC<{ profile: StudentProfile; onEdit: () => void }> = ({
  profile,
  onEdit,
}) => (
  <div className={styles.card}>
    <div className={styles.cardHeader}>
      <h3>Academic Information</h3>
      <button className={styles.iconButton} onClick={onEdit} title="Edit">
        <LuPencil />
      </button>
    </div>
    <div className={styles.infoList}>
      <InfoItem
        icon={<LuIdCard />}
        label="Roll Number"
        value={profile.rollNumber}
      />
      <InfoItem icon={<LuGraduationCap />} label="GPA" value={profile.gpa} />
      <InfoItem
        icon={<LuBuilding2 />}
        label="Batch Year"
        value={profile.batchYear}
      />
      <InfoItem
        icon={<LuTag />}
        label="Interests"
        value={profile.interests?.length ? profile.interests.join(", ") : null}
      />
    </div>
  </div>
);

const SupervisorInfoPanel: FC<{
  profile: SupervisorProfile;
  onEdit: () => void;
}> = ({ profile, onEdit }) => (
  <div className={styles.card}>
    <div className={styles.cardHeader}>
      <h3>Professional Information</h3>
      <button className={styles.iconButton} onClick={onEdit} title="Edit">
        <LuPencil />
      </button>
    </div>
    <div className={styles.infoList}>
      <InfoItem
        icon={<LuUser />}
        label="Designation"
        value={profile.designation}
      />
      <InfoItem
        icon={<LuBriefcase />}
        label="Specialization"
        value={profile.specialization}
      />
      <InfoItem
        icon={<LuTag />}
        label="Interests"
        value={profile.interests?.length ? profile.interests.join(", ") : null}
      />
      <InfoItem
        icon={<LuIdCard />}
        label="Active Supervisions"
        value={profile.workload}
      />
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const Profile: FC = () => {
  const [collapsed, setCollapsed] = useState(() => isMobile());
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [role, setRole] = useState<UserRole>("student"); // default role
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 767) setCollapsed(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchProfile()
      .then(setProfile)
      .catch((err) => setFetchError(err.message ?? "Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (payload: Partial<ProfileData>) => {
    const updated = await updateProfile(payload);
    setProfile(updated);
  };
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const userRole = await getUser();
        setRole(userRole as UserRole);
      } catch (error) {
        console.error("Failed to fetch user role:", error);
      }
    };

    fetchRole();
  }, []);
  const renderSidebar = () => {
    switch (role) {
      case "istudent":
        return (
          <InitSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        );
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

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.loadingState}>
            <LuLoader className={styles.spinner} />
            <p>Loading profile…</p>
          </div>
        </div>
      </div>
    );
  }

  if (fetchError || !profile) {
    return (
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.errorState}>
            <p>{fetchError ?? "Profile unavailable."}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {renderSidebar()}

      <div className={styles.main}>
        <Header
          title="Profile"
          subtitle="View and manage your personal information"
        />

        <div className={styles.content}>
          {/* ── Top Profile Card ── */}
          <div className={styles.profileCard}>
            <div className={styles.avatar}>{getInitials(profile.name)}</div>

            <div className={styles.profileInfo}>
              <h2>{profile.name}</h2>
              <p>{getRoleLabel(profile.role)}</p>
              <span>{profile.department ?? "—"}</span>
            </div>

            <div className={styles.profileActions}>
              <button
                className={styles.editButton}
                onClick={() => setShowEditModal(true)}
              >
                <LuPencil />
                Edit Profile
              </button>
              <button
                className={styles.passwordButton}
                onClick={() => setShowPasswordModal(true)}
              >
                <LuLock />
                Reset Password
              </button>
            </div>
          </div>

          {/* ── Info Grid ── */}
          <div className={styles.infoGrid}>
            {/* Personal / Contact Info — shared for all roles */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Personal Information</h3>
                <button
                  className={styles.iconButton}
                  onClick={() => setShowEditModal(true)}
                  title="Edit"
                >
                  <LuPencil />
                </button>
              </div>
              <div className={styles.infoList}>
                <InfoItem
                  icon={<LuMail />}
                  label="Email"
                  value={profile.email}
                />
                <InfoItem
                  icon={<LuPhone />}
                  label="Phone"
                  value={profile.phone}
                />
                <InfoItem
                  icon={<LuBuilding2 />}
                  label="Department"
                  value={profile.department}
                />
                <InfoItem
                  icon={<LuMapPin />}
                  label="Address"
                  value={profile.address}
                />
              </div>
            </div>

            {/* Role-specific panel */}
            {profile.role === "student" && (
              <StudentInfoPanel
                profile={profile as StudentProfile}
                onEdit={() => setShowEditModal(true)}
              />
            )}

            {profile.role === "supervisor" && (
              <SupervisorInfoPanel
                profile={profile as SupervisorProfile}
                onEdit={() => setShowEditModal(true)}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {showEditModal && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onSave={handleSave}
        />
      )}

      {showPasswordModal && (
        <ResetPasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
};

export default Profile;
