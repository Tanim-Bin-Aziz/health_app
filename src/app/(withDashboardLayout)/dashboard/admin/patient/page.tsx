/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getFromLocalStorage } from "@/utils/local-storage";
import { authKey } from "@/contants/authkey";

type Patient = {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  createdAt: string;
};

const AdminPatientPage = () => {
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);

  const token = getFromLocalStorage(authKey);

  // Fetch all patients
  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/v1/patient`, {
        headers: { Authorization: `${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setAllPatients(data.data);
      setPatients(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Filter patients
  useEffect(() => {
    let filtered = allPatients;

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.contactNumber.toLowerCase().includes(lower)
      );
    }

    if (filterDate) {
      filtered = filtered.filter(
        (p) => p.createdAt.split("T")[0] === filterDate
      );
    }

    setPatients(filtered);
  }, [searchTerm, filterDate, allPatients]);

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          password,
          patient: { name, email, contactNumber, address },
        })
      );
      if (profilePhoto) formData.append("file", profilePhoto);

      const res = await fetch(
        "http://localhost:5000/api/v1/user/create-patient",
        {
          method: "POST",
          body: formData,
          headers: { Authorization: token },
        }
      );

      if (!res.ok)
        throw new Error((await res.text()) || "Failed to create patient");

      const newPatient = await res.json();

      alert("Patient created successfully!");

      setAllPatients((prev) => [...prev, newPatient.data]);
      setPatients((prev) => [...prev, newPatient.data]);

      setName("");
      setEmail("");
      setContactNumber("");
      setAddress("");
      setPassword("");
      setProfilePhoto(null);
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Format date like "12 Nov 2025 | 08.25 PM"
  const formatDateTime = (iso: string) => {
    const date = new Date(iso);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const formatted = date.toLocaleString("en-US", options);
    // Replace ":" with "." in time
    return formatted.replace(/:/, ".");
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Admin Patient List</h1>

      {/* Top Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        <p style={{ fontWeight: 500 }}>Total Patients: {allPatients.length}</p>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          {/* Search */}
          <input
            type="text"
            placeholder="Search by name or contact"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "0.6rem 1rem",
              borderRadius: "12px",
              border: "1px solid #ccc",
              outline: "none",
              width: "220px",
              backdropFilter: "blur(6px)",
              background: "rgba(255,255,255,0.5)",
            }}
          />

          {/* Date Filter */}
          <div style={{ position: "relative", width: "220px" }}>
            {!filterDate && (
              <span
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  color: "#888",
                  fontSize: "16px",
                }}
              >
                📅
              </span>
            )}
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              style={{
                padding: "0.6rem 1rem",
                borderRadius: "12px",
                border: "1px solid #ccc",
                outline: "none",
                width: "100%",
                backdropFilter: "blur(6px)",
                background: "rgba(255,255,255,0.5)",
                cursor: "pointer",
                boxSizing: "border-box",
                paddingLeft: filterDate ? "1rem" : "2rem",
              }}
            />
            <AnimatePresence>
              {filterDate && (
                <motion.span
                  key="clear-cross"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.2, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setFilterDate("")}
                  style={{
                    position: "absolute",
                    right: "40px",
                    top: "20%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    fontWeight: "bold",
                    color: "#555",
                    userSelect: "none",
                  }}
                >
                  ✕
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Create Patient Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              padding: "0.6rem 1rem",
              borderRadius: "12px",
              border: "none",
              background: "#2563eb",
              color: "#fff",
              cursor: "pointer",
              width: "220px",
            }}
          >
            Create Patient
          </button>
        </div>
      </div>

      {loading && <p>Loading patients...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Table */}
      <table
        border={1}
        cellPadding={10}
        style={{
          width: "100%",
          marginTop: "1rem",
          borderCollapse: "collapse",
        }}
      >
        <thead style={{ backgroundColor: "#f2f2f2" }}>
          <tr>
            <th style={{ textAlign: "center", padding: "8px" }}>Serial</th>
            <th style={{ padding: "8px" }}>Name</th>
            <th style={{ padding: "8px" }}>Contact</th>
            <th style={{ padding: "8px" }}>Email</th>
            <th style={{ padding: "8px" }}>Created At</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p, idx) => (
            <tr key={p.id}>
              <td style={{ textAlign: "center", padding: "8px" }}>{idx + 1}</td>
              <td style={{ padding: "8px 16px" }}>{p.name}</td>
              <td style={{ padding: "8px 16px" }}>{p.contactNumber}</td>
              <td style={{ padding: "8px 16px" }}>{p.email}</td>
              <td style={{ padding: "8px 16px" }}>
                {formatDateTime(p.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Create Patient Modal */}
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
              onSubmit={handleCreatePatient}
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 120, damping: 15 }}
              style={{
                background: "rgba(255,255,255,0.8)",
                backdropFilter: "blur(12px)",
                padding: "2rem",
                borderRadius: "12px",
                width: "400px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              }}
            >
              <h2
                style={{
                  marginBottom: "1rem",
                  textAlign: "center",
                  color: "#111827",
                }}
              >
                Create Patient
              </h2>

              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  display: "block",
                  marginBottom: "1rem",
                  width: "100%",
                  padding: "0.6rem",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  display: "block",
                  marginBottom: "1rem",
                  width: "100%",
                  padding: "0.6rem",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
              <input
                type="text"
                placeholder="Contact Number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                required
                style={{
                  display: "block",
                  marginBottom: "1rem",
                  width: "100%",
                  padding: "0.6rem",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                style={{
                  display: "block",
                  marginBottom: "1rem",
                  width: "100%",
                  padding: "0.6rem",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  display: "block",
                  marginBottom: "1rem",
                  width: "100%",
                  padding: "0.6rem",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
              <input
                type="file"
                onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)}
                style={{
                  display: "block",
                  marginBottom: "1rem",
                  width: "100%",
                }}
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

export default AdminPatientPage;
