// src/redux/api/doctorApi.ts
import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";
import { IDoctor } from "@/types/doctor";
import { IMeta } from "@/types/common";

export const doctorApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // CREATE doctor
    createDoctor: build.mutation({
      query: ({
        doctor,
        password,
        file,
      }: {
        doctor: any;
        password: string;
        file?: File | undefined; // Using undefined for type compatibility
      }) => {
        const formData = new FormData(); // 1. Construct the data object (password + doctor details)

        const data = {
          password: password,
          doctor: doctor,
        }; // 2. Append to 'data' key, which the backend middleware parses

        formData.append("data", JSON.stringify(data)); // 3. Append the file

        if (file) {
          formData.append("file", file);
        }

        return {
          url: "/doctor",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [tagTypes.doctor],
    }), // GET all doctors

    getAllDoctors: build.query<{ doctors: IDoctor[]; meta: IMeta }, void>({
      query: () => ({
        url: "/doctor",
        method: "GET",
      }),
      providesTags: [tagTypes.doctor],
    }), // DELETE doctor

    deleteDoctor: build.mutation({
      query: (id: string) => ({
        url: `/doctor/soft/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.doctor],
    }),
  }),
});

export const {
  useCreateDoctorMutation,
  useGetAllDoctorsQuery,
  useDeleteDoctorMutation,
} = doctorApi;
