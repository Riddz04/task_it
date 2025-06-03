# 🗒️ TaskIt — A Task Board Application

**TaskIt** is a modern Kanban-style task management app that allows users to create, organize, and track tasks across multiple boards and columns. Built with **React**, **TypeScript**, **Zustand**, **Firebase Auth**, and **dnd-kit**, TaskIt provides a sleek drag-and-drop experience, user authentication, and persistent state.

🌐 **Live Demo**: [TaskIt](https://taskit-kappa.vercel.app)

---

## 🚀 Features

- 🔐 **Authentication** via Firebase (login with Google)
- 📋 Create and manage multiple **boards**
- 🧱 Create/edit/delete **columns** (e.g., To Do, In Progress, Done)
- ✅ Add/edit/delete rich **tasks** with:
  - Title & description
  - Assignee (email)
  - Priority level
  - Due date
  - Status tracking
- 🖱️ Intuitive **drag-and-drop** for tasks across columns using `dnd-kit`
- 💾 Real-time board state using **Zustand**
- 💡 Modal-based UI for task and column operations
---

## 🛠️ Tech Stack

| Tech | Purpose |
|------|--------|
| **React** | Component-based UI |
| **TypeScript** | Strong typing |
| **Zustand** | Lightweight state management |
| **Firebase Auth** | Authentication system |
| **dnd-kit** | Drag-and-drop interactions |
| **Tailwind CSS** | Utility-first styling |
| **Vite** | Fast development & builds |
| **Vercel** | Deployment platform |

---

## 🔐 Firebase Setup

Before running locally, create a `.env` file in the root with the following environment variables:

```bash
VITE_API_KEY=your_api_key
VITE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_PROJECT_ID=your_project_id
VITE_STORAGE_BUCKET=your_project.appspot.com
VITE_MSG_ID=your_msg_sender_id
VITE_APP_ID=your_app_id
VITE_MEASUREMENT_ID=your_measurement_id
```
📦 Getting Started
1. Clone the repository
```bash
git clone https://github.com/Riddz04/task_it.git
cd task_it
```
2. Install dependencies
```bash
npm install
```
3. Add your .env file (as shown above)
4. Start the development server
```bash
npm run dev
```
Then, open http://localhost:5173 in your browser.

🧱 Project Structure
```bash
src/
├── components/           # Reusable UI components
│   ├── Board.tsx
│   ├── Column.tsx
│   ├── TaskCard.tsx
│   └── modals/           # Create/edit modals for tasks & columns
├── context/              # AuthContext for Firebase user management
├── firebase.ts           # Firebase initialization
├── hooks/                # Custom hooks
├── store/                # Zustand store (`useBoardStore`)
├── types/                # Global type definitions
├── App.tsx               # Root component
└── main.tsx              # Vite entry point
```
🧪 Development Notes
Uses @dnd-kit for full keyboard-accessible drag and drop.

Stores board state in Zustand for global management.

Tasks and columns are uniquely identified using uuid.

Designed for extensibility — backend integration ready.

📄 License
This project is open source and available under the MIT License.
```
Made with ❤️ by @Riddz04
```
