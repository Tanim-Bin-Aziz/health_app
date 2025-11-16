"use client";
import { useGetMyAppointmentsQuery } from "@/redux/api/appointmentApi";
import { Box } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { dateFormatter } from "@/utils/dateFormatter";
import { getTimeIn12HourFormat } from "../schedules/components/MultipleSelectFieldChip";

const PatientAppointmentsPage = () => {
  const { data } = useGetMyAppointmentsQuery({});

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Patient Name",
      flex: 1,
      renderCell: ({ row }) => {
        return row?.patient?.name;
      },
    },
    {
      field: "contactNumber",
      headerName: "Contact Number",
      flex: 1,
      renderCell: ({ row }) => {
        return row?.patient?.contactNumber;
      },
    },
    {
      field: "appointmentDate",
      headerName: "Appointment Date",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: ({ row }) => {
        return dateFormatter(row.schedule.startDate);
      },
    },
    {
      field: "appointmentTime",
      headerName: "Appointment Time",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: ({ row }) => {
        return getTimeIn12HourFormat(row?.schedule?.startDate);
      },
    },

    {
      field: "paymentStatus",
      headerName: "Payment Status",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
  ];

  return (
    <Box>
      <h1>Loading.....</h1>
    </Box>
  );
};

export default PatientAppointmentsPage;
