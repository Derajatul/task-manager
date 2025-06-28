// Impor yang diperlukan dari Next.js dan Prisma
import { NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";

// Buat instance PrismaClient
const prisma = new PrismaClient();

// Definisikan tipe untuk parameter yang diharapkan dari URL
// Dalam hal ini, kita mengharapkan 'id' sebagai string
interface Params {
  id: string;
}

// Handler untuk metode GET, untuk mengambil satu task berdasarkan ID
export async function GET(request: Request, { params }: { params: Params }) {
  try {
    // Ambil ID dari parameter URL
    const { id } = params;
    // Cari task di database yang cocok dengan ID yang diberikan
    const task = await prisma.task.findUnique({
      where: { id },
    });

    // Jika task tidak ditemukan, kirim respons 404 (Not Found)
    if (!task) {
      return new NextResponse(JSON.stringify({ error: "Task not found" }), {
        status: 404,
      });
    }

    // Jika task ditemukan, kirim datanya sebagai respons
    return new NextResponse(JSON.stringify(task), { status: 200 });
  } catch (error) {
    // Tangani error jika terjadi
    console.error("Error fetching task:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to fetch task" }), {
      status: 500,
    });
  }
}

// Handler untuk metode PATCH, untuk memperbarui sebagian data task
export async function PATCH(request: Request, { params }: { params: Params }) {
  try {
    const { id } = params;
    // Ambil data (title, description, completed) dari body request
    const body = await request.json();
    const { title, description, completed } = body;

    // Perbarui task di database berdasarkan ID
    const updatedTask = await prisma.task.update({
      where: { id },
      // Data yang akan diperbarui
      data: {
        title,
        description,
        completed,
      },
    });

    // Kirim data task yang sudah diperbarui sebagai respons
    return new NextResponse(JSON.stringify(updatedTask), { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to update task" }),
      { status: 500 }
    );
  }
}

// Handler untuk metode DELETE, untuk menghapus task
export async function DELETE(request: Request, { params }: { params: Params }) {
  try {
    const { id } = params;
    // Hapus task dari database berdasarkan ID
    await prisma.task.delete({
      where: { id },
    });

    // Kirim respons kosong dengan status 204 (No Content) yang menandakan sukses
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting task:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to delete task" }),
      { status: 500 }
    );
  }
}
