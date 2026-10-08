# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**
Baca AGENTS.md dan docs/user-stories.md bagian US-01.

Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase.

Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
Pekerjaan untuk US-01 (Katalog dari database) telah selesai.

File yang Ditambahkan & Diubah
lib/supabase/server.js & lib/supabase/index.js (Baru):
Membuat koneksi Supabase di sisi server menggunakan @supabase/supabase-js.
Mengambil SUPABASE_URL dan SUPABASE_SECRET_KEY langsung dari environment variable tanpa ekspos ke client.
app/page.jsx (Diubah):
Mengambil data produk langsung dari tabel produk di Supabase di sisi server.
Menghapus ketergantungan pada lib/data-contoh.js.
Menghapus komponen CatatanBelumAktif.
Menampilkan produk menggunakan komponen KartuProduk yang sudah ada.
Menangani kondisi jika pengambilan data gagal dengan pesan error yang jelas (text-bahaya).
Menangani kondisi jika tabel kosong dengan menampilkan tulisan "Belum ada produk".

**Perbaikan:**
Tidak ada perbaikan

## US-02 Detail produk

**Prompt:**
Baca docs/user-stories.md bagian US-02.

Ubah app/produk/[id]/page.jsx supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL, di sisi server, memakai koneksi Supabase yang sudah dibuat di lib/supabase. Kalau produk tidak ditemukan, panggil notFound(). Jangan ubah tampilannya. Hapus CatatanBelumAktif dari halaman ini, tapi biarkan tombol WhatsApp.

**Hasil:**
Pekerjaan untuk US-02 (Detail produk) telah selesai.

File yang Diubah
app/produk/[id]/page.jsx:
Mengambil satu data produk dari tabel produk di Supabase berdasarkan parameter id URL di sisi server menggunakan helper createServerClient.
Memanggil notFound() jika produk tidak ditemukan atau terjadi error saat query id.
Menghapus komponen CatatanBelumAktif dan ketergantungan pada lib/data-contoh.js.
Mempertahankan komponen <TombolWhatsApp produk={produk} /> dan seluruh tata letak tampilan tanpa mengubah kelas gaya yang ada.

**Perbaikan:**
Tidak ada perbaikan

## US-03 Pesan via WhatsApp

**Prompt:**
Baca docs/rancangan-teknis.md bagian "Pesan WhatsApp (US-03)".

Ubah components/TombolWhatsApp.jsx menjadi tautan yang membuka https://wa.me/ ke nomor di lib/toko.js, dengan pesan otomatis berisi nama dan harga produk dalam format rupiah. Pesan di-encode dengan encodeURIComponent dan dibuka di tab baru. Pertahankan tampilan tombolnya. Hapus CatatanBelumAktif yang menyebut US-03 di halaman detail produk.

**Hasil:**
Pekerjaan untuk US-03 (Pesan via WhatsApp) telah selesai.

File yang Diubah
components/TombolWhatsApp.jsx:
Mengubah elemen <button> menjadi tautan <a> dengan URL berformat https://wa.me/<nomor>?text=<pesan>.
Mengambil nomor WhatsApp dari lib/toko.js.
Pesan otomatis menyertakan nama produk dan harga dalam format rupiah (formatRupiah), yang di-encode dengan encodeURIComponent.
Membuka tautan di tab baru menggunakan atribut target="_blank" dan rel="noopener noreferrer".
Mempertahankan kelas Tailwind dan tampilan tombol seperti semula.
app/produk/[id]/page.jsx:
Memastikan komponen CatatanBelumAktif terkait US-03 sudah dihapus dari halaman detail produk.

**Perbaikan:**
Tidak ada perbaikan


## US-04 Login admin

**Prompt:**
Baca AGENTS.md bagian aturan keamanan dan docs/user-stories.md bagian US-04.

Buat login admin memakai Supabase Auth (email dan password) dengan @supabase/ssr dan cookie, memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY. Login diproses dengan Server Action di app/admin/actions.js dan disambungkan ke form di app/admin/login/page.jsx. Login berhasil diarahkan ke /admin; login gagal menampilkan pesan error yang jelas di halaman login. Buat juga tombol "Keluar" di components/NavAdmin.jsx berfungsi: mengakhiri sesi lalu kembali ke /admin/login. Jangan ubah tampilan. Hapus CatatanBelumAktif dari halaman login.

**Hasil:**
Pekerjaan untuk US-04 (Login admin) telah selesai.

File yang Ditambahkan & Diubah
lib/supabase/admin.js & lib/supabase/index.js:
Membuat helper createAdminClient menggunakan @supabase/ssr dan cookie Next.js (cookies() dari next/headers).
Menggunakan SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY dari environment variable.
app/admin/actions.js (Baru):
Membuat Server Action masuk (dan alias login) untuk memproses autentikasi email & password via supabase.auth.signInWithPassword. Jika berhasil, diarahkan ke /admin. Jika gagal, mengembalikan pesan error yang jelas (misal: "Email atau password salah.").
Membuat Server Action keluar (dan alias logout) via supabase.auth.signOut untuk mengakhiri sesi dan mengarahkan kembali ke /admin/login.
app/admin/login/page.jsx:
Menyambungkan form login ke Server Action dengan hook useActionState.
Menampilkan kotak pesan error jika login gagal.
Menghapus komponen CatatanBelumAktif tanpa mengubah tata letak atau tampilan.
components/NavAdmin.jsx:
Mengaktifkan tombol "Keluar" menggunakan form Server Action keluar.
Mempertahankan posisi dan tampilan tombol seperti semula.

**Perbaikan:**
Tidak ada perbaikan

## US-05 Ganti password

**Prompt:**
Baca docs/user-stories.md bagian US-05.

Buat Server Action ganti password di app/admin/actions.js untuk admin yang sedang login, memakai Supabase Auth. Validasi di server: password baru minimal 8 karakter dan harus sama dengan konfirmasi. Tampilkan pesan berhasil atau pesan error yang jelas di halaman. Sambungkan ke form di app/admin/password/page.jsx tanpa mengubah tampilannya. Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**

**Perbaikan:**

## US-06 Proteksi halaman admin

**Prompt:**

**Hasil:**

**Perbaikan:**

## Debugging dan fitur bonus

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.
