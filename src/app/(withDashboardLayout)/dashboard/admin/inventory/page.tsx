/* eslint-disable react-hooks/exhaustive-deps */
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
  const [useQuantity, setUseQuantity] = useState<number>(1);

  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [usageHistory, setUsageHistory] = useState<InventoryUsage[]>([]);

  const token = getFromLocalStorage(authKey);

  // ---------------------- Fetch Inventory ----------------------
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

  // ---------------------- Fetch Doctors ----------------------
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

  // ---------------------- Fetch Patients ----------------------
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

  // ---------------------- Filter Patients ----------------------
  useEffect(() => {
    if (!searchPatient) return setPatients([]);
    const filtered = allPatients.filter(
      (p) =>
        p.name.toLowerCase().includes(searchPatient.toLowerCase()) ||
        p.contactNumber.includes(searchPatient)
    );
    setPatients(filtered);
  }, [searchPatient, allPatients]);

  // ---------------------- Use Item Submit ----------------------
  const handleUseItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !selectedDoctor || !selectedPatient || useQuantity < 1)
      return;

    if (useQuantity > selectedItem.totalStock) {
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
          quantityUsed: useQuantity,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Inventory used successfully!");
        setUseModalOpen(false);
        setSelectedPatient(null);
        setSelectedDoctor("");
        setUseQuantity(1);
        fetchInventory(); // <-- refresh table stock dynamically
      } else {
        alert(data.message || "Error using inventory");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------------- Fetch Usage History ----------------------
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

  // ---------------------- Render ----------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <motion.div
        className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-6 border border-gray-200"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          🧴 Available Medicine List
        </h1>

        {/* History Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={fetchHistory}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition-all"
          >
            View History
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">#</th>
                <th className="py-3 px-4 text-left">Medicine Name</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Stock</th>
                <th className="py-3 px-4 text-left">Unit Cost ($)</th>
                <th className="py-3 px-4 text-left">Total Cost ($)</th>
                <th className="py-3 px-4 text-left">Entry Date</th>
                <th className="py-3 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-indigo-50 transition-all"
                >
                  <td className="py-3 px-4 font-medium text-gray-700">
                    {index + 1}
                  </td>
                  <td className="py-3 px-4 font-semibold text-indigo-700">
                    {item.name}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {item.category || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-gray-700">{item.totalStock}</td>
                  <td className="py-3 px-4 text-gray-700">
                    {item.unitCost.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {(item.unitCost * item.totalStock).toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-gray-500">
                    {dayjs(item.entryDate).format("MMM D, YYYY")}
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg transition-all"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setUseModalOpen(true);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg transition-all"
                    >
                      Use
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-6 text-gray-500 font-medium"
                  >
                    No medicines found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Use Modal */}
        <AnimatePresence>
          {useModalOpen && selectedItem && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.form
                className="bg-white rounded-2xl shadow-lg p-6 w-96 flex flex-col gap-3"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                onSubmit={handleUseItem}
              >
                <h2 className="text-xl font-bold mb-2">
                  Use `{selectedItem.name}`
                </h2>

                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2"
                  required
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
                  className="border border-gray-300 rounded-lg p-2"
                />

                {searchPatient && patients.length > 0 && (
                  <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto mt-1">
                    {patients.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSelectedPatient(p);
                          setSearchPatient("");
                        }}
                        className="p-2 hover:bg-indigo-100 cursor-pointer"
                      >
                        {p.name} ({p.contactNumber})
                      </div>
                    ))}
                  </div>
                )}

                {selectedPatient && (
                  <div className="p-2 mt-2 border border-green-400 rounded-lg bg-green-50 text-green-800">
                    Selected Patient: {selectedPatient.name} (
                    {selectedPatient.contactNumber})
                  </div>
                )}

                {/* Quantity Input */}
                <input
                  type="number"
                  min={1}
                  max={selectedItem.totalStock}
                  value={useQuantity}
                  onChange={(e) => setUseQuantity(parseInt(e.target.value))}
                  className="border border-gray-300 rounded-lg p-2"
                  placeholder={`Quantity (max ${selectedItem.totalStock})`}
                  required
                />

                <div className="flex justify-between mt-3">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg w-1/2"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUseModalOpen(false);
                      setSelectedPatient(null);
                      setSelectedDoctor("");
                      setUseQuantity(1);
                      setSearchPatient("");
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-1.5 rounded-lg w-1/2 ml-2"
                  >
                    Cancel
                  </button>
                </div>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View Details Modal */}
        <AnimatePresence>
          {selectedItem && !useModalOpen && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-lg p-6 w-96"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                <h2 className="text-2xl font-bold text-indigo-700 mb-3">
                  {selectedItem.name}
                </h2>
                <p className="text-gray-700 mb-1">
                  <span className="font-semibold">Category:</span>{" "}
                  {selectedItem.category || "N/A"}
                </p>
                <p className="text-gray-700 mb-1">
                  <span className="font-semibold">Description:</span>{" "}
                  {selectedItem.description || "N/A"}
                </p>
                <p className="text-gray-700 mb-1">
                  <span className="font-semibold">Stock:</span>{" "}
                  {selectedItem.totalStock}
                </p>
                <p className="text-gray-700 mb-1">
                  <span className="font-semibold">Unit Cost:</span> $
                  {selectedItem.unitCost.toFixed(2)}
                </p>
                <p className="text-gray-700 mb-1">
                  <span className="font-semibold">Total Cost:</span> $
                  {(selectedItem.unitCost * selectedItem.totalStock).toFixed(2)}
                </p>
                <p className="text-gray-700 mb-3">
                  <span className="font-semibold">Entry Date:</span>{" "}
                  {dayjs(selectedItem.entryDate).format("MMM D, YYYY")}
                </p>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-1.5 rounded-lg w-full mt-2 transition-all"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History Modal */}
        <AnimatePresence>
          {historyModalOpen && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-lg p-6 w-[700px] max-h-[80vh] overflow-y-auto"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                <h2 className="text-2xl font-bold text-indigo-700 mb-4">
                  Inventory Usage History
                </h2>

                <table className="w-full border-collapse">
                  <thead className="bg-indigo-600 text-white">
                    <tr>
                      <th className="py-2 px-3">#</th>
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Medicine</th>
                      <th className="py-2 px-3">Patient</th>
                      <th className="py-2 px-3">Doctor</th>
                      <th className="py-2 px-3">Quantity</th>
                      <th className="py-2 px-3">Total Cost ($)</th>
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
                            className="border-b hover:bg-indigo-50 transition-all"
                          >
                            <td className="py-2 px-3">{idx + 1}</td>
                            <td className="py-2 px-3">
                              {dayjs(u.usedDate).format("MMM D, YYYY HH:mm")}
                            </td>
                            <td className="py-2 px-3">
                              {u.inventoryItem.name}
                            </td>
                            <td className="py-2 px-3">{u.patient.name}</td>
                            <td className="py-2 px-3">{u.doctor.name}</td>
                            <td className="py-2 px-3">{u.quantityUsed}</td>
                            <td className="py-2 px-3">
                              {u.totalCost.toFixed(2)}
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="text-center py-4 text-gray-500"
                        >
                          No usage history found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <button
                  onClick={() => setHistoryModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-1.5 rounded-lg w-full mt-4 transition-all"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
