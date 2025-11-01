import { baseApi } from "./api/baseApi";
import { patientApi } from "./api/patientApi";

export const reducer = {
  [baseApi.reducerPath]: baseApi.reducer,
  [patientApi.reducerPath]: patientApi.reducer,
};
