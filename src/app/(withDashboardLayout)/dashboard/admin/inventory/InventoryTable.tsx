"use client";

import React, { useState } from "react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

export default function InventoryTable({
  items,
  setSelectedItem,
  setUseModalOpen,
  setRestockModalOpen,
  setDetailsModalOpen,
  fetchInventory,
  fetchHistory,
}: any) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = items.filter(
    (item: any) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAvailableCost = items.reduce(
    (acc: number, item: any) => acc + item.totalStock * item.unitCost,
    0
  );

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <div>Total Medicines: {items.length}</div>
        <div>Total Cost: {totalAvailableCost.toFixed(2)} TK</div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          marginBottom: "1rem",
        }}
      >
        <input
          type="text"
          placeholder="Search medicine by name or category"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "0.6rem 1rem",
            borderRadius: "12px",
            border: "1px solid #ccc",
            width: "260px",
          }}
        />
        <button
          onClick={fetchInventory}
          style={{
            padding: "0.6rem 1rem",
            borderRadius: "12px",
            background: "#6b7280",
            color: "#fff",
          }}
        >
          Refresh
        </button>
        <button
          onClick={() => router.push("/dashboard/admin/inventory/history")}
          style={{
            padding: "0.6rem 1rem",
            borderRadius: "12px",
            background: "#f59e0b",
            color: "#fff",
          }}
        >
          View History
        </button>
      </div>

      <div
        style={{
          marginTop: "1rem",
          borderRadius: "12px",
          border: "1px solid #ccc",
          overflow: "hidden",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead style={{ backgroundColor: "#f2f2f2" }}>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Unit Cost</th>
              <th>Total Cost</th>
              <th>Entry Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item: any, i: number) => (
              <tr
                key={item.id}
                style={{
                  backgroundColor: i % 2 === 0 ? "#fff" : "#f9fafb",
                  textAlign: "center",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <td style={{ padding: "0.5rem" }}>{i + 1}</td>
                <td style={{ padding: "0.5rem" }}>{item.name}</td>
                <td style={{ padding: "0.5rem" }}>{item.category || "N/A"}</td>
                <td style={{ padding: "0.5rem" }}>{item.totalStock}</td>
                <td style={{ padding: "0.5rem" }}>
                  {item.unitCost.toFixed(2)}
                </td>
                <td style={{ padding: "0.5rem" }}>
                  {(item.unitCost * item.totalStock).toFixed(2)}
                </td>
                <td style={{ padding: "0.5rem" }}>
                  {dayjs(item.entryDate).format("MMM D, YYYY")}
                </td>
                <td style={{ padding: "0.5rem" }}>
                  <button
                    style={{
                      padding: "0.3rem 0.6rem",
                      borderRadius: "6px",
                      border: "none",
                      background: "#4A70A9",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setSelectedItem(item);
                      setDetailsModalOpen(true);
                    }}
                  >
                    View
                  </button>{" "}
                  <button
                    style={{
                      padding: "0.3rem 0.6rem",
                      borderRadius: "6px",
                      border: "none",
                      background: "#DC143C  ",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setSelectedItem(item);
                      setUseModalOpen(true);
                    }}
                  >
                    Use
                  </button>{" "}
                  <button
                    style={{
                      padding: "0.3rem 0.6rem",
                      borderRadius: "6px",
                      border: "none",
                      background: "#10b981",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setSelectedItem(item);
                      setRestockModalOpen(true);
                    }}
                  >
                    Restock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
