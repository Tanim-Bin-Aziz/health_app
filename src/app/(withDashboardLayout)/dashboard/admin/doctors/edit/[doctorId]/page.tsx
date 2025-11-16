"use client";

import React from "react";
import PHForm from "@/components/Forms/PHForm";
import PHInput from "@/components/Forms/PHInput";
import PHSelectField from "@/components/Forms/PHSelectField";
import {
  useGetDoctorQuery,
  useUpdateDoctorMutation,
} from "@/redux/api/doctorApi";
import { Gender } from "@/types";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";

type TParams = {
  params: Promise<{ doctorId: string }>;
};

const DoctorUpdatePage = ({ params }: TParams) => {
  const router = useRouter();

  // Unwrap params
  const { doctorId } = React.use(params);

  // Skip query until doctorId exists
  const { data, isLoading } = useGetDoctorQuery(doctorId, { skip: !doctorId });
  const [updateDoctor] = useUpdateDoctorMutation();

  const handleFormSubmit = async (values: FieldValues) => {
    values.experience = Number(values.experience);
    values.apointmentFee = Number(values.apointmentFee);
    values.id = doctorId;

    try {
      const res = await updateDoctor({ id: values.id, body: values }).unwrap();
      if (res?.id) {
        toast.success("Doctor Updated Successfully!!!");
        router.push("/dashboard/admin/doctors");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || err?.message || "Update failed");
    }
  };

  const defaultValues = {
    email: data?.email ?? "",
    name: data?.name ?? "",
    contactNumber: data?.contactNumber ?? "",
    address: data?.address ?? "",
    registrationNumber: data?.registrationNumber ?? "",
    gender: data?.gender ?? "",
    experience: data?.experience ?? 0,
    apointmentFee: data?.apointmentFee ?? 0,
    qualification: data?.qualification ?? "",
    currentWorkingPlace: data?.currentWorkingPlace ?? "",
    designation: data?.designation ?? "",
  };

  return (
    <Box>
      <Typography component="h5" variant="h5">
        Update Doctor Info
      </Typography>

      {isLoading ? (
        "Loading..."
      ) : (
        <PHForm
          key={String(data?.id ?? doctorId ?? "new")}
          onSubmit={handleFormSubmit}
          defaultValues={defaultValues}
        >
          <Grid container spacing={2} sx={{ my: 5 }}>
            <Grid item xs={12} sm={12} md={4}>
              <PHInput name="name" label="Name" fullWidth sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <PHInput
                name="email"
                type="email"
                label="Email"
                fullWidth
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <PHInput
                name="contactNumber"
                label="Contact Number"
                fullWidth
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <PHInput
                name="address"
                label="Address"
                fullWidth
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <PHInput
                name="registrationNumber"
                label="Registration Number"
                fullWidth
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <PHInput
                name="experience"
                type="number"
                label="Experience"
                fullWidth
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <PHSelectField
                items={Gender}
                name="gender"
                label="Gender"
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <PHInput
                name="apointmentFee"
                type="number"
                label="Appointment Fee"
                fullWidth
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <PHInput
                name="qualification"
                label="Qualification"
                fullWidth
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <PHInput
                name="currentWorkingPlace"
                label="Current Working Place"
                fullWidth
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <PHInput
                name="designation"
                label="Designation"
                fullWidth
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>

          <Button type="submit">Update</Button>
        </PHForm>
      )}
    </Box>
  );
};

export default DoctorUpdatePage;
