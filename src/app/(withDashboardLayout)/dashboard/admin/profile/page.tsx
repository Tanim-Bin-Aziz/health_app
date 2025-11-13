"use client";

import { useGetMYProfileQuery } from "../../../../../redux/api/myProfile";
import Image from "next/image";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

// 🟣 Custom Admin Chip
const AdminChip = styled(Chip)(() => ({
  backgroundColor: "rgba(168, 85, 247, 0.1)",
  color: "dark",
  fontSize: "0.9rem",
  fontWeight: 500,
  borderRadius: "8px",
  backdropFilter: "blur(6px)",
  border: "1px solid rgba(168, 85, 247, 0.3)",
  "& .MuiChip-label": {
    padding: "2px 6px",
  },
}));

// ✨ Glass card style
const GlassCard = styled(Card)(() => ({
  background: "rgba(255, 255, 255, 0.15)",
  border: "1px solid rgba(255, 255, 255, 0.25)",
  backdropFilter: "blur(10px)",
  borderRadius: "20px",
  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
  color: "#222",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  padding: "1rem",
  width: "100%",
}));

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
    <div className="bg-gradient-to-br from-[#0dc2bc] to-[#b4dbd2] min-h-screen flex justify-center items-center">
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="w-full max-w-[500px] sm:w-[400px]" // fixed max width
      >
        <GlassCard className="flex flex-col gap-4">
          {/* Profile Pic & Name/Admin */}
          <div className="flex items-center gap-3">
            <Image
              src={profile.profilePhoto || "/default-avatar.png"}
              alt={profile.name || "Profile"}
              width={80}
              height={80}
              className="rounded-full border-1 border-white/30 shadow-md object-cover"
            />
            <div className="flex flex-col ml-[20px]">
              <Typography
                variant="h6"
                className="font-semibold text-sm md:text-base"
              >
                {profile.name}
              </Typography>
              <AdminChip label="Admin" className="mt-1" size="small" />
            </div>
          </div>

          {/* Profile Details */}
          <CardContent className="px-0">
            <Typography
              variant="subtitle1"
              gutterBottom
              className="font-semibold text-gray-800 mb-3 text-sm"
            >
              Profile Information
            </Typography>
            <div className="space-y-1 text-gray-700 text-sm">
              <Typography>Email: {profile.email}</Typography>
              <Typography>Contact: {profile.contactNumber}</Typography>
              <Typography>Status: {profile.status}</Typography>
              <Typography>
                Password Change:{" "}
                {profile.needPasswordChange ? "Required" : "No"}
              </Typography>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              <Typography>
                Created: {new Date(profile.createdAt).toLocaleDateString()}
              </Typography>
              <Typography>
                Updated: {new Date(profile.updatedAt).toLocaleDateString()}
              </Typography>
            </div>
          </CardContent>
        </GlassCard>
      </motion.div>
    </div>
  );
}
