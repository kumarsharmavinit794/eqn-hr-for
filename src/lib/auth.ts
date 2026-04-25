export type UserRole = "admin" | "hr" | "employee";

export function getStoredAuthValue(key: string) {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(key) || window.sessionStorage.getItem(key);
}

export function getStoredToken() {
  return getStoredAuthValue("token");
}

export function getStoredRole(): UserRole {
  const role = getStoredAuthValue("role")?.toLowerCase();
  if (role === "admin" || role === "hr") {
    return role;
  }
  return "employee";
}

export function getDefaultRoute(role: UserRole) {
  if (role === "admin") return "/admin";
  if (role === "hr") return "/hr";
  return "/employee";
}
