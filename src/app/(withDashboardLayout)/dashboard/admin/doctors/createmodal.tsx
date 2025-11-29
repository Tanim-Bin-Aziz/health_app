"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getFromLocalStorage } from "@/utils/local-storage";
import { authKey } from "@/contants/authkey";

const AdminDoctorPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [experience, setExperience] = useState(0);
  const [gender, setGender] = useState("MALE");
  const [appointmentFee, setAppointmentFee] = useState(0);
  const [qualification, setQualification] = useState("");
  const [currentWorkingPlace, setCurrentWorkingPlace] = useState("");
  const [designation, setDesignation] = useState("");
  const [password, setPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);

  const token = getFromLocalStorage(authKey);

  const handleCreateDoctor = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          password,
          doctor: {
            name,
            email,
            contactNumber,
            registrationNumber,
            experience,
            gender,
            apointmentFee: appointmentFee,
            qualification,
            currentWorkingPlace,
            designation,
          },
        })
      );
      if (profilePhoto) formData.append("file", profilePhoto);

      const res = await fetch("http://localhost:5000/api/v1/doctor", {
        method: "POST",
        body: formData,
        headers: token ? { Authorization: token } : {},
      });

      if (!res.ok)
        throw new Error((await res.text()) || "Failed to create doctor");

      alert("Doctor created successfully!");
      setIsModalOpen(false);
      // Optionally reset form fields
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Admin Doctor Management</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        style={{
          padding: "0.6rem 1rem",
          borderRadius: "12px",
          border: "none",
          background: "#2563eb",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Create Doctor
      </button>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsModalOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backdropFilter: "blur(8px)",
              backgroundColor: "rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
            }}
          >
            <motion.form
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleCreateDoctor}
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 120, damping: 15 }}
              style={{
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(12px)",
                padding: "2rem",
                borderRadius: "12px",
                width: "400px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              }}
            >
              <h2 style={{ marginBottom: "1rem", textAlign: "center" }}>
                Create Doctor
              </h2>

              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Contact Number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Registration Number"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Experience"
                value={experience}
                onChange={(e) => setExperience(Number(e.target.value))}
                required
              />
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
              <input
                type="number"
                placeholder="Appointment Fee"
                value={appointmentFee}
                onChange={(e) => setAppointmentFee(Number(e.target.value))}
                required
              />
              <input
                type="text"
                placeholder="Qualification"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Current Working Place"
                value={currentWorkingPlace}
                onChange={(e) => setCurrentWorkingPlace(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Designation"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="file"
                onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "1rem",
                }}
              >
                <button
                  type="submit"
                  style={{
                    background: "#2563eb",
                    color: "#fff",
                    padding: "0.5rem 1rem",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    background: "#e5e7eb",
                    padding: "0.5rem 1rem",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDoctorPage;
