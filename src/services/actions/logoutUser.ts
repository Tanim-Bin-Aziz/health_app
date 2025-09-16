import { authKey } from "../../contants/authkey";
import { deleteCookies } from "./deleteCookies";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const logoutUser = async (router: AppRouterInstance) => {
  // Remove token from localStorage (client-side)
  localStorage.removeItem(authKey);

  // Delete cookies (server action)
  await deleteCookies([authKey, "refreshToken"]);

  // Redirect and refresh
  router.push("/");
  router.refresh();
};
