"use client";

import { useEffect, useState } from "react";

interface InventoryUsageHistory {
  id: string;
  inventoryItem: { name: string };
  doctor: { name: string };
  patient: { name: string };
  quantityUsed: number;
  totalCost: number;
  usedDate: string;
}

interface InventoryRestockHistory {
  id: string;
  inventoryItem: { name: string };
  quantityAdded: number;
  unitCost: number;
  oldUnitCost: number;
  totalCost: number;
  restockDate: string;
}

export default function InventoryHistoryPage() {
  const [activeTab, setActiveTab] = useState<"usage" | "restock">("usage");
  const [usageHistory, setUsageHistory] = useState<InventoryUsageHistory[]>([]);
  const [restockHistory, setRestockHistory] = useState<
    InventoryRestockHistory[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("No authorization token found.");
        setLoading(false);
        return;
      }

      try {
        // Fetch usage history
        const usageRes = await fetch(
          "http://localhost:5000/api/v1/inventory/usage",
          {
            headers: { Authorization: ` ${token}` },
          }
        );
        const usageData = await usageRes.json();

        // Fetch restock history
        const restockRes = await fetch(
          "http://localhost:5000/api/v1/inventory/restocks",
          {
            headers: { Authorization: `${token}` },
          }
        );
        const restockData = await restockRes.json();

        console.log("Usage data:", usageData);
        console.log("Restock data:", restockData);

        if (usageData.success) setUsageHistory(usageData.data);
        else console.error("Usage history fetch failed", usageData);

        if (restockData.success) setRestockHistory(restockData.data);
        else console.error("Restock history fetch failed", restockData);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch history from server.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading history...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>
        Inventory History
      </h1>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <button
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            background: activeTab === "usage" ? "#f59e0b" : "#ccc",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => setActiveTab("usage")}
        >
          Usage History
        </button>
        <button
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            background: activeTab === "restock" ? "#f59e0b" : "#ccc",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => setActiveTab("restock")}
        >
          Restock History
        </button>
      </div>

      {/* Table */}
      {activeTab === "usage" ? (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th style={{ padding: "8px" }}>Item</th>
              <th style={{ padding: "8px" }}>Doctor</th>
              <th style={{ padding: "8px" }}>Patient</th>
              <th style={{ padding: "8px" }}>Quantity Used</th>
              <th style={{ padding: "8px" }}>Total Cost</th>
              <th style={{ padding: "8px" }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {usageHistory.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "8px" }}>
                  No usage history found.
                </td>
              </tr>
            ) : (
              usageHistory.map((u) => (
                <tr
                  key={u.id}
                  style={{
                    textAlign: "center",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <td style={{ padding: "6px" }}>{u.inventoryItem.name}</td>
                  <td style={{ padding: "6px" }}>{u.doctor.name}</td>
                  <td style={{ padding: "6px" }}>{u.patient.name}</td>
                  <td style={{ padding: "6px" }}>{u.quantityUsed}</td>
                  <td style={{ padding: "6px" }}>{u.totalCost.toFixed(2)}</td>
                  <td style={{ padding: "6px" }}>
                    {new Date(u.usedDate).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th style={{ padding: "8px" }}>Item</th>
              <th style={{ padding: "8px" }}>Old Unit Cost</th>
              <th style={{ padding: "8px" }}>Unit Cost</th>
              <th style={{ padding: "8px" }}>Quantity Added</th>
              <th style={{ padding: "8px" }}>Total Cost</th>
              <th style={{ padding: "8px" }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {restockHistory.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "8px" }}>
                  No restock history found.
                </td>
              </tr>
            ) : (
              restockHistory.map((r) => (
                <tr
                  key={r.id}
                  style={{
                    textAlign: "center",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <td style={{ padding: "6px" }}>{r.inventoryItem.name}</td>
                  <td style={{ padding: "6px" }}>
                    {r.oldUnitCost?.toFixed(2)}
                  </td>
                  <td style={{ padding: "6px" }}>{r.unitCost.toFixed(2)}</td>
                  <td style={{ padding: "6px" }}>{r.quantityAdded}</td>
                  <td style={{ padding: "6px" }}>{r.totalCost.toFixed(2)}</td>
                  <td style={{ padding: "6px" }}>
                    {new Date(r.restockDate).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
