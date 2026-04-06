export type UserRole = "admin" | "hr" | "employee";

export function getStoredRole(): UserRole {
  const role = localStorage.getItem("role")?.toLowerCase();
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
