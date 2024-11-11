import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Types
interface DashboardStat {
  id: string;
  label: string;
  value: number | string;
  change: number;
  changeType: "increase" | "decrease";
  icon: JSX.Element;
}

interface DashboardCard {
  id: string;
  title: string;
  description: string;
  stats: {
    label: string;
    value: string | number;
    trend: number;
  }[];
  actions: {
    label: string;
    onClick: () => void;
    icon?: JSX.Element;
  }[];
}

interface QuickAction {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
  href: string;
  color: string;
  roles?: ("admin" | "user")[];
}

// Mock Data
const DASHBOARD_STATS: DashboardStat[] = [
  {
    id: "total-projects",
    label: "Total Projects",
    value: 12,
    change: 2.5,
    changeType: "increase",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    id: "active-tasks",
    label: "Active Tasks",
    value: 64,
    change: 5.0,
    changeType: "increase",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    id: "team-members",
    label: "Team Members",
    value: 23,
    change: -3.2,
    changeType: "decrease",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
  {
    id: "completion-rate",
    label: "Completion Rate",
    value: "89%",
    change: 1.5,
    changeType: "increase",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "project-settings",
    name: "Project Settings",
    description: "Configure project settings and preferences",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    href: "/settings",
    color: "bg-blue-500",
    roles: ["admin"],
  },
  {
    id: "new-project",
    name: "Create Project",
    description: "Start a new project from scratch",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
    ),
    href: "/projects/new",
    color: "bg-green-500",
  },
];

const DASHBOARD_CARDS: DashboardCard[] = [
  {
    id: "project-overview",
    title: "Project Overview",
    description: "Current project status and metrics",
    stats: [
      { label: "Tasks Completed", value: 45, trend: 12.5 },
      { label: "Time Spent", value: "128h", trend: -5.2 },
    ],
    actions: [
      {
        label: "View Details",
        onClick: () => console.log("View details clicked"),
        icon: (
          <svg
            className="w-4 h-4 mr-1.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        ),
      },
      {
        label: "Generate Report",
        onClick: () => console.log("Generate report clicked"),
        icon: (
          <svg
            className="w-4 h-4 mr-1.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        ),
      },
    ],
  },
];

// Components
const InteractiveCard: React.FC<{ card: DashboardCard }> = ({ card }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 flex justify-between items-center">
          {card.title}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg
              className={`w-5 h-5 transform transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </h3>
        <p className="mt-2 text-sm text-gray-500">{card.description}</p>

        {isExpanded && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {card.stats.map((stat, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <dt className="text-sm font-medium text-gray-500">
                    {stat.label}
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900">
                    {stat.value}
                    {stat.trend !== 0 && (
                      <span
                        className={`ml-2 text-sm font-medium ${
                          stat.trend > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {stat.trend > 0 ? "+" : ""}
                        {stat.trend}%
                      </span>
                    )}
                  </dd>
                </div>
              ))}
            </div>

            <div className="flex space-x-3 mt-4">
              {card.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  {action.icon}
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Dashboard Component
export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const filteredQuickActions = QUICK_ACTIONS.filter(
    (action) => !action.roles || action.roles.includes(user?.role || "user")
  );

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <div className="mt-2 bg-white rounded-lg shadow px-5 py-6 sm:px-6">
            <div className="text-gray-700">
              <h2 className="text-xl font-medium">
                Welcome back, {user?.name}!
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Here's what's happening with your projects today.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {DASHBOARD_STATS.map((stat) => (
            <div
              key={stat.id}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div
                      className={`p-3 rounded-md ${
                        stat.changeType === "increase"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {stat.icon}
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.label}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                        <div
                          className={`ml-2 flex items-baseline text-sm font-semibold ${
                            stat.changeType === "increase"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {stat.changeType === "increase" ? (
                            <svg
                              className="w-5 h-5 mr-1 self-center"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5 mr-1 self-center"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                              />
                            </svg>
                          )}
                          {Math.abs(stat.change)}%
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredQuickActions.map((action) => (
              <Link
                key={action.id}
                to={action.href}
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg shadow hover:shadow-lg transition-all duration-200"
              >
                <div>
                  <span
                    className={`inline-flex p-3 rounded-lg ${action.color} text-white ring-4 ring-white`}
                  >
                    {action.icon}
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {action.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {action.description}
                  </p>
                </div>
                <span
                  className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400 transition-colors duration-200"
                  aria-hidden="true"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Interactive Cards */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Project Details
          </h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {DASHBOARD_CARDS.map((card) => (
              <InteractiveCard key={card.id} card={card} />
            ))}
          </div>
        </div>

        {/* Admin Section */}
        {user?.role === "admin" && (
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Administrative Tools
            </h2>
            <div className="bg-white shadow rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link
                  to="/settings"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                >
                  Project Settings
                </Link>
                <button
                  onClick={() => console.log("Generate report clicked")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
                >
                  Generate Report
                </button>
                <button
                  onClick={() => console.log("Manage users clicked")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors duration-200"
                >
                  Manage Users
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
