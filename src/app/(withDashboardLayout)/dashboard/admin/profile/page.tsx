"use client";

import { useGetMYProfileQuery } from "../../../../../redux/api/myProfile";
import Image from "next/image";

export default function AdminProfilePage() {
  const {
    data: profile,
    error,
    isLoading,
    refetch,
  } = useGetMYProfileQuery(undefined);

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading profile...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg">
          Failed to load profile.{" "}
          <button
            onClick={() => refetch()}
            className="ml-2 underline text-blue-500"
          >
            Retry
          </button>
        </p>
      </div>
    );

  if (!profile)
    return (
      <div className="text-center text-red-500 mt-10">
        No profile data found.
      </div>
    );

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <Image
        src={profile.profilePhoto || "/default-avatar.png"}
        alt={profile.name || "Profile"}
        width={112}
        height={112}
        className="rounded-full mb-4 border-2 border-gray-300 object-cover"
      />

      {/* Name & Role */}
      <h1 className="text-2xl font-semibold">{profile.name}</h1>
      <p className="text-gray-500 text-sm mb-4">{profile.role}</p>

      {/* Profile Details */}
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md space-y-3 text-gray-700">
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p>
          <strong>Contact:</strong> {profile.contactNumber}
        </p>
        <p>
          <strong>Status:</strong> {profile.status}
        </p>
        <p>
          <strong>Need Password Change:</strong>{" "}
          {profile.needPasswordChange ? "Yes" : "No"}
        </p>
        <p className="text-sm text-gray-400">
          Created: {new Date(profile.createdAt).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-400">
          Updated: {new Date(profile.updatedAt).toLocaleDateString()}
        </p>
      </div>

      {/* Refresh Button */}
      <button
        onClick={() => refetch()}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Refresh Profile
      </button>
    </div>
  );
}
