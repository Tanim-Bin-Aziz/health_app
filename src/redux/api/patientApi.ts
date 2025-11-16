import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Patient {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  doctor: string | null;
  createdAt: string;
}

export const patientApi = createApi({
  reducerPath: "patientApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Patient"],
  endpoints: (builder) => ({
    getAllPatients: builder.query<{ data: Patient[]; meta?: any }, any>({
      query: (params) => ({ url: "/patient", params }),
      providesTags: ["Patient"],
    }),

    deletePatient: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/patient/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Patient"],
    }),
  }),
});

export const { useGetAllPatientsQuery, useDeletePatientMutation } = patientApi;
