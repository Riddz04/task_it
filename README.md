# 🧠 TaskIt — A Task Board Application

**TaskIt** is a modern Kanban-style task management application built with React, TypeScript, Zustand, and `dnd-kit` for smooth drag-and-drop interactions. It allows users to manage boards, columns, and tasks with rich metadata including priority, due dates, and assignees.

🌐 **Live Demo**: [TaskIt](https://task-it-ebon.vercel.app/)

---

## 🚀 Features

- 📋 Create and manage multiple **boards**
- 📁 Add, edit, and delete **columns** dynamically
- 🧩 Add rich **tasks** with:
  - Title & description
  - Priority levels
  - Assignee (via email)
  - Due date & status
- 🔀 Drag and drop tasks across columns with **dnd-kit**
- 🖱️ Edit and delete tasks/columns on the fly
- 🌙 Sleek, responsive UI with modal-driven interactions

---

## 🛠️ Tech Stack

| Tool | Description |
|------|-------------|
| **React** | UI Library |
| **TypeScript** | Type safety |
| **Zustand** | Lightweight global state management |
| **dnd-kit** | Drag-and-drop engine |
| **Tailwind CSS** | Styling and layout |
| **Vite** | Fast build tool |
| **Vercel** | Hosting & deployment |

---

## 📦 Getting Started

To run the project locally:

### 1. Clone the repo

```bash
git clone https://github.com/Riddz04/task_it.git
cd task_it
```
2. Install dependencies
```bash
npm install
```
3. Start the development server
```bash
npm run dev
```
Then, open http://localhost:5173 in your browser.

📁 Project Structure
```bash
src/
├── components/         # Reusable UI components
│   ├── Board.tsx
│   ├── Column.tsx
│   ├── TaskCard.tsx
│   └── modals/         # Modal components (create/edit)
├── hooks/              # Custom hooks
├── store/              # Zustand store (`useBoardStore`)
├── types/              # Type definitions
└── App.tsx             # Root component
```

📄 License
This project is open source under the MIT License.

Made with ❤️ by @Riddz04
