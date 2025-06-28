// Impor NextResponse untuk mengirim respons dari API Route
import { NextResponse } from "next/server";
// Impor instance PrismaClient yang digenerate, pastikan path-nya benar
import { PrismaClient } from "../../generated/prisma";

// Buat instance baru dari PrismaClient
const prisma = new PrismaClient();

// Handler untuk metode POST, digunakan untuk membuat task baru
export async function POST(request: Request) {
  try {
    // Ambil body dari request yang masuk dalam format JSON
    const body = await request.json();
    const { title, description } = body;

    // Lakukan validasi sederhana untuk memastikan 'title' tidak kosong
    if (!title) {
      // Jika tidak ada title, kirim respons error dengan status 400 (Bad Request)
      return new NextResponse(JSON.stringify({ error: "Title is required" }), {
        status: 400,
      });
    }

    // Gunakan Prisma Client untuk membuat entri task baru di database
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
      },
    });

    // Kirim task yang baru dibuat sebagai respons dengan status 201 (Created)
    return new NextResponse(JSON.stringify(newTask), { status: 201 });
  } catch (error) {
    // Jika terjadi kesalahan selama proses, catat error di konsol server
    console.error("Error creating task:", error);
    // Kirim respons error umum dengan status 500 (Internal Server Error)
    return new NextResponse(
      JSON.stringify({ error: "Failed to create task" }),
      { status: 500 }
    );
  }
}

// Handler untuk metode GET, digunakan untuk mengambil semua task
export async function GET() {
  try {
    // Ambil semua data task dari database
    const tasks = await prisma.task.findMany();
    // Kirim data tasks sebagai respons dengan status 200 (OK)
    return new NextResponse(JSON.stringify(tasks), { status: 200 });
  } catch (error) {
    // Jika terjadi kesalahan, catat di konsol server
    console.error("Error fetching tasks:", error);
    // Kirim respons error umum
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch tasks" }),
      { status: 500 }
    );
  }
}
