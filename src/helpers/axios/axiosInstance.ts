import { authKey } from "@/contants/authkey";
import setAccessToken from "@/services/actions/setAccessToken";
import { getNewAccessToken } from "@/services/auth.services";
import { IGenericErrorResponse, ResponseSuccessType } from "@/types";
import { getFromLocalStorage, setToLocalStorage } from "@/utils/local-storage";
import axios, { AxiosResponse } from "axios";

const instance = axios.create();
instance.defaults.headers.post["Content-Type"] = "application/json";
instance.defaults.headers["Accept"] = "application/json";
instance.defaults.timeout = 60000;

instance.interceptors.request.use(
  function (config) {
    const accessToken = getFromLocalStorage(authKey);

    if (accessToken) {
      config.headers.Authorization = accessToken;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response: AxiosResponse) {
    const responseObject: ResponseSuccessType = {
      data: response?.data?.data,
      meta: response?.data?.meta,
    };

    return responseObject as unknown as AxiosResponse;
  },

  async function (error) {
    const config = error.config;

    if (error?.response?.status === 500 && !config.sent) {
      config.sent = true;

      const response = await getNewAccessToken();
      const accessToken = response?.data?.accessToken;

      config.headers["Authorization"] = accessToken;

      setToLocalStorage(authKey, accessToken);
      setAccessToken(accessToken);

      return instance(config);
    }

    const responseObject: IGenericErrorResponse = {
      statusCode: error?.response?.data?.statusCode || 500,
      message: error?.response?.data?.message || "Something went wrong!!!",
      errorMessages: error?.response?.data?.message,
    };

    return Promise.reject(responseObject);
  }
);

export { instance };
