import type { JSX } from "react";

export interface User {
  userId?: string;
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
