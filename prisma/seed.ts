import {
  Priority,
  PrismaClient,
  Role,
  TaskStatus,
} from "@/app/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // Clear existing data
  await prisma.task.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  // Create tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: "Frontend" } }),
    prisma.tag.create({ data: { name: "Backend" } }),
    prisma.tag.create({ data: { name: "Database" } }),
    prisma.tag.create({ data: { name: "UI/UX" } }),
    prisma.tag.create({ data: { name: "Testing" } }),
    prisma.tag.create({ data: { name: "Deployment" } }),
    prisma.tag.create({ data: { name: "Documentation" } }),
    prisma.tag.create({ data: { name: "Bug Fix" } }),
  ]);

  // Create users
  const hashedPassword = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@taskmanager.com",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  const user1 = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      password: hashedPassword,
      role: Role.USER,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Jane Smith",
      email: "jane@example.com",
      password: hashedPassword,
      role: Role.USER,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: "Michael Johnson",
      email: "michael@example.com",
      password: hashedPassword,
      role: Role.USER,
    },
  });

  // Create tasks
  const tasks = [
    {
      title: "Setup Next.js Project",
      description:
        "Initialize a new Next.js project with TypeScript and App Router",
      status: TaskStatus.COMPLETED,
      priority: Priority.HIGH,
      assignedToId: user1.id,
      dueDate: new Date("2025-06-15"),
      tagIds: [tags[0].id, tags[6].id], // Frontend, Documentation
    },
    {
      title: "Configure Prisma Database",
      description:
        "Setup Prisma ORM, create schema, and configure database connection",
      status: TaskStatus.COMPLETED,
      priority: Priority.HIGH,
      assignedToId: user1.id,
      dueDate: new Date("2025-06-18"),
      tagIds: [tags[2].id], // Database
    },
    {
      title: "Implement User Authentication",
      description: "Add user registration, login, and JWT authentication",
      status: TaskStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      assignedToId: user2.id,
      dueDate: new Date("2025-06-25"),
      tagIds: [tags[1].id], // Backend
    },
    {
      title: "Design Task Management UI",
      description:
        "Create wireframes and design user interface for task management",
      status: TaskStatus.IN_PROGRESS,
      priority: Priority.MEDIUM,
      assignedToId: user3.id,
      dueDate: new Date("2025-06-22"),
      tagIds: [tags[3].id], // UI/UX
    },
    {
      title: "Build Task CRUD Operations",
      description:
        "Implement create, read, update, and delete operations for tasks",
      status: TaskStatus.PENDING,
      priority: Priority.HIGH,
      assignedToId: user1.id,
      dueDate: new Date("2025-06-30"),
      tagIds: [tags[0].id, tags[1].id], // Frontend, Backend
    },
    {
      title: "Add Task Filtering and Search",
      description:
        "Implement filtering by status, priority, and search functionality",
      status: TaskStatus.PENDING,
      priority: Priority.MEDIUM,
      assignedToId: user2.id,
      dueDate: new Date("2025-07-05"),
      tagIds: [tags[0].id], // Frontend
    },
    {
      title: "Write Unit Tests",
      description:
        "Create comprehensive unit tests for all components and API routes",
      status: TaskStatus.PENDING,
      priority: Priority.MEDIUM,
      assignedToId: user3.id,
      dueDate: new Date("2025-07-10"),
      tagIds: [tags[4].id], // Testing
    },
    {
      title: "Fix Login Redirect Bug",
      description:
        "Fix the issue where users are not redirected properly after login",
      status: TaskStatus.PENDING,
      priority: Priority.HIGH,
      assignedToId: user2.id,
      dueDate: new Date("2025-06-21"),
      tagIds: [tags[7].id], // Bug Fix
    },
    {
      title: "Setup Production Deployment",
      description:
        "Configure deployment pipeline and deploy to production environment",
      status: TaskStatus.PENDING,
      priority: Priority.LOW,
      assignedToId: admin.id,
      dueDate: new Date("2025-07-15"),
      tagIds: [tags[5].id], // Deployment
    },
    {
      title: "Create API Documentation",
      description:
        "Document all API endpoints with examples and response formats",
      status: TaskStatus.PENDING,
      priority: Priority.LOW,
      assignedToId: user1.id,
      dueDate: new Date("2025-07-08"),
      tagIds: [tags[6].id], // Documentation
    },
  ];
  // Create tasks with tags
  for (const taskData of tasks) {
    const { tagIds, ...taskInfo } = taskData;
    await prisma.task.create({
      data: {
        ...taskInfo,
        tags: {
          connect: tagIds.map((id) => ({ id })),
        },
      },
    });
  }

  // Create some archived tasks
  await prisma.task.create({
    data: {
      title: "Old Feature Implementation",
      description: "This task was completed in the previous sprint",
      status: TaskStatus.ARCHIVED,
      priority: Priority.LOW,
      assignedToId: user1.id,
      dueDate: new Date("2025-06-01"),
      tags: {
        connect: [{ id: tags[0].id }],
      },
    },
  });

  console.log("Database seeding completed successfully!");
  console.log(`Created:`);
  console.log(`- ${await prisma.user.count()} users`);
  console.log(`- ${await prisma.task.count()} tasks`);
  console.log(`- ${await prisma.tag.count()} tags`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Error during seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
