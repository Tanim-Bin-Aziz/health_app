/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { getFromLocalStorage } from "@/utils/local-storage";
import { authKey } from "@/contants/authkey";

type Patient = {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  createdAt: string;
  profilePhoto?: string | null;
};

const AdminPatientPage = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);

  const token = getFromLocalStorage(authKey);

  // Fetch patients
  const fetchPatients = async () => {
    try {
      setLoading(true);
      const query = searchTerm
        ? `?searchTerm=${encodeURIComponent(searchTerm)}`
        : "";
      const res = await fetch(`http://localhost:5000/api/v1/patient${query}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setPatients(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [searchTerm]);

  // Fixed patient creation
  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      // Backend expects JSON inside "data"
      formData.append(
        "data",
        JSON.stringify({
          password,
          patient: { name, email, contactNumber, address },
        })
      );

      // Optional profile photo
      if (profilePhoto) {
        formData.append("file", profilePhoto);
      }

      const res = await fetch(
        "http://localhost:5000/api/v1/user/create-patient",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: token, // auth header if needed
          },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to create patient");
      }

      const data = await res.json();
      alert("Patient created successfully!");

      // Clear form
      setName("");
      setEmail("");
      setContactNumber("");
      setAddress("");
      setPassword("");
      setProfilePhoto(null);
      setIsModalOpen(false);

      // Refresh patient list
      fetchPatients();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Admin Patient List</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <input
          type="text"
          placeholder="Search by name or contact"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "0.5rem", width: "250px" }}
        />
        <button
          onClick={() => setIsModalOpen(true)}
          style={{ padding: "0.5rem 1rem" }}
        >
          Create Patient
        </button>
      </div>

      {loading && <p>Loading patients...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table
        border={1}
        cellPadding={10}
        style={{ width: "100%", marginTop: "1rem" }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact</th>
            <th>Email</th>
            <th>Created At</th>
            <th>Profile Photo</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.contactNumber}</td>
              <td>{p.email}</td>
              <td>{new Date(p.createdAt).toLocaleString()}</td>
              <td>
                {p.profilePhoto ? (
                  <img src={p.profilePhoto} alt={p.name} width={50} />
                ) : (
                  "N/A"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <form
            onSubmit={handleCreatePatient}
            style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: "8px",
              width: "400px",
            }}
          >
            <h2>Create Patient</h2>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ display: "block", marginBottom: "1rem", width: "100%" }}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ display: "block", marginBottom: "1rem", width: "100%" }}
            />
            <input
              type="text"
              placeholder="Contact Number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
              style={{ display: "block", marginBottom: "1rem", width: "100%" }}
            />
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              style={{ display: "block", marginBottom: "1rem", width: "100%" }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ display: "block", marginBottom: "1rem", width: "100%" }}
            />
            <input
              type="file"
              onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)}
              style={{ display: "block", marginBottom: "1rem" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button type="submit">Create</button>
              <button type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminPatientPage;
