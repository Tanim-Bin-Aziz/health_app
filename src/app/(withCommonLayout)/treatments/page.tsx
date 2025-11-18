"use client";
import { useEffect, useState } from "react";

type Treatment = { id: string; name: string; price: number };

export default function TreatmentsList() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/v1/treatment")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setTreatments(d.data);
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Treatments</h2>
      <ul>
        {treatments.map((t) => (
          <li key={t.id}>
            {t.name} — {t.price} TK
          </li>
        ))}
      </ul>
    </div>
  );
}
