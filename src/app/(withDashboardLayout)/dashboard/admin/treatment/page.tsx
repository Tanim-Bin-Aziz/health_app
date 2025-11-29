"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { getFromLocalStorage } from "@/utils/local-storage";
import { authKey } from "@/contants/authkey";

type Category = {
  id: string;
  name: string;
  createdAt: string;
};

type Treatment = {
  id: string;
  name: string;
  price: number;
  createdAt: string;
  category: Category;
};

export default function TreatmentsAdminPage() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Treatment | null>(null);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState<number | "">("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | "">("");
  const [editPrice, setEditPrice] = useState<number | "">("");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const token = getFromLocalStorage(authKey);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/category", {
        headers: { Authorization: token ?? "" },
      });
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch all treatments (SORTED)
  const fetchTreatments = async (q = "") => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/treatment${
          q ? `?search=${encodeURIComponent(q)}` : ""
        }`,
        {
          headers: { Authorization: token ?? "" },
        }
      );
      const data = await res.json();

      if (data.success) {
        setTreatments(
          data.data.sort(
            (a: Treatment, b: Treatment) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTreatments();
  }, []);

  useEffect(() => {
    if (search === "") {
      fetchTreatments();
      return;
    }
    const lower = search.toLowerCase();
    const filtered = treatments.filter((t) =>
      t.name.toLowerCase().includes(lower)
    );
    setTreatments(filtered);
  }, [search]);

  // Create new category
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName || !newCategoryName.trim())
      return alert("Category name required");

    try {
      const res = await fetch("http://localhost:5000/api/v1/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ?? "",
        },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setNewCategoryName("");
        setIsCategoryModalOpen(false);
        fetchCategories();
        alert("Category created");
      } else {
        alert(data.message || "Error");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create new treatment
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || newPrice === "" || !selectedCategoryId)
      return alert("Name, price and category are required");

    try {
      const res = await fetch("http://localhost:5000/api/v1/treatment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ?? "",
        },
        body: JSON.stringify({
          name: newName,
          price: Number(newPrice),
          categoryId: selectedCategoryId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewName("");
        setNewPrice("");
        setSelectedCategoryId("");
        fetchTreatments();
        alert("Treatment created");
      } else {
        alert(data.message || "Error");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (t: Treatment) => {
    setSelected(t);
    setEditPrice(t.price);
  };

  const handleUpdatePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || editPrice === "") return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/treatment/${selected.id}/price`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ?? "",
          },
          body: JSON.stringify({ price: Number(editPrice) }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setSelected(null);
        setEditPrice("");
        fetchTreatments();
        alert("Updated price");
      } else {
        alert(data.message || "Error updating");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this treatment?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/v1/treatment/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token ?? "",
        },
      });
      const data = await res.json();
      if (data.success) {
        fetchTreatments();
        alert("Deleted");
      } else {
        alert(data.message || "Error deleting");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ minHeight: "80vh", padding: "1rem" }}>
      <h1 style={{ fontWeight: 700, fontSize: "1.5rem" }}>
        Treatments Management
      </h1>

      {/* Create form */}
      <form
        onSubmit={handleCreate}
        style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}
      >
        <input
          placeholder="Treatment name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          style={{ padding: 8, borderRadius: 8, border: "1px solid #ccc" }}
        />
        <input
          type="number"
          placeholder="Price"
          value={newPrice === "" ? "" : newPrice}
          onChange={(e) =>
            setNewPrice(e.target.value === "" ? "" : Number(e.target.value))
          }
          style={{
            padding: 8,
            borderRadius: 8,
            border: "1px solid #ccc",
            width: 120,
          }}
        />

        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          style={{ padding: 8, borderRadius: 8, border: "1px solid #ccc" }}
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => setIsCategoryModalOpen(true)}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            background: "#f59e0b",
            color: "#fff",
            border: "none",
          }}
        >
          Add Category
        </button>

        <button
          type="submit"
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            background: "#4f46e5",
            color: "#fff",
            border: "none",
          }}
        >
          Add Treatment
        </button>
      </form>

      {/* Search and info */}
      <div
        style={{
          marginTop: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <div>
          <p style={{ margin: 0, fontWeight: 600 }}>
            Total: {treatments.length}
          </p>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <input
            placeholder="Search treatment by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: 8,
              borderRadius: 8,
              border: "1px solid #ccc",
              width: 260,
            }}
          />
          <button
            onClick={() => {
              fetchTreatments();
              fetchCategories();
            }}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              background: "#6b7280",
              color: "#fff",
              border: "none",
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Treatments table */}
      <div
        style={{
          marginTop: 12,
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f9fafb" }}>
            <tr>
              <th style={{ padding: 10 }}>#</th>
              <th style={{ padding: 10 }}>Name</th>
              <th style={{ padding: 10 }}>Category</th>
              <th style={{ padding: 10 }}>Price (TK)</th>
              <th style={{ padding: 10 }}>Date</th>
              <th style={{ padding: 10 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {treatments.map((t, i) => (
              <tr
                key={t.id}
                style={{
                  borderBottom: "1px solid #eee",
                  background: i % 2 === 0 ? "#fff" : "rgba(0,0,0,0.02)",
                }}
              >
                <td style={{ padding: 10, textAlign: "center" }}>{i + 1}</td>
                <td style={{ padding: 10, fontWeight: 600, color: "#374151" }}>
                  {t.name}
                </td>
                <td style={{ padding: 10 }}>{t.category?.name ?? "-"}</td>
                <td style={{ padding: 10 }}>{t.price}</td>
                <td style={{ padding: 10 }}>
                  {dayjs(t.createdAt).format("MMM D, YYYY")}
                </td>
                <td style={{ padding: 10, textAlign: "center" }}>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      justifyContent: "center",
                    }}
                  >
                    <button
                      onClick={() => openEdit(t)}
                      style={{
                        padding: "6px 8px",
                        borderRadius: 8,
                        background: "#10b981",
                        color: "#fff",
                        border: "none",
                      }}
                    >
                      Update Price
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      style={{
                        padding: "6px 8px",
                        borderRadius: 8,
                        background: "#ef4444",
                        color: "#fff",
                        border: "none",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {treatments.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  style={{ padding: 20, textAlign: "center", color: "#6b7280" }}
                >
                  No treatments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit modal */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.32)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 60,
          }}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleUpdatePrice}
            style={{
              background: "#fff",
              padding: 18,
              borderRadius: 12,
              width: 360,
            }}
          >
            <h3 style={{ marginTop: 0 }}>Update Price — {selected.name}</h3>
            <input
              type="number"
              value={editPrice === "" ? "" : editPrice}
              onChange={(e) =>
                setEditPrice(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "1px solid #ccc",
              }}
            />
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 8,
                  background: "#4f46e5",
                  color: "#fff",
                  border: "none",
                }}
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setSelected(null)}
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 8,
                  background: "#e5e7eb",
                  border: "none",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category modal */}
      {isCategoryModalOpen && (
        <div
          onClick={() => setIsCategoryModalOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.32)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 70,
          }}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleCreateCategory}
            style={{
              background: "#fff",
              padding: 18,
              borderRadius: 12,
              width: 360,
            }}
          >
            <h3 style={{ marginTop: 0 }}>Create Category</h3>
            <input
              placeholder="Category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "1px solid #ccc",
                marginBottom: 12,
              }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 8,
                  background: "#f59e0b",
                  color: "#fff",
                  border: "none",
                }}
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 8,
                  background: "#e5e7eb",
                  border: "none",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
