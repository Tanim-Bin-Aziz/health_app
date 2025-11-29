"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getFromLocalStorage } from "@/utils/local-storage";
import { authKey } from "@/contants/authkey";

export default function UseModal({
  open,
  setOpen,
  selectedItem,
  doctors,
  patients,
  allPatients,
  setPatients,
  fetchInventory,
}: any) {
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [searchPatient, setSearchPatient] = useState("");
  const [useQuantity, setUseQuantity] = useState<number | "">("");

  const token = getFromLocalStorage(authKey);

  useEffect(() => {
    if (!searchPatient) return setPatients(allPatients);
    const filtered = allPatients.filter(
      (p: any) =>
        p.name.toLowerCase().includes(searchPatient.toLowerCase()) ||
        p.contactNumber.includes(searchPatient)
    );
    setPatients(filtered);
  }, [searchPatient, allPatients, setPatients]);

  const handleUseItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !selectedDoctor || !selectedPatient || !useQuantity)
      return;

    if (Number(useQuantity) > selectedItem.totalStock) {
      alert(
        `Cannot use more than available stock (${selectedItem.totalStock})`
      );
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/v1/inventory/use", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ?? "",
        },
        body: JSON.stringify({
          inventoryItemId: selectedItem.id,
          doctorId: selectedDoctor,
          patientId: selectedPatient.id,
          quantityUsed: Number(useQuantity),
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Inventory used successfully!");
        setOpen(false);
        setSelectedPatient(null);
        setSelectedDoctor("");
        setUseQuantity("");
        fetchInventory();
      } else {
        alert(data.message || "Error using inventory");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 50,
      }}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        style={{
          background: "#fff",
          padding: "1.5rem",
          borderRadius: "12px",
          width: "420px",
          maxWidth: "90%",
        }}
      >
        <h2 style={{ fontWeight: 700, marginBottom: "1rem" }}>
          Use {selectedItem.name}
        </h2>
        <form
          onSubmit={handleUseItem}
          style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}
        >
          <label>Doctor</label>
          <select
            required
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">Select Doctor</option>
            {doctors.map((d: any) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <label>Patient</label>
          <input
            type="text"
            placeholder="Search patient"
            value={searchPatient}
            onChange={(e) => setSearchPatient(e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          <select
            required
            value={selectedPatient?.id || ""}
            onChange={(e) =>
              setSelectedPatient(
                patients.find((p: any) => p.id === e.target.value) || null
              )
            }
            style={{
              padding: "0.5rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">Select Patient</option>
            {patients.map((p: any) => (
              <option key={p.id} value={p.id}>
                {p.name} | {p.contactNumber}
              </option>
            ))}
          </select>

          <label>Quantity</label>
          <input
            type="number"
            required
            min={1}
            max={selectedItem.totalStock}
            value={useQuantity}
            onChange={(e) => setUseQuantity(Number(e.target.value))}
            style={{
              padding: "0.5rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.5rem",
              marginTop: "1rem",
            }}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                border: "none",
                background: "#ccc",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                border: "none",
                background: "#10b981",
                color: "#fff",
              }}
            >
              Use
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
