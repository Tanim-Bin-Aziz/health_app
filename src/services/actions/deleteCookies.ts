"use server";

import { cookies } from "next/headers";

export async function deleteCookies(keys: string[]) {
  const store = cookies();
  for (const key of keys) {
    store.delete(key);
  }
}
