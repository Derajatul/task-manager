# Task Manager

Aplikasi manajemen tugas (task manager) modern yang dibangun dengan Next.js, TypeScript, Prisma, dan PostgreSQL. Aplikasi ini memungkinkan pengguna untuk membuat, mengelola, dan melacak tugas-tugas mereka dengan antarmuka yang responsif dan user-friendly.

## 🚀 Fitur

- ✅ **CRUD Operations** - Buat, baca, perbarui, dan hapus tugas
- 📝 **Task Management** - Kelola judul, deskripsi, dan status penyelesaian tugas
- 🎯 **Status Tracking** - Tandai tugas sebagai selesai atau belum selesai
- 📱 **Responsive Design** - Tampilan yang optimal di desktop dan mobile
- 🔄 **Real-time Updates** - Perubahan data langsung terlihat tanpa refresh halaman
- 🗄️ **Database Integration** - Menggunakan PostgreSQL dengan Prisma ORM

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **API**: Next.js API Routes
- **Development**: ESLint, tsx

## 📋 Prerequisites

Pastikan Anda telah menginstal:

- Node.js (versi 18 atau lebih tinggi)
- npm, yarn, pnpm, atau bun
- PostgreSQL database

## 🚀 Getting Started

### 1. Clone Repository

```bash
git clone <repository-url>
cd task-manager
```

### 2. Install Dependencies

```bash
npm install
# atau
yarn install
# atau
pnpm install
```

### 3. Setup Environment Variables

Buat file `.env` di root project dan tambahkan:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/taskmanager"
```

### 4. Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Opsional) Seed database dengan data awal
npx prisma db seed
```

### 5. Run Development Server

```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat aplikasi.

## 📁 Struktur Proyek

```text
task-manager/
├── app/
│   ├── api/
│   │   └── tasks/           # API routes untuk CRUD operations
│   ├── generated/
│   │   └── prisma/          # Generated Prisma Client
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage dengan task interface
├── prisma/
│   ├── schema.prisma        # Database schema
│   ├── seed.ts              # Database seeding
│   └── migrations/          # Database migrations
├── lib/
│   └── prisma.ts            # Prisma client configuration
└── package.json
```

## 🔧 Available Scripts

```bash
npm run dev          # Menjalankan development server
npm run build        # Build aplikasi untuk production
npm run start        # Menjalankan production server
npm run lint         # Menjalankan ESLint
npx prisma studio    # Membuka Prisma Studio untuk melihat database
npx prisma generate  # Generate Prisma Client
npx prisma migrate   # Menjalankan database migrations
```

## 📊 Database Schema

```prisma
model Task {
  id          String   @id @default(uuid())
  title       String
  description String?
  completed   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## 🔌 API Endpoints

- `GET /api/tasks` - Mengambil semua tugas
- `POST /api/tasks` - Membuat tugas baru
- `PATCH /api/tasks/[id]` - Memperbarui tugas berdasarkan ID
- `DELETE /api/tasks/[id]` - Menghapus tugas berdasarkan ID

## 🚀 Deploy on Vercel

1. Push kode ke GitHub repository
2. Connect repository ke [Vercel](https://vercel.com)
3. Set environment variable `DATABASE_URL` di Vercel dashboard
4. Deploy aplikasi

## 📝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

Project ini open source dan tersedia di bawah [MIT License](LICENSE).
