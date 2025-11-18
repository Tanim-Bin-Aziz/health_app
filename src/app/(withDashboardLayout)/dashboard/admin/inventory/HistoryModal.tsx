"use client";

import { motion } from "framer-motion";
import dayjs from "dayjs";

export default function HistoryModal({
  open,
  setOpen,
  usageHistory,
  restockHistory,
}: any) {
  if (!open) return null;

  // Calculate total available cost
  const totalUsageCost = usageHistory.reduce(
    (acc: number, u: any) => acc + u.totalCost,
    0
  );

  const totalRestockCost = restockHistory.reduce(
    (acc: number, r: any) => acc + r.totalCost,
    0
  );

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
        overflowY: "auto",
        padding: "1rem",
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
          width: "90%",
          maxWidth: "900px",
        }}
      >
        <h2 style={{ fontWeight: 700, marginBottom: "1rem" }}>
          Inventory History
        </h2>

        {/* Usage History */}
        <h3 style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>
          Usage History (Total Cost: {totalUsageCost.toFixed(2)} TK)
        </h3>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "1rem",
          }}
        >
          <thead style={{ backgroundColor: "#f2f2f2" }}>
            <tr>
              <th>#</th>
              <th>Medicine</th>
              <th>Doctor</th>
              <th>Patient</th>
              <th>Quantity Used</th>
              <th>Total Cost (TK)</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {usageHistory.map((u: any, idx: number) => (
              <tr
                key={u.id}
                style={{ backgroundColor: idx % 2 === 0 ? "#fff" : "#f9fafb" }}
              >
                <td style={{ padding: "6px", textAlign: "center" }}>
                  {idx + 1}
                </td>
                <td style={{ padding: "6px" }}>{u.inventoryItem.name}</td>
                <td style={{ padding: "6px" }}>{u.doctor.name}</td>
                <td style={{ padding: "6px" }}>{u.patient.name}</td>
                <td style={{ padding: "6px" }}>{u.quantityUsed}</td>
                <td style={{ padding: "6px" }}>{u.totalCost.toFixed(2)}</td>
                <td style={{ padding: "6px" }}>
                  {dayjs(u.usedDate).format("MMM D, YYYY | h:mm A")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Restock History */}
        <h3 style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>
          Restock History (Total Cost: {totalRestockCost.toFixed(2)} TK)
        </h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#f2f2f2" }}>
            <tr>
              <th>#</th>
              <th>Medicine</th>
              <th>Old Unit Cost</th>
              <th>New Unit Cost</th>
              <th>Quantity Added</th>
              <th>Total Cost (TK)</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {restockHistory.map((r: any, idx: number) => (
              <tr
                key={r.id}
                style={{ backgroundColor: idx % 2 === 0 ? "#fff" : "#f9fafb" }}
              >
                <td style={{ padding: "6px", textAlign: "center" }}>
                  {idx + 1}
                </td>
                <td style={{ padding: "6px" }}>{r.inventoryItem.name}</td>
                <td style={{ padding: "6px" }}>{r.oldStock}</td>
                <td style={{ padding: "6px" }}>
                  {r.oldStock + r.quantityAdded}
                </td>
                <td style={{ padding: "6px" }}>{r.oldUnitCost.toFixed(2)}</td>
                <td style={{ padding: "6px" }}>{r.unitCost.toFixed(2)}</td>
                <td style={{ padding: "6px" }}>{r.quantityAdded}</td>
                <td style={{ padding: "6px" }}>{r.totalCost.toFixed(2)}</td>
                <td style={{ padding: "6px" }}>
                  {dayjs(r.restockDate).format("MMM D, YYYY | h:mm A")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "1rem",
          }}
        >
          <button
            onClick={() => setOpen(false)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              border: "none",
              background: "#ccc",
            }}
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
