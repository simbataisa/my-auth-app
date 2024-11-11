import React, { useState, useEffect } from "react";
import { ProjectSetting } from "@/types/project";

interface SettingsGroup {
  category: string;
  settings: ProjectSetting[];
}

const MOCK_SETTINGS: ProjectSetting[] = [
  {
    id: "project-name",
    name: "Project Name",
    value: "My Awesome Project",
    type: "text",
    description: "The display name of your project",
    category: "general",
  },
  {
    id: "notifications-enabled",
    name: "Enable Notifications",
    value: true,
    type: "boolean",
    description: "Toggle email notifications for project updates",
    category: "notifications",
  },
  {
    id: "max-users",
    name: "Maximum Users",
    value: 100,
    type: "number",
    description: "Maximum number of users allowed in the project",
    category: "security",
  },
  {
    id: "api-key",
    name: "API Key",
    value: "sk_test_123456789",
    type: "text",
    description: "Your project API key for integrations",
    category: "integration",
  },
];

export const ProjectSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<ProjectSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [activeTab, setActiveTab] = useState<string>("general");

  useEffect(() => {
    // Simulate API call to fetch settings
    const fetchSettings = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
        setSettings(MOCK_SETTINGS);
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSettingChange = (
    settingId: string,
    value: string | boolean | number
  ) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === settingId ? { ...setting, value } : setting
      )
    );
  };

  const handleSaveSettings = async () => {
    setSaveStatus("saving");
    try {
      // Simulate API call to save settings
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      setSaveStatus("error");
    }
  };

  const groupedSettings = settings.reduce(
    (groups: SettingsGroup[], setting) => {
      const existingGroup = groups.find((g) => g.category === setting.category);
      if (existingGroup) {
        existingGroup.settings.push(setting);
      } else {
        groups.push({
          category: setting.category,
          settings: [setting],
        });
      }
      return groups;
    },
    []
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Project Settings</h1>
          <button
            onClick={handleSaveSettings}
            disabled={saveStatus === "saving"}
            className="btn-primary"
          >
            {saveStatus === "saving" && (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {saveStatus === "saved"
              ? "Saved!"
              : saveStatus === "saving"
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>

        {/* Settings Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {groupedSettings.map(({ category }) => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    activeTab === category
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="bg-white shadow rounded-lg">
          {groupedSettings
            .find((group) => group.category === activeTab)
            ?.settings.map((setting) => (
              <div
                key={setting.id}
                className="px-6 py-5 border-b border-gray-200 last:border-0"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {setting.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {setting.description}
                    </p>
                  </div>
                  <div className="ml-4">
                    {setting.type === "boolean" ? (
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={setting.value as boolean}
                          onChange={(e) =>
                            handleSettingChange(setting.id, e.target.checked)
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    ) : (
                      <input
                        type={setting.type}
                        value={setting.value as string | number}
                        onChange={(e) =>
                          handleSettingChange(setting.id, e.target.value)
                        }
                        className="input-primary max-w-xs"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
