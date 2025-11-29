"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import logo from "../../../../public/nextdent.png";
import Image from "next/image";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Divider,
  TableContainer,
} from "@mui/material";

type Category = { id: string; name: string };
type Treatment = {
  id: string;
  name: string;
  price: number;
  category: Category;
  createdAt: string;
};

export default function TreatmentsPage() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/v1/treatment")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          const sorted = d.data.sort(
            (a: Treatment, b: Treatment) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          setTreatments(sorted);
        }
      })
      .catch(console.error);
  }, []);

  const filtered = treatments.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const categoryOrder: Record<string, number> = {};
  filtered.forEach((t, i) => {
    if (!(t.category.name in categoryOrder)) {
      categoryOrder[t.category.name] = i;
    }
  });

  const grouped: Record<string, Treatment[]> = filtered.reduce((acc, t) => {
    const cat = t.category.name;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(t);
    return acc;
  }, {} as Record<string, Treatment[]>);

  const sortedCategories = Object.keys(grouped).sort(
    (a, b) => categoryOrder[a] - categoryOrder[b]
  );

  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: "100%", maxWidth: "900px" }}
      >
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Image src={logo} width={120} height={80} alt="logo" />
        </Box>
        <Typography
          variant="body1"
          textAlign="center"
          sx={{ mb: 3, color: "text.secondary" }}
        >
          New revised treatment cost from 1st January 2025
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Treatment Cost (In BDT)
          </Typography>

          <TextField
            label="Search"
            size="small"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: "200px" }}
          />
        </Box>

        {sortedCategories.map((category) => (
          <Paper
            key={category}
            elevation={6}
            sx={{
              mb: 4,
              p: 2,
              borderRadius: 3,
              backdropFilter: "blur(14px)",
              background: "rgba(255,255,255,0.55)",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ mb: 2, textTransform: "uppercase" }}
            >
              {category}
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                      SL
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Treatment</TableCell>
                    <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>
                      Price (BDT)
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {grouped[category].map((t, index) => (
                    <motion.tr
                      key={t.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.05,
                      }}
                    >
                      <TableCell sx={{ textAlign: "center" }}>
                        {index + 1}
                      </TableCell>
                      <TableCell>{t.name}</TableCell>
                      <TableCell sx={{ textAlign: "right", fontWeight: 600 }}>
                        {t.price} TK
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        ))}
      </motion.div>
    </Box>
  );
}
