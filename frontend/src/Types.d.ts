import type { JSX } from "react";

export interface User {
  userId?: string;
  clinicId?: string;
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  role: string;
  password?: string;
}

export interface SideNavItem {
  title: string;
  path: string;
  icon?: JSX.Element;
}

export interface Doctor {
  id: string;
  user: User;
  specialization: string;
  licenseNumber: string;
  consultationFee: number;
  bio: string;
  availableSlots: string;
  clinic: Clinic;
  isAvailable: boolean;
}

export interface Clinic {
  id: string;
  name: string;
  address: string;
  state: string;
  district: string;
  taluka: string;
  phone: string;
}

export interface Staff {
  user: User;
  clinicName: string;
  clinicAddress: string;
  clinicPhone: string;
}
