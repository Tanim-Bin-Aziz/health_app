"use server";

import { cookies } from "next/headers";

export async function deleteCookies(keys: string[]) {
  const cookieStore = await cookies();
  keys.forEach((key) => {
    cookieStore.delete(key);
  });
}
