"use client";

import { useTransition } from "react";
import { hapusProduk } from "@/app/admin/actions";

export default function TombolHapus({ id, nama }) {
  const [isPending, startTransition] = useTransition();

  function handleHapus() {
    const konfirmasi = window.confirm(
      `Hapus produk "${nama}"?\n\nTindakan ini tidak dapat dibatalkan.`
    );
    if (!konfirmasi) return;

    startTransition(async () => {
      const result = await hapusProduk(id);
      if (result?.error) {
        alert(`Gagal menghapus produk: ${result.error}`);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleHapus}
      disabled={isPending}
      className="inline-flex items-center justify-center rounded-lg border border-garis bg-latar px-4 py-2.5 text-sm font-semibold text-bahaya transition-colors hover:border-bahaya disabled:opacity-50"
    >
      {isPending ? "Menghapus..." : "Hapus"}
    </button>
  );
}

