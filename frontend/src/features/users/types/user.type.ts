import { TimezoneValue } from "@/shared/constants";
import { UserRole } from "../constants/user-role.constant";

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  isActive: boolean;
  role: UserRole;
  lastLoginAt?: string; // Date → string (ISO từ API)
  createdAt: string;
  updatedAt: string;
  timezone: TimezoneValue;
}
