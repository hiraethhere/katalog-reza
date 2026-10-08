"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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

export async function gantiPassword(prevStateOrFormData, maybeFormData) {
  const formData =
    maybeFormData instanceof FormData
      ? maybeFormData
      : prevStateOrFormData instanceof FormData
        ? prevStateOrFormData
        : null;

  if (!formData) {
    return { error: "Data formulir tidak valid." };
  }

  const passwordBaru = formData.get("password_baru");
  const konfirmasiPassword = formData.get("konfirmasi_password");

  if (!passwordBaru || !konfirmasiPassword) {
    return { error: "Password baru dan konfirmasi password wajib diisi." };
  }

  const passwordStr = String(passwordBaru);
  const konfirmasiStr = String(konfirmasiPassword);

  if (passwordStr.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordStr !== konfirmasiStr) {
    return { error: "Konfirmasi password tidak sama dengan password baru." };
  }

  try {
    const supabase = await createAdminClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "Sesi telah berakhir atau belum login. Silakan login kembali." };
    }

    const { error } = await supabase.auth.updateUser({
      password: passwordStr,
    });

    if (error) {
      return { error: error.message };
    }

    return { sukses: "Password berhasil diganti.", success: "Password berhasil diganti." };
  } catch (err) {
    return { error: err.message || "Gagal mengganti password." };
  }
}

export const ubahPassword = gantiPassword;
export const changePassword = gantiPassword;

export async function tambahProduk(prevStateOrFormData, maybeFormData) {
  const formData =
    maybeFormData instanceof FormData
      ? maybeFormData
      : prevStateOrFormData instanceof FormData
        ? prevStateOrFormData
        : null;

  if (!formData) {
    return { error: "Data formulir tidak valid." };
  }

  const supabase = await createAdminClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Akses ditolak: Anda harus login sebagai admin untuk menambah produk." };
  }

  const nama = String(formData.get("nama") || "").trim();
  const hargaRaw = formData.get("harga");
  const harga = parseInt(hargaRaw, 10);
  const kategori = String(formData.get("kategori") || "").trim() || null;
  const foto_url = String(formData.get("foto_url") || "").trim() || null;
  const deskripsi = String(formData.get("deskripsi") || "").trim() || null;

  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }

  if (isNaN(harga) || harga < 0) {
    return { error: "Harga produk tidak valid (harus angka positif atau nol)." };
  }

  try {
    const { error } = await supabase.from("produk").insert({
      nama,
      harga,
      kategori,
      foto_url,
      deskripsi,
    });

    if (error) {
      return { error: error.message || "Gagal menyimpan produk ke database." };
    }
  } catch (err) {
    return { error: err.message || "Terjadi kesalahan saat menyimpan produk." };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export const createProduct = tambahProduk;
export const simpanProduk = tambahProduk;

export async function ubahProduk(arg1, arg2, arg3) {
  let id = null;
  let formData = null;

  if (arg1 instanceof FormData) {
    formData = arg1;
    id = formData.get("id");
  } else if (arg2 instanceof FormData) {
    if (typeof arg1 === "string" || typeof arg1 === "number") {
      id = arg1;
    }
    formData = arg2;
    if (!id) id = formData.get("id");
  } else if (arg3 instanceof FormData) {
    if (typeof arg1 === "string" || typeof arg1 === "number") {
      id = arg1;
    }
    formData = arg3;
    if (!id) id = formData.get("id");
  }

  const isActionState = arg3 instanceof FormData;

  if (!formData || !id) {
    const errorMsg = "Data formulir atau ID produk tidak valid.";
    if (isActionState) return { error: errorMsg };
    redirect("/admin");
  }

  const supabase = await createAdminClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    const errorMsg = "Akses ditolak: Anda harus login sebagai admin untuk mengubah produk.";
    if (isActionState) return { error: errorMsg };
    redirect(`/admin/produk/${id}/ubah?error=${encodeURIComponent(errorMsg)}`);
  }

  const nama = String(formData.get("nama") || "").trim();
  const hargaRaw = formData.get("harga");
  const harga = parseInt(hargaRaw, 10);
  const kategori = String(formData.get("kategori") || "").trim() || null;
  const foto_url = String(formData.get("foto_url") || "").trim() || null;
  const deskripsi = String(formData.get("deskripsi") || "").trim() || null;

  if (!nama) {
    const errorMsg = "Nama produk wajib diisi.";
    if (isActionState) return { error: errorMsg };
    redirect(`/admin/produk/${id}/ubah?error=${encodeURIComponent(errorMsg)}`);
  }

  if (isNaN(harga) || harga < 0) {
    const errorMsg = "Harga produk tidak valid (harus angka positif atau nol).";
    if (isActionState) return { error: errorMsg };
    redirect(`/admin/produk/${id}/ubah?error=${encodeURIComponent(errorMsg)}`);
  }

  try {
    const { error: updateError } = await supabase
      .from("produk")
      .update({
        nama,
        harga,
        kategori,
        foto_url,
        deskripsi,
      })
      .eq("id", id);

    if (updateError) {
      const errorMsg = updateError.message || "Gagal memperbarui produk.";
      if (isActionState) return { error: errorMsg };
      redirect(`/admin/produk/${id}/ubah?error=${encodeURIComponent(errorMsg)}`);
    }
  } catch (err) {
    const errorMsg = err.message || "Terjadi kesalahan saat memperbarui produk.";
    if (isActionState) return { error: errorMsg };
    redirect(`/admin/produk/${id}/ubah?error=${encodeURIComponent(errorMsg)}`);
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/produk/${id}/ubah`);
  revalidatePath(`/produk/${id}`);
  revalidatePath("/");
  redirect("/admin");
}

export const updateProduct = ubahProduk;
export const editProduk = ubahProduk;

export async function hapusProduk(id) {
  if (!id) {
    return { error: "ID produk tidak valid." };
  }

  const idNum = parseInt(id, 10);
  if (isNaN(idNum) || idNum <= 0) {
    return { error: "ID produk tidak valid." };
  }

  const supabase = await createAdminClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Akses ditolak: Anda harus login sebagai admin untuk menghapus produk." };
  }

  // Periksa produk ada terlebih dahulu
  const { data: produk, error: cariError } = await supabase
    .from("produk")
    .select("id")
    .eq("id", idNum)
    .maybeSingle();

  if (cariError) {
    return { error: cariError.message || "Gagal memeriksa produk." };
  }

  if (!produk) {
    return { error: "Produk tidak ditemukan." };
  }

  const { error: hapusError } = await supabase
    .from("produk")
    .delete()
    .eq("id", idNum);

  if (hapusError) {
    return { error: hapusError.message || "Gagal menghapus produk." };
  }

  revalidatePath("/admin");
  revalidatePath("/");
}

export const deleteProduct = hapusProduk;
