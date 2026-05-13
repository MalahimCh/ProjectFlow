// src/components/Profile/ResetPasswordModal.tsx
import { type FC, useState } from "react";
import { LuX, LuLock } from "react-icons/lu";
import { resetPassword } from "../../services/profileService";

import styles from "./editProfileModal.module.css";

interface Props {
  onClose: () => void;
}

const ResetPasswordModal: FC<Props> = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    if (newPassword !== confirm) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setSaving(true);
    try {
      const res = await resetPassword({ currentPassword, newPassword });
      setSuccess(res.message);
      setTimeout(onClose, 1500);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to reset password.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Reset Password</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <LuX />
          </button>
        </div>

        <div className={styles.modalBody}>
          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.successMsg}>{success}</p>}

          <div className={styles.fieldGroup}>
            <label>Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label>Confirm New Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
            />
          </div>
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
            onClick={handleSubmit}
            disabled={saving}
          >
            <LuLock />
            {saving ? "Updating…" : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
