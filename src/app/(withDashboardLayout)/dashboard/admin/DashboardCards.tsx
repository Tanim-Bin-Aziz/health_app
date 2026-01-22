"use client";

import * as React from "react";
import axios from "axios";
import { Card, CardContent, Box, Typography, Chip, Grid } from "@mui/material";
import { useRouter } from "next/navigation";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Inventory2Icon from "@mui/icons-material/Inventory2";

import { getPatientStats } from "@/utils/patientStats";
import { getFromLocalStorage } from "@/utils/local-storage";
import { authKey } from "@/contants/authkey";

export default function DashboardCards() {
  const router = useRouter();

  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState({
    totalPatients: 0,
    thisMonthPatients: 0,
    growth: 0,
    totalInventory: 0,
    lowInventory: 0,
  });
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getFromLocalStorage(authKey);
        if (!token) {
          setError("Token not found. Please login again.");
          setLoading(false);
          return;
        }

        const patientRes = await axios.get(
          "http://localhost:5000/api/v1/patient",
          {
            headers: { Authorization: token },
          },
        );

        const patients = patientRes.data.data || [];
        const patientStats = getPatientStats(patients);

        const inventoryRes = await axios.get(
          "http://localhost:5000/api/v1/inventory",
          { headers: { Authorization: token } },
        );

        const inventory = inventoryRes.data.data || [];
        const lowItems = inventory.filter(
          (item: any) => item.stock <= item.lowStockThreshold,
        ).length;

        setStats({
          totalPatients: patients.length,
          thisMonthPatients: patientStats.thisMonth,
          growth: patientStats.growth,
          totalInventory: inventory.length,
          lowInventory: lowItems,
        });
      } catch (err: any) {
        console.error(err);
        setError(
          err.response?.data?.message || err.message || "Failed to fetch data",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error)
    return (
      <Typography color="error" mt={3}>
        {error}
      </Typography>
    );

  const cards = [
    {
      title: "Today's Appointments",
      value: "24",
      subtitle: "4 pending confirmations",
      badge: "+12%",
      badgeColor: "#16a34a",
      icon: <CalendarTodayIcon />,
      gradient: "linear-gradient(135deg, #2563eb, #3b82f6)",
      route: "/dashboard/admin/appointments",
    },
    {
      title: "Total Patients",
      value: loading ? "..." : stats.totalPatients,
      subtitle: loading
        ? "loading..."
        : `${stats.thisMonthPatients} new this month`,
      badge: loading ? "..." : `${stats.growth}%`,
      badgeColor: stats.growth >= 0 ? "#16a34a" : "#dc2626",
      icon: <PeopleAltIcon />,
      gradient: "linear-gradient(135deg, #06b6d4, #22d3ee)",
      route: "/dashboard/admin/patient",
    },
    {
      title: "Monthly Revenue",
      value: "$21.4K",
      subtitle: "vs. $18.6K last month",
      badge: "+15%",
      badgeColor: "#16a34a",
      icon: <TrendingUpIcon />,
      gradient: "linear-gradient(135deg, #9333ea, #a855f7)",
      route: "/revenue",
    },
    {
      title: "Inventory Items",
      value: loading ? "..." : stats.totalInventory,
      subtitle: loading
        ? "loading..."
        : `${stats.lowInventory} items need restock`,
      badge: loading ? "..." : `${stats.lowInventory} Low`,
      badgeColor: stats.lowInventory > 0 ? "#dc2626" : "#16a34a",
      icon: <Inventory2Icon />,
      gradient: "linear-gradient(135deg, #ec4899, #f472b6)",
      route: "/dashboard/admin/inventory",
    },
  ];

  return (
    <>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3}>
        {cards.map((card, i) => (
          <Grid item xs={12} md={6} lg={3} key={i}>
            <Card
              onClick={() => router.push(card.route)}
              sx={{
                borderRadius: "20px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
                position: "relative",
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Chip
                  label={card.badge}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    bgcolor: `${card.badgeColor}20`,
                    color: card.badgeColor,
                    fontWeight: 600,
                  }}
                />

                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "14px",
                    background: card.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    mb: 2,
                  }}
                >
                  {card.icon}
                </Box>

                <Typography variant="body2" color="text.secondary" mb={0.5}>
                  {card.title}
                </Typography>

                <Typography variant="h4" fontWeight={700}>
                  {card.value}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {card.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
