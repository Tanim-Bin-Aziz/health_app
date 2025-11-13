"use client";

import { useRouter } from "next/navigation";

export default function InventoryHistoryPage() {
  const router = useRouter();
  const id = router.query.id; // or use params in App Router

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Inventory History</h1>
      <p>Show history for inventory item ID: {id}</p>
      {/* Fetch and display history table here */}
    </div>
  );
}
