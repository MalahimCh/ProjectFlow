
import type { IconType } from "react-icons";

export type MenuItem = {
  label: string;
  icon: IconType;
  onClick?: () => void; // optional (for routing later)
};