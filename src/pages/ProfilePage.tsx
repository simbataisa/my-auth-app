import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { mockApi } from "../api/mockApi";
import { Profile } from "../types/auth";

interface LoadingState {
  status: "idle" | "loading" | "error" | "success";
  error?: string;
}

export const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    status: "idle",
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!id) return;

      setLoadingState({ status: "loading" });
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        const profileData = await mockApi.getProfile(parseInt(id), token);
        setProfile(profileData);
        setLoadingState({ status: "success" });
      } catch (error) {
        setLoadingState({
          status: "error",
          error:
            error instanceof Error ? error.message : "Failed to load profile",
        });
      }
    };

    loadProfile();
  }, [id]);

  if (loadingState.status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (loadingState.status === "error") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error Loading Profile
              </h3>
              <p className="mt-2 text-sm text-red-700">{loadingState.error}</p>
              <button
                onClick={() => navigate("/dashboard")}
                className="mt-4 bg-red-100 text-red-800 px-4 py-2 rounded hover:bg-red-200"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 text-white p-6">
          <h1 className="text-3xl font-bold">{user?.name}</h1>
          <p className="text-gray-300 mt-2">{user?.role}</p>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bio Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Bio</h2>
              <p className="text-gray-600">{profile.bio}</p>
            </div>

            {/* Location Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              <p className="text-gray-600">{profile.location}</p>
            </div>
          </div>

          {/* Projects Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.projects.map((project, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <h3 className="font-medium text-gray-800">{project}</h3>
                </div>
              ))}
            </div>
          </div>

          {/* Edit Profile Button (only shown if viewing own profile) */}
          {user?.id === parseInt(id) && (
            <div className="mt-8">
              <button
                onClick={() => {
                  /* Add edit functionality */
                }}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
