"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { getFromLocalStorage } from "@/utils/local-storage";
import { authKey } from "@/contants/authkey";

export default function RestockModal({
  open,
  setOpen,
  selectedItem,
  fetchInventory,
}: any) {
  const [restockQuantity, setRestockQuantity] = useState<number | "">("");
  const [restockUnitCost, setRestockUnitCost] = useState<number | "">("");

  const token = getFromLocalStorage(authKey);

  const handleRestockItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !selectedItem ||
      !restockQuantity ||
      !restockUnitCost ||
      Number(restockQuantity) < 1 ||
      Number(restockUnitCost) <= 0
    )
      return;

    try {
      const finalUnitCost = Number(Number(restockUnitCost).toFixed(2)); // round only here

      const res = await fetch(
        "http://localhost:5000/api/v1/inventory/restock",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ?? "",
          },
          body: JSON.stringify({
            inventoryItemId: selectedItem.id,
            quantityAdded: Number(restockQuantity),
            unitCost: finalUnitCost,
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        alert("Inventory restocked successfully!");
        setOpen(false);
        setRestockQuantity("");
        setRestockUnitCost("");
        fetchInventory();
      } else {
        alert(data.message || "Error restocking inventory");
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
          Restock `{selectedItem.name}`
        </h2>
        <form
          onSubmit={handleRestockItem}
          style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}
        >
          <label>Quantity Added</label>
          <input
            type="number"
            required
            min={1}
            value={restockQuantity}
            onChange={(e) =>
              setRestockQuantity(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            style={{
              padding: "0.5rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />

          <label>Unit Cost (TK)</label>
          <input
            type="number"
            required
            min={0}
            step={0}
            value={restockUnitCost}
            onChange={(e) =>
              setRestockUnitCost(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
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
                background: "#f59e0b",
                color: "#fff",
              }}
            >
              Restock
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
