import { notFound } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormProduk from "@/components/FormProduk";
import { ubahProduk } from "@/app/admin/actions";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanUbahProduk({ params, searchParams }) {
  const { id } = await params;
  const { error: errorMsg } = (await searchParams) || {};

  const supabase = createServerClient();
  const { data: produk, error } = await supabase
    .from("produk")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !produk) {
    notFound();
  }

  const ubahProdukDenganId = ubahProduk.bind(null, id);

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Ubah produk</h1>

      {errorMsg && (
        <div className="max-w-xl rounded-lg border border-garis bg-permukaan p-3 text-sm text-bahaya">
          {errorMsg}
        </div>
      )}

      <FormProduk produk={produk} action={ubahProdukDenganId} labelTombol="Simpan perubahan" />
    </div>
  );
}
