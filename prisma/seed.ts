// Impor PrismaClient dari library yang dihasilkan oleh Prisma
// PrismaClient adalah jembatan antara aplikasi Anda dan database
import { PrismaClient } from "../app/generated/prisma";

// Buat instance baru dari PrismaClient
// Instance ini yang akan Anda gunakan untuk semua operasi database
const prisma = new PrismaClient();

// Definisikan fungsi async utama untuk menjalankan proses seeding
// Menggunakan async/await memungkinkan kita untuk bekerja dengan promise secara lebih bersih
async function main() {
  // Pesan ini akan muncul di terminal saat skrip mulai dijalankan
  console.log(`Memulai proses seeding...`);

  // Hapus semua data task yang ada sebelumnya untuk memastikan database bersih
  // sebelum menambahkan data baru. Ini mencegah duplikasi data jika skrip dijalankan berkali-kali.
  await prisma.task.deleteMany({});
  console.log("Data task lama berhasil dihapus.");

  // Buat beberapa data task menggunakan prisma.task.createMany()
  // Ini adalah cara yang efisien untuk membuat beberapa record dalam satu panggilan database.
  await prisma.task.createMany({
    data: [
      {
        title: "Belajar Prisma",
        description:
          "Mempelajari dasar-dasar Prisma dan cara kerjanya dengan Next.js.",
        completed: true,
      },
      {
        title: "Membuat Proyek Task Manager",
        description:
          "Menginisialisasi proyek Next.js baru dan mengkonfigurasi Prisma.",
      },
      {
        title: "Styling dengan Tailwind CSS",
        description:
          "Mengintegrasikan Tailwind CSS untuk membuat UI yang modern.",
        completed: true,
      },
      {
        title: "Membuat API Routes",
        description:
          "Membuat API endpoint untuk membuat, membaca, memperbarui, dan menghapus tasks.",
      },
      {
        title: "Deploy Aplikasi ke Vercel",
        description: "Menyebarkan aplikasi Next.js ke platform Vercel.",
      },
    ],
    // Jika ada data yang sama (berdasarkan unique constraint), lewati (skip) penambahannya.
    // Dalam kasus ini, kita sudah menghapus semua data, jadi ini hanya sebagai contoh.
    skipDuplicates: true,
  });

  // Pesan ini menandakan bahwa proses seeding telah berhasil diselesaikan
  console.log(`Proses seeding selesai.`);
}

// Panggil fungsi main dan tangani kemungkinan error
main()
  .catch((e) => {
    // Jika terjadi error selama proses seeding, error tersebut akan ditangkap di sini
    console.error("Terjadi error saat seeding database:", e);
    // Keluar dari proses dengan kode status 1, yang menandakan terjadi error
    process.exit(1);
  })
  .finally(async () => {
    // Blok finally akan selalu dijalankan, baik proses berhasil maupun gagal
    // Di sini kita memastikan koneksi ke database ditutup dengan benar
    console.log("Memutuskan koneksi prisma...");
    await prisma.$disconnect();
  });
