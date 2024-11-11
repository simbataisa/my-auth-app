export interface User {
  id: number;
  email: string;
  name: string;
  role: "admin" | "user";
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Profile {
  bio: string;
  location: string;
  projects: string[];
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  initialized: boolean; // Add this
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
  saveRequestedPath: () => void;
}
