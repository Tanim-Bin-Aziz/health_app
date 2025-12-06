import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";

export interface Treatment {
  id: string;
  name: string;
  price: number;
  createdAt: string;
}

export const treatmentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTreatmentsPublic: build.query<Treatment[], { search?: string } | void>({
      query: (args) => {
        const q =
          args && args.search
            ? `?search=${encodeURIComponent(args.search)}`
            : "";
        return { url: `/treatment${q}`, method: "GET" };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: tagTypes.treatment as const,
                id,
              })),
              { type: tagTypes.treatment, id: "LIST" },
            ]
          : [{ type: tagTypes.treatment, id: "LIST" }],
    }),

    // Admin-only endpoints:
    createTreatment: build.mutation<Treatment, { name: string; price: number }>(
      {
        query: (body) => ({ url: `/treatment`, method: "POST", body }),
        invalidatesTags: [{ type: tagTypes.treatment, id: "LIST" }],
      }
    ),

    updateTreatmentPrice: build.mutation<
      Treatment,
      { id: string; price: number }
    >({
      query: ({ id, price }) => ({
        url: `/treatment/${id}/price`,
        method: "PATCH",
        body: { price },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: tagTypes.treatment, id: arg.id },
        { type: tagTypes.treatment, id: "LIST" },
      ],
    }),

    deleteTreatment: build.mutation<{ message?: string }, { id: string }>({
      query: ({ id }) => ({ url: `/treatment/${id}`, method: "DELETE" }),
      invalidatesTags: (result, error, arg) => [
        { type: tagTypes.treatment, id: arg.id },
        { type: tagTypes.treatment, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetTreatmentsPublicQuery,
  useCreateTreatmentMutation,
  useUpdateTreatmentPriceMutation,
  useDeleteTreatmentMutation,
} = treatmentApi;
