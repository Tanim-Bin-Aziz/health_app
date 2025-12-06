import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";
import { IDoctor } from "@/types/doctor";
import { IMeta } from "@/types/common";

export const doctorApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createDoctor: build.mutation({
      query: ({
        doctor,
        password,
        file,
      }: {
        doctor: any;
        password: string;
        file?: File | undefined;
      }) => {
        const formData = new FormData();

        const data = {
          password: password,
          doctor: doctor,
        };

        formData.append("data", JSON.stringify(data));

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
    }),
    updateDoctor: build.mutation({
      query: ({ id, data }: { id: string; data: any }) => ({
        url: `/doctor/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.doctor],
    }),

    getAllDoctors: build.query<{ doctors: IDoctor[]; meta: IMeta }, void>({
      query: () => ({
        url: "/doctor",
        method: "GET",
      }),
      providesTags: [tagTypes.doctor],
    }),

    getDoctor: build.query<IDoctor, string>({
      query: (id) => ({
        url: `/doctor/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.doctor],
    }),

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
  useGetDoctorQuery,
  useDeleteDoctorMutation,
} = doctorApi;
