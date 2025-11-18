"use client";

import { useEffect, useState } from "react";
import InventoryTable from "./InventoryTable";
import UseModal from "./UseModal";
import RestockModal from "./RestockModal";
import DetailsModal from "./DetailsModal";
import { getFromLocalStorage } from "@/utils/local-storage";
import { authKey } from "@/contants/authkey";

export default function InventoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [allPatients, setAllPatients] = useState<any[]>([]);

  const [useModalOpen, setUseModalOpen] = useState(false);
  const [restockModalOpen, setRestockModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);

  const [usageHistory, setUsageHistory] = useState<any[]>([]);
  const [restockHistory, setRestockHistory] = useState<any[]>([]);

  const token = getFromLocalStorage(authKey);

  // Fetch inventory
  const fetchInventory = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/inventory", {
        headers: { Authorization: token ?? "" },
      });
      const data = await res.json();
      if (data.success) setItems(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch doctors & patients
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
    fetchDoctors();
    fetchPatients();
    fetchInventory();
  }, []);

  // Fetch history for modal
  const fetchHistory = async () => {
    try {
      const usageRes = await fetch(
        "http://localhost:5000/api/v1/inventory/usage",
        { headers: { Authorization: token ?? "" } }
      );
      const restockRes = await fetch(
        "http://localhost:5000/api/v1/inventory/restocks",
        { headers: { Authorization: token ?? "" } }
      );
      const usageData = await usageRes.json();
      const restockData = await restockRes.json();
      if (usageData.success) setUsageHistory(usageData.data);
      if (restockData.success) setRestockHistory(restockData.data);
      setHistoryModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1
        style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}
      >
        🧴 Available Inventory
      </h1>

      {/* Inventory Table Component */}
      <InventoryTable
        items={items}
        setSelectedItem={setSelectedItem}
        setUseModalOpen={setUseModalOpen}
        setRestockModalOpen={setRestockModalOpen}
        setDetailsModalOpen={setDetailsModalOpen}
        fetchInventory={fetchInventory}
        fetchHistory={fetchHistory}
      />

      {/* Modals */}
      {selectedItem && (
        <>
          <UseModal
            open={useModalOpen}
            setOpen={setUseModalOpen}
            selectedItem={selectedItem}
            doctors={doctors}
            patients={patients}
            allPatients={allPatients}
            setPatients={setPatients}
            fetchInventory={fetchInventory}
          />
          <RestockModal
            open={restockModalOpen}
            setOpen={setRestockModalOpen}
            selectedItem={selectedItem}
            fetchInventory={fetchInventory}
          />
          <DetailsModal
            open={detailsModalOpen}
            setOpen={setDetailsModalOpen}
            selectedItem={selectedItem}
          />
        </>
      )}
    </div>
  );
}
