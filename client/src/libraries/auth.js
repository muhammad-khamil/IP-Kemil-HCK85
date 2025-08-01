export function isAdmin() {
  return localStorage.getItem("role") === "admin";
}

export function isUser() {
  return localStorage.getItem("role") === "user";
}

export function isLoggedIn() {
  return !!localStorage.getItem("access_token");
}