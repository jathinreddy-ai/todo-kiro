// Seed data shown on first load when localStorage is empty.
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(today.getDate() + 7);
const lastWeek = new Date(today);
lastWeek.setDate(today.getDate() - 7);

const fmt = (d) => d.toISOString().split("T")[0];

export const SAMPLE_TASKS = [
  {
    id: "sample-1",
    title: "Design new landing page mockups",
    description:
      "Create wireframes and high-fidelity mockups for the Q3 product launch.",
    priority: "high",
    categories: ["work"],
    dueDate: fmt(tomorrow),
    completed: false,
    createdAt: lastWeek.toISOString(),
    updatedAt: lastWeek.toISOString(),
    order: 0,
  },
  {
    id: "sample-2",
    title: "Review pull requests",
    description: "Go through open PRs on the main repo and leave feedback.",
    priority: "high",
    categories: ["work"],
    dueDate: fmt(today),
    completed: false,
    createdAt: lastWeek.toISOString(),
    updatedAt: lastWeek.toISOString(),
    order: 1,
  },
  {
    id: "sample-3",
    title: "Buy groceries",
    description: "Milk, eggs, bread, fruits, and vegetables.",
    priority: "medium",
    categories: ["shopping", "personal"],
    dueDate: fmt(today),
    completed: false,
    createdAt: yesterday.toISOString(),
    updatedAt: yesterday.toISOString(),
    order: 2,
  },
  {
    id: "sample-4",
    title: "Complete React course module 5",
    description: "Finish the advanced hooks section and take the quiz.",
    priority: "medium",
    categories: ["learning"],
    dueDate: fmt(nextWeek),
    completed: false,
    createdAt: lastWeek.toISOString(),
    updatedAt: lastWeek.toISOString(),
    order: 3,
  },
  {
    id: "sample-5",
    title: "Morning workout",
    description: "30 minutes cardio + strength training.",
    priority: "low",
    categories: ["health", "personal"],
    dueDate: fmt(today),
    completed: true,
    createdAt: yesterday.toISOString(),
    updatedAt: today.toISOString(),
    order: 4,
  },
  {
    id: "sample-6",
    title: "Write weekly team update",
    description:
      "Summarize progress, blockers, and next steps for the team newsletter.",
    priority: "medium",
    categories: ["work"],
    dueDate: fmt(yesterday),
    completed: false,
    createdAt: lastWeek.toISOString(),
    updatedAt: lastWeek.toISOString(),
    order: 5,
  },
  {
    id: "sample-7",
    title: 'Read "Atomic Habits"',
    description: "Finish chapters 8–12 and take notes.",
    priority: "low",
    categories: ["learning", "personal"],
    dueDate: fmt(nextWeek),
    completed: false,
    createdAt: lastWeek.toISOString(),
    updatedAt: lastWeek.toISOString(),
    order: 6,
  },
  {
    id: "sample-8",
    title: "Schedule dentist appointment",
    description: "Call the clinic and book a slot for next month.",
    priority: "low",
    categories: ["health"],
    dueDate: null,
    completed: true,
    createdAt: lastWeek.toISOString(),
    updatedAt: yesterday.toISOString(),
    order: 7,
  },
];
