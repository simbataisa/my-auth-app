import { LoginCredentials, AuthResponse, User, Profile } from "../types/auth";
import { MOCK_USERS, MOCK_PROFILES } from "../types/mockData";

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await delay(800);

    const user = MOCK_USERS.find(
      (u) =>
        u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const { password, ...userWithoutPassword } = user;
    const token = btoa(
      JSON.stringify({ userId: user.id, timestamp: Date.now() })
    );

    return {
      user: userWithoutPassword,
      token,
    };
  },

  verifyToken: async (token: string): Promise<{ user: User }> => {
    await delay(500);

    try {
      const decoded = JSON.parse(atob(token));
      const user = MOCK_USERS.find((u) => u.id === decoded.userId);

      if (!user || Date.now() - decoded.timestamp > 24 * 60 * 60 * 1000) {
        throw new Error("Token expired");
      }

      const { password, ...userWithoutPassword } = user;
      return { user: userWithoutPassword };
    } catch {
      throw new Error("Invalid token");
    }
  },

  getProfile: async (userId: number, token: string): Promise<Profile> => {
    await delay(600);

    // Verify token first
    await mockApi.verifyToken(token);

    const profile = MOCK_PROFILES[userId];
    if (!profile) {
      throw new Error("Profile not found");
    }

    return profile;
  },
};
