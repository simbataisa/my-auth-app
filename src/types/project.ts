export interface ProjectSetting {
  id: string;
  name: string;
  value: string | boolean | number;
  type: "text" | "boolean" | "number";
  description: string;
  category: "general" | "security" | "notifications" | "integration";
}
