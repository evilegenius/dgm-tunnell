export interface AdminNavItem {
  to: string;
  end?: boolean;
  label: string;
  icon: string;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { to: "/admin", end: true, label: "Dashboard", icon: "ri-dashboard-3-line" },
  { to: "/admin/pays-configs", label: "Pays et configs", icon: "ri-global-line" },
  { to: "/admin/jetons", label: "Jetons", icon: "ri-coupon-3-line" },
  { to: "/admin/appareils", label: "Appareils", icon: "ri-smartphone-line" },
  { to: "/admin/application", label: "Application", icon: "ri-android-line" },
  { to: "/admin/journal", label: "Journal", icon: "ri-file-list-3-line" },
  { to: "/admin/securite", label: "Sécurité", icon: "ri-shield-keyhole-line" },
];