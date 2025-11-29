"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getFromLocalStorage } from "@/utils/local-storage";
import { authKey } from "@/contants/authkey";

type Doctor = {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  createdAt: string;
  serial: number;
};

type SingleDoctor = {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  address: string;
  profilePhoto: string | null;
  designation: string;
  currentWorkingPlace: string;
  doctorSpecialties: any[];
  createdAt: string;
  updatedAt: string;
};

const AdminDoctorPage = () => {
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterMonth, setFilterMonth] = useState(""); // month filter
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewDoctor, setViewDoctor] = useState<SingleDoctor | null>(null);

  // Create doctor modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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

  // Fetch all doctors
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/v1/doctor", {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      const doctorsWithSerial = data.data
        .sort(
          (a: any, b: any) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
        .map((doc: any, idx: number) => ({ ...doc, serial: idx + 1 }));

      setAllDoctors(doctorsWithSerial);
      setDoctors(doctorsWithSerial);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Filter doctors
  useEffect(() => {
    let filtered = allDoctors;

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(lower) ||
          d.contactNumber.toLowerCase().includes(lower)
      );
    }

    if (filterDate) {
      filtered = filtered.filter(
        (d) => d.createdAt.split("T")[0] === filterDate
      );
    }

    if (filterMonth) {
      filtered = filtered.filter(
        (d) => new Date(d.createdAt).getMonth() + 1 === Number(filterMonth)
      );
    }

    setDoctors(filtered);
  }, [searchTerm, filterDate, filterMonth, allDoctors]);

  const handleViewDetails = async (id: string) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/v1/doctor/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setViewDoctor(data.data);
      setIsViewModalOpen(true);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

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
        headers: token ? { Authorization: `${token}` } : {},
      });

      if (!res.ok)
        throw new Error((await res.text()) || "Failed to create doctor");

      alert("Doctor created successfully!");
      setIsCreateModalOpen(false);
      fetchDoctors(); // refresh list
    } catch (err: any) {
      alert(err.message);
    }
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return `${date.toLocaleDateString("en-GB", options)} | ${date
      .toLocaleTimeString("en-GB", timeOptions)
      .replace(":", ".")}`;
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Admin Doctor List</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <p style={{ fontWeight: 500 }}>Total Doctors: {allDoctors.length}</p>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Search by name or contact"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "0.6rem 1rem",
              borderRadius: "12px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            style={{
              padding: "0.6rem 1rem",
              borderRadius: "12px",
              border: "1px solid #ccc",
            }}
          />
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            style={{
              padding: "0.6rem 1rem",
              borderRadius: "12px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">All Months</option>
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i + 1}>
                {new Date(0, i).toLocaleString("en", { month: "long" })}
              </option>
            ))}
          </select>
          <button
            onClick={() => setIsCreateModalOpen(true)}
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
        </div>
      </div>

      {loading && <p>Loading doctors...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Doctor Table */}
      <div
        style={{
          marginTop: "1rem",
          borderRadius: "12px",
          border: "1px solid #ccc",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#f2f2f2" }}>
            <tr>
              <th style={{ textAlign: "center", padding: "8px" }}>Serial</th>
              <th style={{ padding: "8px" }}>Name</th>
              <th style={{ padding: "8px" }}>Contact</th>
              <th style={{ padding: "8px" }}>Email</th>
              <th style={{ padding: "8px" }}>Created At</th>
              <th style={{ textAlign: "center", padding: "8px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((d, idx) => (
              <tr
                key={d.id}
                style={{
                  backgroundColor: idx % 2 === 0 ? "#fff" : "rgba(0,0,0,0.03)",
                  borderBottom: "1px solid #ccc",
                }}
              >
                <td style={{ textAlign: "center", padding: "8px" }}>
                  {d.serial}
                </td>
                <td style={{ padding: "8px 16px" }}>{d.name}</td>
                <td style={{ padding: "8px 16px" }}>{d.contactNumber}</td>
                <td style={{ padding: "8px 16px" }}>{d.email}</td>
                <td style={{ padding: "8px 16px" }}>
                  {formatDateTime(d.createdAt)}
                </td>
                <td style={{ textAlign: "center", padding: "8px" }}>
                  <button
                    onClick={() => handleViewDetails(d.id)}
                    style={{
                      padding: "0.3rem 0.6rem",
                      borderRadius: "6px",
                      border: "none",
                      background: "#10b981",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Doctor Modal */}
      <AnimatePresence>
        {isViewModalOpen && viewDoctor && (
          <motion.div
            key={viewDoctor.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
            onClick={() => setIsViewModalOpen(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 120, damping: 15 }}
              style={{
                background: "rgba(255,255,255,0.95)",
                padding: "2rem",
                borderRadius: "12px",
                width: "400px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              }}
            >
              <h2 style={{ marginBottom: "1rem", textAlign: "center" }}>
                Doctor Details
              </h2>
              <p>
                <strong>Name:</strong> {viewDoctor.name}
              </p>
              <p>
                <strong>Email:</strong> {viewDoctor.email}
              </p>
              <p>
                <strong>Contact:</strong> {viewDoctor.contactNumber}
              </p>
              <p>
                <strong>Address:</strong> {viewDoctor.address}
              </p>
              <p>
                <strong>Current Workplace:</strong>{" "}
                {viewDoctor.currentWorkingPlace}
              </p>
              <p>
                <strong>Designation:</strong> {viewDoctor.designation}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {formatDateTime(viewDoctor.createdAt)}
              </p>
              <p>
                <strong>Updated At:</strong>{" "}
                {formatDateTime(viewDoctor.updatedAt)}
              </p>
              <button
                onClick={() => setIsViewModalOpen(false)}
                style={{
                  marginTop: "1rem",
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  border: "none",
                  background: "#ef4444",
                  color: "#fff",
                  cursor: "pointer",
                  display: "block",
                  marginLeft: "auto",
                }}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Doctor Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div
            key="create-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsCreateModalOpen(false)}
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
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
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
                  onClick={() => setIsCreateModalOpen(false)}
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
