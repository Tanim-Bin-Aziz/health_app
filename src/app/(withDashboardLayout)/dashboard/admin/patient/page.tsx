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
  doctor: string | null;
};

const AdminPatientPage = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = getFromLocalStorage(authKey);
        console.log(token);
        if (!token) {
          throw new Error("No access token found. Please login first.");
        }

        const res = await fetch("http://localhost:5000/api/v1/patient", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Failed to fetch: ${res.status} ${text}`);
        }

        const data = await res.json();
        setPatients(data.data);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) return <p>Loading patients...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Admin Patient List</h1>
      <table
        border={1}
        cellPadding={10}
        style={{ width: "100%", marginTop: "1rem" }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact</th>
            <th>Created At</th>
            <th>Email</th>
            <th>Doctor</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.contactNumber}</td>
              <td>{new Date(p.createdAt).toLocaleString()}</td>
              <td>{p.email}</td>
              <td>{p.doctor || "Not Assigned"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPatientPage;
