import type { FC, ReactNode } from "react";
import styles from "./StatsCard.module.css";

type StatsCardProps = {
  value: number | string;
  label: string;
  icon?: ReactNode;
  bgColor?: string;
  iconColor?: string; // ✅ add this
};

const StatsCard: FC<StatsCardProps> = ({
  value,
  label,
  icon,
  bgColor = "#d1e3fa",
  iconColor = "#1e3a8a",
}) => {
  return (
    <div className={styles.card}>
      <div
        className={styles.left}
        style={{ backgroundColor: bgColor, color: iconColor }}
      >
        {icon}
      </div>

      <div className={styles.right}>
        <div className={styles.value}>{value}</div>
        <div className={styles.label}>{label}</div>
      </div>
    </div>
  );
};

export default StatsCard;