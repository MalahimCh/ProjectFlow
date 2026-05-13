// src/components/Profile/EditProfileModal.tsx
import { type FC, useState, useEffect } from "react";
import { LuX, LuSave } from "react-icons/lu";
import type {
  Profile,
  StudentProfile,
  SupervisorProfile,
} from "../../services/profileService";
import styles from "./editProfileModal.module.css";
interface Props {
  profile: Profile;
  onClose: () => void;
  onSave: (payload: Partial<Profile>) => Promise<void>;
}

const EditProfileModal: FC<Props> = ({ profile, onClose, onSave }) => {
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initial: Record<string, string> = {
      name: profile.name ?? "",
      email: profile.email ?? "",
      phone: profile.phone ?? "",
      department: profile.department ?? "",
      address: profile.address ?? "",
    };

    if (profile.role === "student") {
      const s = profile as StudentProfile;
      initial.rollNumber = s.rollNumber ?? "";
      initial.gpa = s.gpa?.toString() ?? "";
      initial.batchYear = s.batchYear?.toString() ?? "";
      initial.interests = s.interests?.join(", ") ?? "";
    }

    if (profile.role === "supervisor") {
      const sv = profile as SupervisorProfile;
      initial.designation = sv.designation ?? "";
      initial.specialization = sv.specialization ?? "";
      initial.interests = sv.interests?.join(", ") ?? "";
    }

    setForm(initial);
  }, [profile]);

  const set =
    (key: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = {
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        department: form.department || null,
        address: form.address || null,
      };

      if (profile.role === "student") {
        payload.rollNumber = form.rollNumber || null;
        payload.gpa = form.gpa ? parseFloat(form.gpa) : null;
        payload.batchYear = form.batchYear ? parseInt(form.batchYear) : null;
        payload.interests = form.interests
          ? form.interests
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];
      }

      if (profile.role === "supervisor") {
        payload.designation = form.designation || null;
        payload.specialization = form.specialization || null;
        payload.interests = form.interests
          ? form.interests
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];
      }

      await onSave(payload as Partial<Profile>);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Edit Profile</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <LuX />
          </button>
        </div>

        <div className={styles.modalBody}>
          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.fieldGroup}>
            <label>Full Name</label>
            <input value={form.name ?? ""} onChange={set("name")} />
          </div>

          <div className={styles.fieldGroup}>
            <label>Email</label>
            <input
              type="email"
              value={form.email ?? ""}
              onChange={set("email")}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label>Phone</label>
            <input value={form.phone ?? ""} onChange={set("phone")} />
          </div>

          <div className={styles.fieldGroup}>
            <label>Department</label>
            <input value={form.department ?? ""} onChange={set("department")} />
          </div>

          <div className={styles.fieldGroup}>
            <label>Address</label>
            <input value={form.address ?? ""} onChange={set("address")} />
          </div>

          {profile.role === "student" && (
            <>
              <div className={styles.fieldGroup}>
                <label>Roll Number</label>
                <input
                  value={form.rollNumber ?? ""}
                  onChange={set("rollNumber")}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label>GPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  value={form.gpa ?? ""}
                  onChange={set("gpa")}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label>Batch Year</label>
                <input
                  type="number"
                  value={form.batchYear ?? ""}
                  onChange={set("batchYear")}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label>Interests (comma-separated)</label>
                <textarea
                  value={form.interests ?? ""}
                  onChange={set("interests")}
                  rows={2}
                />
              </div>
            </>
          )}

          {profile.role === "supervisor" && (
            <>
              <div className={styles.fieldGroup}>
                <label>Designation</label>
                <input
                  value={form.designation ?? ""}
                  onChange={set("designation")}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label>Specialization</label>
                <input
                  value={form.specialization ?? ""}
                  onChange={set("specialization")}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label>Interests (comma-separated)</label>
                <textarea
                  value={form.interests ?? ""}
                  onChange={set("interests")}
                  rows={2}
                />
              </div>
            </>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button
            className={styles.cancelBtn}
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={saving}
          >
            <LuSave />
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
