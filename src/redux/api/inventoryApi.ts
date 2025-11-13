// redux/api/inventoryApi.ts
import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";

export interface InventoryItem {
  id: string;
  name: string;
  category?: string;
  description?: string;
  totalStock?: number;
  unitCost?: number;
}

export interface RestockItem {
  id: string;
  inventoryItem: InventoryItem;
  supplierName?: string;
  quantityAdded: number;
  unitCost: number;
  totalCost: number;
  restockDate: string;
}

export const inventoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getInventoryItems: build.query<InventoryItem[], void>({
      query: () => ({ url: "/inventory", method: "GET" }),
      providesTags: [tagTypes.inventory],
    }),
    getRestocks: build.query<RestockItem[], void>({
      query: () => ({ url: "/inventory/restocks", method: "GET" }),
      providesTags: [tagTypes.inventory],
    }),
    addRestock: build.mutation<RestockItem, Partial<RestockItem>>({
      query: (data) => ({
        url: "/inventory/restock",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.inventory],
    }),
  }),
});

export const {
  useGetInventoryItemsQuery,
  useGetRestocksQuery,
  useAddRestockMutation,
} = inventoryApi;
