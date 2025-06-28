"use client"; // Tandai ini sebagai Client Component agar bisa menggunakan state dan effect.

// Impor hook useState dan useEffect dari React.
import { useState, useEffect } from "react";

// Definisikan tipe data untuk sebuah task, agar TypeScript tahu struktur datanya.
interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
}

export default function Home() {
  // State untuk menyimpan daftar task yang diambil dari API.
  const [tasks, setTasks] = useState<Task[]>([]);
  // State untuk menyimpan judul task baru dari input form.
  const [newTitle, setNewTitle] = useState("");
  // State untuk menyimpan deskripsi task baru dari input form.
  const [newDescription, setNewDescription] = useState("");

  // Fungsi untuk mengambil semua task dari API.
  const fetchTasks = async () => {
    try {
      // Lakukan request GET ke endpoint API tasks.
      const response = await fetch("/api/tasks");
      // Ubah respons menjadi format JSON.
      const data = await response.json();
      // Perbarui state 'tasks' dengan data yang diterima.
      setTasks(data);
    } catch (error) {
      // Jika terjadi error, tampilkan di konsol.
      console.error("Gagal mengambil tasks:", error);
    }
  };

  // useEffect hook akan berjalan sekali saat komponen pertama kali di-render.
  // Ini digunakan untuk mengambil data awal dari database.
  useEffect(() => {
    fetchTasks();
  }, []); // Array dependensi kosong berarti efek ini hanya berjalan sekali.

  // Handler untuk menangani penambahan task baru.
  const handleAddTask = async (e: React.FormEvent) => {
    // Mencegah perilaku default form (reload halaman).
    e.preventDefault();
    // Validasi sederhana: jangan tambahkan task jika judul kosong.
    if (!newTitle.trim()) return;

    try {
      // Kirim request POST ke API untuk membuat task baru.
      await fetch("/api/tasks", {
        method: "POST",
        // Tentukan tipe konten sebagai JSON.
        headers: {
          "Content-Type": "application/json",
        },
        // Kirim data task baru dalam format JSON.
        body: JSON.stringify({ title: newTitle, description: newDescription }),
      });
      // Setelah berhasil, ambil ulang daftar task untuk menampilkan data terbaru.
      fetchTasks();
      // Kosongkan kembali input form.
      setNewTitle("");
      setNewDescription("");
    } catch (error) {
      console.error("Gagal menambahkan task:", error);
    }
  };

  // Handler untuk mengubah status 'completed' sebuah task.
  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      // Kirim request PATCH ke API untuk memperbarui status task.
      await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        // Kirim status 'completed' yang baru (kebalikan dari status saat ini).
        body: JSON.stringify({ completed: !completed }),
      });
      // Ambil ulang daftar task untuk menampilkan perubahan.
      fetchTasks();
    } catch (error) {
      console.error("Gagal memperbarui task:", error);
    }
  };

  // Handler untuk menghapus sebuah task.
  const handleDeleteTask = async (id: string) => {
    try {
      // Kirim request DELETE ke API untuk menghapus task berdasarkan ID.
      await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });
      // Setelah berhasil, perbarui state 'tasks' dengan menyaring (menghapus) task yang ID-nya cocok.
      // Ini adalah "optimistic update" di sisi client agar UI terasa lebih responsif.
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Gagal menghapus task:", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-900 text-white">
      <h1 className="text-5xl font-bold mb-10">Task Manager</h1>

      <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Tambah Task Baru</h2>
        <form onSubmit={handleAddTask}>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Judul Task"
            className="w-full p-3 mb-4 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Deskripsi (opsional)"
            className="w-full p-3 mb-4 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Tambah Task
          </button>
        </form>
      </div>

      <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Daftar Task</h2>
        <ul>
          {tasks.map((task) => (
            <li
              key={task.id}
              className="p-4 mb-3 bg-gray-700 rounded-lg border border-gray-600 flex justify-between items-center transition-colors hover:bg-gray-600"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task.id, task.completed)}
                  className="h-6 w-6 mr-4 rounded border-gray-500 bg-gray-800 text-blue-500 focus:ring-blue-500"
                />
                <div>
                  <h3
                    className={`text-xl font-bold ${
                      task.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {task.title}
                  </h3>
                  <p
                    className={`text-gray-400 ${
                      task.completed ? "line-through" : ""
                    }`}
                  >
                    {task.description}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="px-4 py-2 bg-red-600 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Hapus
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
