"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { getFromLocalStorage } from "@/utils/local-storage";
import { authKey } from "@/contants/authkey";

type InventoryItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  totalStock: number;
  unitCost: number;
  entryDate: string;
  expiryDate: string | null;
  createdAt: string;
  updatedAt: string;
};

type Doctor = {
  id: string;
  name: string;
  email: string;
};

type Patient = {
  id: string;
  name: string;
  contactNumber: string;
};

type InventoryUsage = {
  id: string;
  usedDate: string;
  quantityUsed: number;
  totalCost: number;
  inventoryItem: InventoryItem;
  doctor: Doctor;
  patient: Patient;
};

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [useModalOpen, setUseModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [searchPatient, setSearchPatient] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [useQuantity, setUseQuantity] = useState<number | "">("");

  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [usageHistory, setUsageHistory] = useState<InventoryUsage[]>([]);

  const token = getFromLocalStorage(authKey);

  const fetchInventory = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/inventory", {
        headers: { Authorization: token ?? "" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success) setItems(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/v1/doctor", {
          headers: { Authorization: token ?? "" },
        });
        const data = await res.json();
        if (data.success) setDoctors(data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/v1/patient", {
          headers: { Authorization: token ?? "" },
        });
        const data = await res.json();
        if (data.success) {
          setAllPatients(data.data);
          setPatients(data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchPatients();
  }, []);

  useEffect(() => {
    if (!searchPatient) return setPatients([]);
    const filtered = allPatients.filter(
      (p) =>
        p.name.toLowerCase().includes(searchPatient.toLowerCase()) ||
        p.contactNumber.includes(searchPatient)
    );
    setPatients(filtered);
  }, [searchPatient, allPatients]);

  const handleUseItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !selectedItem ||
      !selectedDoctor ||
      !selectedPatient ||
      !useQuantity ||
      Number(useQuantity) < 1
    )
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
        setUseModalOpen(false);
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

  const fetchHistory = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/inventory/usage", {
        headers: { Authorization: token ?? "" },
      });
      const data = await res.json();
      if (data.success) {
        setUsageHistory(data.data);
        setHistoryModalOpen(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const opts: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    return `${d.toLocaleDateString("en-GB", opts)} | ${d
      .toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(":", ".")}`;
  };

  const totalAvailableCost = items.reduce(
    (acc, item) => acc + item.totalStock * item.unitCost,
    0
  );

  const totalUsageCost = usageHistory.reduce((acc, u) => acc + u.totalCost, 0);

  return (
    <div style={{ padding: "1rem" }}>
      <h1
        style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}
      >
        🧴 Available Inventory
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <div>
          <p style={{ fontWeight: 500 }}>Total Items: {items.length}</p>
          <p style={{ fontWeight: 500 }}>
            Total Available Value: {totalAvailableCost.toFixed(2)} TK
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search medicine by name or category"
            onChange={(e) => {
              const q = e.target.value;
              if (!q) {
                fetchInventory();
                return;
              }
              const lower = q.toLowerCase();
              const filtered = items.filter(
                (it) =>
                  it.name.toLowerCase().includes(lower) ||
                  (it.category || "").toLowerCase().includes(lower)
              );
              setItems(filtered);
            }}
            style={{
              padding: "0.6rem 1rem",
              borderRadius: "12px",
              border: "1px solid #ccc",
              outline: "none",
              width: "260px",
              backdropFilter: "blur(6px)",
              background: "rgba(255,255,255,0.6)",
            }}
          />

          <div style={{ display: "flex", gap: "0.6rem" }}>
            <button
              onClick={() => fetchInventory()}
              style={{
                padding: "0.6rem 1rem",
                borderRadius: "12px",
                border: "none",
                background: "#6b7280",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Refresh
            </button>

            <button
              onClick={() => fetchHistory()}
              style={{
                padding: "0.6rem 1rem",
                borderRadius: "12px",
                border: "none",
                background: "#f59e0b",
                color: "#fff",
                cursor: "pointer",
                width: "160px",
              }}
            >
              View History
            </button>
          </div>
        </div>
      </div>

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
              <th style={{ textAlign: "center", padding: "10px" }}>#</th>
              <th style={{ padding: "10px" }}>Medicine Name</th>
              <th style={{ padding: "10px" }}>Category</th>
              <th style={{ padding: "10px" }}>Stock</th>
              <th style={{ padding: "10px" }}>Unit Cost (TK)</th>
              <th style={{ padding: "10px" }}>Total Cost (TK)</th>
              <th style={{ padding: "10px" }}>Entry Date</th>
              <th style={{ textAlign: "center", padding: "10px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={item.id}
                style={{
                  backgroundColor:
                    index % 2 === 0 ? "#fff" : "rgba(0,0,0,0.03)",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <td style={{ textAlign: "center", padding: "10px" }}>
                  {index + 1}
                </td>
                <td
                  style={{
                    padding: "10px 16px",
                    fontWeight: 600,
                    color: "#3730a3",
                  }}
                >
                  {item.name}
                </td>
                <td style={{ padding: "10px 16px" }}>
                  {item.category || "N/A"}
                </td>
                <td style={{ padding: "10px 16px" }}>{item.totalStock}</td>
                <td style={{ padding: "10px 16px" }}>
                  {item.unitCost.toFixed(2)}
                </td>
                <td style={{ padding: "10px 16px" }}>
                  {(item.unitCost * item.totalStock).toFixed(2)}
                </td>
                <td style={{ padding: "10px 16px", color: "#6b7280" }}>
                  {dayjs(item.entryDate).format("MMM D, YYYY")}
                </td>
                <td style={{ textAlign: "center", padding: "10px" }}>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setUseModalOpen(false);
                      }}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "8px",
                        border: "none",
                        background: "#4f46e5",
                        color: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setUseModalOpen(true);
                        setSelectedDoctor("");
                        setSelectedPatient(null);
                        setSearchPatient("");
                        setUseQuantity("");
                      }}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "8px",
                        border: "none",
                        background: "#10b981",
                        color: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      Use
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "#6b7280",
                  }}
                >
                  No medicines found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {useModalOpen && selectedItem && (
          <motion.div
            key="use-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setUseModalOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backdropFilter: "blur(8px)",
              backgroundColor: "rgba(0,0,0,0.32)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 60,
            }}
          >
            <motion.form
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleUseItem}
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 120, damping: 16 }}
              style={{
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(12px)",
                padding: "1.5rem",
                borderRadius: "12px",
                width: "420px",
                boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
              }}
            >
              <h2 style={{ marginBottom: "1rem", textAlign: "center" }}>
                Use `{selectedItem.name}`
              </h2>

              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                required
                style={{
                  display: "block",
                  marginBottom: "0.75rem",
                  width: "100%",
                  padding: "0.6rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              >
                <option value="">-- Select Doctor --</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.email})
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Search patient by name or phone"
                value={searchPatient}
                onChange={(e) => setSearchPatient(e.target.value)}
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  width: "100%",
                  padding: "0.6rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />

              {searchPatient && patients.length > 0 && (
                <div
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    maxHeight: "160px",
                    overflowY: "auto",
                    marginBottom: "0.5rem",
                  }}
                >
                  {patients.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedPatient(p);
                        setSearchPatient("");
                      }}
                      style={{
                        padding: "0.6rem",
                        cursor: "pointer",
                        borderBottom: "1px solid rgba(0,0,0,0.03)",
                      }}
                    >
                      {p.name} ({p.contactNumber})
                    </div>
                  ))}
                </div>
              )}

              {selectedPatient && (
                <div
                  style={{
                    padding: "0.6rem",
                    marginBottom: "0.6rem",
                    border: "1px solid #10b981",
                    background: "rgba(16,185,129,0.06)",
                    borderRadius: "8px",
                    color: "#065f46",
                  }}
                >
                  Selected Patient: {selectedPatient.name} (
                  {selectedPatient.contactNumber})
                </div>
              )}

              <input
                type="number"
                min={1}
                max={selectedItem.totalStock}
                value={useQuantity === "" ? "" : useQuantity}
                onChange={(e) =>
                  setUseQuantity(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                placeholder={`Quantity (max ${selectedItem.totalStock})`}
                required
                style={{
                  display: "block",
                  marginBottom: "1rem",
                  width: "100%",
                  padding: "0.6rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />

              <div
                style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}
              >
                <button
                  type="submit"
                  style={{
                    background: "#10b981",
                    color: "#fff",
                    padding: "0.6rem 0.8rem",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    flex: 1,
                  }}
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUseModalOpen(false);
                    setSelectedPatient(null);
                    setSelectedDoctor("");
                    setUseQuantity("");
                    setSearchPatient("");
                  }}
                  style={{
                    background: "#e5e7eb",
                    padding: "0.6rem 0.8rem",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    flex: 1,
                  }}
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedItem && !useModalOpen && (
          <motion.div
            key={selectedItem.id + "-view"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backdropFilter: "blur(8px)",
              backgroundColor: "rgba(0,0,0,0.32)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 60,
            }}
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 120, damping: 16 }}
              style={{
                background: "rgba(255,255,255,0.95)",
                padding: "1.5rem",
                borderRadius: "12px",
                width: "420px",
                boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
              }}
            >
              <h2 style={{ marginBottom: "1rem", textAlign: "center" }}>
                {selectedItem.name}
              </h2>

              <p style={{ marginBottom: "0.5rem" }}>
                <strong>Category:</strong> {selectedItem.category || "N/A"}
              </p>
              <p style={{ marginBottom: "0.5rem" }}>
                <strong>Description:</strong>{" "}
                {selectedItem.description || "N/A"}
              </p>
              <p style={{ marginBottom: "0.5rem" }}>
                <strong>Stock:</strong> {selectedItem.totalStock}
              </p>
              <p style={{ marginBottom: "0.5rem" }}>
                <strong>Unit Cost:</strong> {selectedItem.unitCost.toFixed(2)}{" "}
                TK
              </p>
              <p style={{ marginBottom: "0.5rem" }}>
                <strong>Total Cost:</strong>{" "}
                {(selectedItem.unitCost * selectedItem.totalStock).toFixed(2)}{" "}
                TK
              </p>
              <p style={{ marginBottom: "0.5rem" }}>
                <strong>Entry Date:</strong>{" "}
                {dayjs(selectedItem.entryDate).format("MMM D, YYYY")}
              </p>
              <p style={{ marginBottom: "1rem" }}>
                <strong>Expiry Date:</strong>{" "}
                {selectedItem.expiryDate
                  ? dayjs(selectedItem.expiryDate).format("MMM D, YYYY")
                  : "N/A"}
              </p>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={() => setSelectedItem(null)}
                  style={{
                    marginLeft: "auto",
                    padding: "0.5rem 0.9rem",
                    borderRadius: "8px",
                    border: "none",
                    background: "#ef4444",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {historyModalOpen && (
          <motion.div
            key="history-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setHistoryModalOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backdropFilter: "blur(8px)",
              backgroundColor: "rgba(0,0,0,0.32)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 60,
            }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 120, damping: 16 }}
              style={{
                background: "rgba(255,255,255,0.95)",
                padding: "1.25rem",
                borderRadius: "12px",
                width: "760px",
                maxHeight: "80vh",
                overflowY: "auto",
                boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
              }}
            >
              <h2 style={{ marginBottom: "1rem", textAlign: "center" }}>
                Inventory Usage History
              </h2>

              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ backgroundColor: "#f2f2f2" }}>
                  <tr>
                    <th style={{ padding: "8px", textAlign: "left" }}>#</th>
                    <th style={{ padding: "8px", textAlign: "left" }}>Date</th>
                    <th style={{ padding: "8px", textAlign: "left" }}>
                      Medicine
                    </th>
                    <th style={{ padding: "8px", textAlign: "left" }}>
                      Patient
                    </th>
                    <th style={{ padding: "8px", textAlign: "left" }}>
                      Doctor
                    </th>
                    <th style={{ padding: "8px", textAlign: "left" }}>
                      Quantity
                    </th>
                    <th style={{ padding: "8px", textAlign: "left" }}>
                      Total Cost (TK)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {usageHistory.length > 0 ? (
                    usageHistory
                      .sort(
                        (a, b) =>
                          new Date(b.usedDate).getTime() -
                          new Date(a.usedDate).getTime()
                      )
                      .map((u, idx) => (
                        <tr
                          key={u.id}
                          style={{ borderBottom: "1px solid #e5e7eb" }}
                        >
                          <td style={{ padding: "8px" }}>{idx + 1}</td>
                          <td style={{ padding: "8px" }}>
                            {dayjs(u.usedDate).format("MMM D, YYYY HH:mm")}
                          </td>
                          <td style={{ padding: "8px" }}>
                            {u.inventoryItem.name}
                          </td>
                          <td style={{ padding: "8px" }}>{u.patient.name}</td>
                          <td style={{ padding: "8px" }}>{u.doctor.name}</td>
                          <td style={{ padding: "8px" }}>{u.quantityUsed}</td>
                          <td style={{ padding: "8px" }}>
                            {u.totalCost.toFixed(2)}
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        style={{
                          textAlign: "center",
                          padding: "16px",
                          color: "#6b7280",
                        }}
                      >
                        No usage history found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {usageHistory.length > 0 && (
                <p
                  style={{
                    marginTop: "1rem",
                    textAlign: "right",
                    fontWeight: 600,
                    fontSize: "1rem",
                  }}
                >
                  Total Usage Cost: {totalUsageCost.toFixed(2)} TK
                </p>
              )}

              <div style={{ marginTop: "1rem" }}>
                <button
                  onClick={() => setHistoryModalOpen(false)}
                  style={{
                    background: "#e5e7eb",
                    padding: "0.6rem 0.9rem",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    float: "right",
                  }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
