import { Profile, User } from "./auth";

export const MOCK_USERS: (User & { password: string })[] = [
  {
    id: 1,
    email: "john@example.com",
    password: "password123",
    name: "John Doe",
    role: "admin",
  },
  {
    id: 2,
    email: "jane@example.com",
    password: "password456",
    name: "Jane Smith",
    role: "user",
  },
];

export const MOCK_PROFILES: Record<number, Profile> = {
  1: {
    bio: "Senior Developer",
    location: "New York",
    projects: ["Project A", "Project B"],
  },
  2: {
    bio: "UX Designer",
    location: "San Francisco",
    projects: ["Project C"],
  },
};
