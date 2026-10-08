"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

export async function masuk(prevStateOrFormData, maybeFormData) {
  const formData =
    maybeFormData instanceof FormData
      ? maybeFormData
      : prevStateOrFormData instanceof FormData
        ? prevStateOrFormData
        : null;

  if (!formData) {
    return { error: "Data formulir tidak valid." };
  }

  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  try {
    const supabase = await createAdminClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: String(email).trim(),
      password: String(password),
    });

    if (error) {
      if (
        error.message === "Invalid login credentials" ||
        error.message.toLowerCase().includes("invalid login credentials")
      ) {
        return { error: "Email atau password salah." };
      }
      return { error: error.message };
    }
  } catch (err) {
    return { error: err.message || "Gagal masuk. Silakan coba lagi." };
  }

  redirect("/admin");
}

export const login = masuk;

export async function keluar() {
  try {
    const supabase = await createAdminClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.error("Gagal keluar:", err);
  }

  redirect("/admin/login");
}

export const logout = keluar;

