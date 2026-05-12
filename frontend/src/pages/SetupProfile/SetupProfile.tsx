import {
  useEffect,
  useRef,
  useState,
  type FC,
  type KeyboardEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  LuUser,
  LuBook,
  LuStar,
  LuBuilding,
  LuPhone,
  LuMapPin,
  LuArrowRight,
  LuArrowLeft,
  LuX,
  LuCircleCheck,
} from "react-icons/lu";

import styles from "./SetupProfile.module.css";
import {
  createStudentProfile,
  createSupervisorProfile,
} from "../../services/profileService";

/* ─────────────────────────── types ─────────────────────────── */
type Role = "student" | "supervisor" | "coordinator";
type User = { _id: string; role: Role };

interface FormState {
  // shared / userProfile
  department: string;
  phone: string;
  address: string;
  // student
  rollNumber: string;
  gpa: string;
  batchYear: string;
  // supervisor
  designation: string;
  specialization: string;
  // shared tag field
  interests: string[];
}

/* ─────────────────────────── component ─────────────────────── */
const SetupProfilePage: FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [step, setStep] = useState(0); // 0 = role-specific, 1 = contact
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<FormState>({
    department: "",
    phone: "",
    address: "",
    rollNumber: "",
    gpa: "",
    batchYear: "",
    designation: "",
    specialization: "",
    interests: [],
  });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(stored));
  }, []);

  if (!user) return <div className={styles.loading}>Loading…</div>;

  const isStudent = user.role === "student";
  const isSupervisor = user.role === "supervisor";

  const set = (key: keyof FormState, value: string) =>
    setForm((p) => ({ ...p, [key]: value }));

  /* ── submit ── */
  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const shared = {
        interests: form.interests,
        department: form.department || undefined,
        phone: form.phone || undefined,
        address: form.address || undefined,
      };

      if (isStudent) {
        await createStudentProfile({
          rollNumber: form.rollNumber,
          gpa: form.gpa ? Number(form.gpa) : undefined,
          batchYear: form.batchYear ? Number(form.batchYear) : undefined,
          ...shared,
        });
        navigate("/student/initialdashboard");
      } else if (isSupervisor) {
        await createSupervisorProfile({
          designation: form.designation,
          specialization: form.specialization || undefined,
          ...shared,
        });
        navigate("/supervisor/dashboard");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  /* ── tabs config ── */
  const tabs = isStudent
    ? ["Academic Info", "Contact Info"]
    : ["Professional Info", "Contact Info"];

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.badge}>
            {isStudent
              ? "Student"
              : isSupervisor
                ? "Supervisor"
                : "Coordinator"}
          </div>
          <h2 className={styles.title}>Complete Your Profile</h2>
          <p className={styles.subtitle}>
            Set up your account before accessing ProjectFlow
          </p>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {tabs.map((label, i) => (
            <button
              key={label}
              className={`${styles.tab} ${i === step ? styles.active : ""} ${i < step ? styles.completed : ""}`}
              onClick={() => i < step && setStep(i)}
            >
              <span className={styles.tabDot}>
                {i < step ? <LuCircleCheck size={10} /> : i + 1}
              </span>
              {label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className={styles.body}>
          {/* ── Step 0: role-specific ── */}
          {step === 0 && isStudent && (
            <>
              <div className={styles.sectionLabel}>Academic Details</div>

              <div className={styles.fieldGroup}>
                <Field
                  icon={<LuUser />}
                  placeholder="Roll Number"
                  value={form.rollNumber}
                  onChange={(v) => set("rollNumber", v)}
                />
                <Field
                  icon={<LuStar />}
                  placeholder="GPA (0–4.0)"
                  value={form.gpa}
                  onChange={(v) => set("gpa", v)}
                  type="number"
                />
              </div>

              <div className={styles.fieldGroupFull}>
                <Field
                  icon={<LuBook />}
                  placeholder="Batch Year"
                  value={form.batchYear}
                  onChange={(v) => set("batchYear", v)}
                  type="number"
                />
              </div>

              <div className={styles.sectionLabel} style={{ marginTop: 16 }}>
                Research Interests
              </div>
              <TagInput
                tags={form.interests}
                onChange={(tags) => setForm((p) => ({ ...p, interests: tags }))}
              />
            </>
          )}

          {step === 0 && isSupervisor && (
            <>
              <div className={styles.sectionLabel}>Professional Details</div>

              <div className={styles.fieldGroup}>
                <Field
                  icon={<LuUser />}
                  placeholder="Designation"
                  value={form.designation}
                  onChange={(v) => set("designation", v)}
                />
                <Field
                  icon={<LuBook />}
                  placeholder="Specialization"
                  value={form.specialization}
                  onChange={(v) => set("specialization", v)}
                />
              </div>

              <div className={styles.sectionLabel} style={{ marginTop: 16 }}>
                Research Interests
              </div>
              <TagInput
                tags={form.interests}
                onChange={(tags) => setForm((p) => ({ ...p, interests: tags }))}
              />
            </>
          )}

          {/* ── Step 1: contact / userProfile ── */}
          {step === 1 && (
            <>
              <div className={styles.sectionLabel}>Contact & Location</div>

              <div className={styles.fieldGroupFull}>
                <Field
                  icon={<LuBuilding />}
                  placeholder="Department"
                  value={form.department}
                  onChange={(v) => set("department", v)}
                />
              </div>
              <div className={styles.fieldGroupFull}>
                <Field
                  icon={<LuPhone />}
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={(v) => set("phone", v)}
                  type="tel"
                />
              </div>
              <div className={styles.fieldGroupFull}>
                <Field
                  icon={<LuMapPin />}
                  placeholder="Address"
                  value={form.address}
                  onChange={(v) => set("address", v)}
                />
              </div>
            </>
          )}

          {/* Error */}
          {error && <div className={styles.error}>{error}</div>}

          {/* Navigation */}
          <div className={styles.actions}>
            {step > 0 && (
              <button className={styles.btnBack} onClick={() => setStep(0)}>
                <LuArrowLeft size={14} /> Back
              </button>
            )}

            {step === 0 ? (
              <button className={styles.btnNext} onClick={() => setStep(1)}>
                Next <LuArrowRight size={14} />
              </button>
            ) : (
              <button
                className={styles.btnNext}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Saving…" : "Save & Continue"}{" "}
                <LuArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupProfilePage;

/* ─────────────────────── Field ─────────────────────────────── */
const Field = ({
  icon,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) => (
  <div className={styles.inputWrap}>
    <span className={styles.inputIcon}>{icon}</span>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

/* ─────────────────────── TagInput ───────────────────────────── */
const TagInput = ({
  tags,
  onChange,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
}) => {
  const [inputVal, setInputVal] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (raw: string) => {
    const val = raw.trim();
    if (val && !tags.includes(val)) {
      onChange([...tags, val]);
    }
    setInputVal("");
  };

  const removeTag = (idx: number) => onChange(tags.filter((_, i) => i !== idx));

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputVal);
    } else if (e.key === "Backspace" && !inputVal && tags.length) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <>
      <div
        className={styles.tagInputWrap}
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag, i) => (
          <span key={i} className={styles.tag}>
            {tag}
            <button className={styles.tagRemove} onClick={() => removeTag(i)}>
              <LuX size={11} />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          className={styles.tagInput}
          placeholder={tags.length === 0 ? "e.g. Machine Learning" : ""}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKey}
          onBlur={() => inputVal && addTag(inputVal)}
        />
      </div>
      <p className={styles.tagHint}>Press Enter or comma to add a tag</p>
    </>
  );
};
