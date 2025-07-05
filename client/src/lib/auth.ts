import { apiRequest } from "@/lib/queryClient";

export interface User {
  id: number;
  username: string;
  role: "commissioner" | "gm";
  email: string;
}

export interface AuthResponse {
  user: User;
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  const response = await apiRequest("POST", "/api/auth/login", { username, password });
  return response.json();
}

export async function register(userData: {
  username: string;
  password: string;
  email: string;
  role: "commissioner" | "gm";
}): Promise<AuthResponse> {
  const response = await apiRequest("POST", "/api/auth/register", userData);
  return response.json();
}

export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem("currentUser");
  return userStr ? JSON.parse(userStr) : null;
}

export function setCurrentUser(user: User | null): void {
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
  } else {
    localStorage.removeItem("currentUser");
  }
}

export function logout(): void {
  setCurrentUser(null);
}
