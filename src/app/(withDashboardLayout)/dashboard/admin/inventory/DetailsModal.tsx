"use client";

import { motion } from "framer-motion";
import dayjs from "dayjs";

export default function DetailsModal({ open, setOpen, selectedItem }: any) {
  if (!open || !selectedItem) return null;

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
          Details `{selectedItem.name}`
        </h2>

        <p>
          <b>Category:</b> {selectedItem.category || "N/A"}
        </p>
        <p>
          <b>Description:</b> {selectedItem.description || "N/A"}
        </p>
        <p>
          <b>Total Stock:</b> {selectedItem.totalStock}
        </p>
        <p>
          <b>Unit Cost:</b> {selectedItem.unitCost.toFixed(2)} TK
        </p>
        <p>
          <b>Total Cost:</b>{" "}
          {(selectedItem.totalStock * selectedItem.unitCost).toFixed(2)} TK
        </p>
        <p>
          <b>Entry Date:</b>{" "}
          {dayjs(selectedItem.entryDate).format("MMM D, YYYY")}
        </p>

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
