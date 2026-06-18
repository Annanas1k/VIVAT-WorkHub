<div align="center">

# 💼 VIVAT WorkHub — Client

**Frontend** for VIVAT WorkHub — projects, tasks, customers, kanban boards, Gantt charts, real-time notifications & multi-language UI.

![React](https://img.shields.io/badge/React_19-149ECA?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)

</div>

---

## ✨ Features

- 📊 Dashboard — stats, charts, activity heatmap, deadlines
- 📁 Projects — kanban board, Gantt chart, files, discussions
- ✅ Tasks — drag & drop board, assignees, priorities
- 🏢 Customers — individuals & companies
- 💬 Real-time comments & notifications (Socket.IO)
- 🔐 Auth — email/password + Google OAuth
- 🌍 i18n — 🇷🇴 🇬🇧 🇷🇺
- 👮 Admin panel — users, customers, projects, tasks, audit logs

## 🛠️ Tech Stack

| | |
|---|---|
| **UI** | React 19 · Vite · TypeScript |
| **Styling** | Tailwind CSS 4 · shadcn/ui · Radix UI |
| **Routing** | React Router 7 |
| **State** | React Context (`AuthProvider`, `DashboardProvider`) |
| **Data** | Axios · custom hooks (`useApiQuery`, etc.) |
| **Real-time** | Socket.io-client |
| **Charts / DnD** | Recharts · @hello-pangea/dnd · SVAR Gantt |
| **i18n** | i18next |

## ⚡ Quick Start

```bash
git clone <repository-url>
cd VIVAT_WorkHub/client
npm install
cp .env.example .env     # fill in your values
npm run dev
```

➡️ App at `http://localhost:5173`

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL (e.g. `http://localhost:3000/api`) |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `PACKAGE_VERSION` | App version shown in UI |

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 📂 Project Structure

```
src/
├── components/    # feature components (projects, tasks, dashboard, ui/...)
├── pages/          # route-level views (incl. admin/, projects/, tasks/)
├── routes/          # AppRouter.tsx — route definitions
├── layouts/         # MainLayout
├── context/         # Auth & Dashboard providers
├── hooks/            # data-fetching & domain hooks
├── services/         # API calls per resource (axios)
├── types/             # shared TS types
├── lib/                # axios client, socket.ts, utils
└── locales/             # ro / en / ru translations
```

## 🔌 Backend

Talks to the [VIVAT WorkHub server](../server) via REST (`VITE_API_URL`) + Socket.IO (`http://localhost:3000` by default, see `src/lib/socket.ts`).

## ⚠️ Known Issues

- [ ] Socket URL hardcoded in `src/lib/socket.ts` — should use `VITE_API_URL`
- [ ] Auth token/user stored in `localStorage` (no refresh-token rotation)

---

<div align="center">

Made with ☕ for **VIVAT WorkHub**

</div>
