/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Patient interface
export interface Patient {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  doctor: string | null;
  createdAt: string;
}

// RTK Query API slice
export const patientApi = createApi({
  reducerPath: "patientApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken"); // must match stored key
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Patient"],
  endpoints: (builder) => ({
    // Fetch all patients
    getAllPatients: builder.query<{ data: Patient[]; meta?: any }, any>({
      query: (params) => ({ url: "/patient", params }),
      providesTags: ["Patient"],
    }),
    // Delete a patient
    deletePatient: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/patient/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Patient"],
    }),
  }),
});

// Export hooks
export const { useGetAllPatientsQuery, useDeletePatientMutation } = patientApi;
