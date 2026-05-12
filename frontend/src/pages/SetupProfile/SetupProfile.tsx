import { useEffect, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SetupProfile.module.css";
import { LuUser, LuBook, LuStar } from "react-icons/lu";

import {
  createStudentProfile,
  createSupervisorProfile,
} from "../../services/profileService";

type User = {
  _id: string;
  role: "student" | "supervisor" | "coordinator";
};

const SetupProfilePage: FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  const [form, setForm] = useState({
    rollNumber: "",
    gpa: "",
    interests: "",
    batchYear: "",
    designation: "",
    maxWorkload: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (!stored) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(stored));
  }, []);

  if (!user) return <div className={styles.loading}>Loading...</div>;

  const isStudent = user.role === "student";
  const isSupervisor = user.role === "supervisor";

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (isStudent) {
        await createStudentProfile({
          rollNumber: form.rollNumber,
          gpa: form.gpa ? Number(form.gpa) : undefined,
          interests: form.interests
            ? form.interests.split(",").map((i) => i.trim())
            : [],
          batchYear: form.batchYear ? Number(form.batchYear) : undefined,
        });
      }

      if (isSupervisor) {
        await createSupervisorProfile({
          designation: form.designation,
          maxWorkload: form.maxWorkload ? Number(form.maxWorkload) : undefined,
          interests: form.interests
            ? form.interests.split(",").map((i) => i.trim())
            : [],
        });
      }

      navigate(
        isStudent ? "/student/initialdashboard" : "/supervisor/dashboard",
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Complete Your Profile</h2>
        <p className={styles.subtitle}>
          Set up your account before accessing ProjectFlow
        </p>

        {/* STUDENT FORM */}
        {isStudent && (
          <>
            <Input
              icon={<LuUser />}
              placeholder="Roll Number"
              onChange={(e) => handleChange("rollNumber", e.target.value)}
            />

            <Input
              icon={<LuStar />}
              placeholder="GPA"
              onChange={(e) => handleChange("gpa", e.target.value)}
            />

            <Input
              icon={<LuBook />}
              placeholder="Interests (comma separated)"
              onChange={(e) => handleChange("interests", e.target.value)}
            />

            <Input
              icon={<LuBook />}
              placeholder="Batch Year"
              onChange={(e) => handleChange("batchYear", e.target.value)}
            />
          </>
        )}

        {/* SUPERVISOR FORM */}
        {isSupervisor && (
          <>
            <Input
              icon={<LuUser />}
              placeholder="Designation"
              onChange={(e) => handleChange("designation", e.target.value)}
            />

            <Input
              icon={<LuStar />}
              placeholder="Max Workload"
              onChange={(e) => handleChange("maxWorkload", e.target.value)}
            />

            <Input
              icon={<LuBook />}
              placeholder="Interests (comma separated)"
              onChange={(e) => handleChange("interests", e.target.value)}
            />
          </>
        )}

        <button className={styles.button} onClick={handleSubmit}>
          Save & Continue
        </button>
      </div>
    </div>
  );
};

export default SetupProfilePage;

/* ================= INPUT COMPONENT ================= */

const Input = ({
  icon,
  ...props
}: {
  icon: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <div className={styles.inputBox}>
      <span className={styles.icon}>{icon}</span>
      <input {...props} />
    </div>
  );
};
