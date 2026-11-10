<div align="center">

# 🌍 GlobePulse

### Grow your Facebook Page with real data, not guesswork.

Analyze where your audience lives, find the best posting time for every region, and schedule content automatically with the Meta Graph API.

![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?logo=mongodb&logoColor=white)
![Meta Graph API](https://img.shields.io/badge/Meta%20Graph%20API-v21-1877F2?logo=meta&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [API](#-api-overview) • [Roadmap](#-roadmap)

</div>

---

## ✨ Overview

**GlobePulse** is a full-stack analytics and scheduling dashboard for Facebook Pages. It pulls your Page Insights, breaks down views and followers by **country, city, and hour of day**, then recommends the best local time to post for each audience region.

> 💡 GlobePulse works only with **genuine, organic engagement**. It does not generate fake views, followers, or interactions, and it never will.

---

## 🚀 Features

| | Feature | Description |
|---|---|---|
| 📊 | **Audience Analytics** | Views, reach, and follower growth by country, city, age, and gender |
| 🕒 | **Best-Time Engine** | Finds peak activity hours per region, converted to local time zones |
| 📅 | **Smart Scheduler** | Queue posts for different regions at their optimal local time |
| 🗺️ | **World Heatmap** | Interactive map showing where your views come from |
| 🏆 | **Content Performance** | See which posts win in which country |
| 🔔 | **Weekly Reports** | Automated email summary of growth and top content |
| 🔐 | **Secure OAuth** | Facebook Login with encrypted long-lived tokens |

---

## 🧱 Tech Stack

**Frontend:** React, Vite, Tailwind CSS, Recharts, react-simple-maps
**Backend:** Node.js, Express, node-cron, BullMQ
**Database:** MongoDB, Redis (job queue)
**APIs:** Meta Graph API (Page Insights, Page Publishing)
**Deployment:** Vercel (client) + Render (server)

---

## 🏗️ Architecture

```
┌────────────┐     ┌──────────────┐     ┌────────────────┐
│  React UI  │────▶│  Express API │────▶│ Meta Graph API │
│ (Dashboard)│◀────│  + Auth      │◀────│ (Insights/Post)│
└────────────┘     └──────┬───────┘     └────────────────┘
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
        ┌──────────┐           ┌─────────────┐
        │ MongoDB  │           │ Redis/BullMQ│
        │ (metrics)│           │ (scheduler) │
        └──────────┘           └─────────────┘
```

---

## ⚡ Getting Started

### Prerequisites

- Node.js 20+
- MongoDB and Redis (local or cloud)
- A [Meta Developer](https://developers.facebook.com/) app with these permissions:
  `pages_show_list`, `pages_read_engagement`, `read_insights`, `pages_manage_posts`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Sudesh-2002/globepulse.git
cd globepulse

# 2. Install dependencies
cd server && npm install
cd ../client && npm install
```

### Environment Variables

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/globepulse
REDIS_URL=redis://localhost:6379

FB_APP_ID=your_app_id
FB_APP_SECRET=your_app_secret
FB_REDIRECT_URI=http://localhost:5000/api/auth/facebook/callback

JWT_SECRET=change_me
TOKEN_ENCRYPTION_KEY=32_char_random_string
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Run the app

```bash
# Terminal 1: backend
cd server && npm run dev

# Terminal 2: frontend
cd client && npm run dev
```

Open **http://localhost:5173** and connect your Facebook Page.

---

## 🔌 API Overview

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/auth/facebook` | Start Facebook OAuth login |
| `GET` | `/api/pages` | List connected Pages |
| `GET` | `/api/insights/:pageId/countries` | Views and followers by country |
| `GET` | `/api/insights/:pageId/hours` | Activity by hour of day |
| `GET` | `/api/recommendations/:pageId` | Best posting time per region |
| `POST` | `/api/posts/schedule` | Schedule a post for a region |
| `GET` | `/api/reports/weekly` | Generate the weekly summary |

---

## 📁 Project Structure

```
globepulse/
├── client/             # React dashboard
│   └── src/
│       ├── components/ # Charts, heatmap, scheduler UI
│       ├── pages/
│       └── hooks/
├── server/
│   ├── routes/
│   ├── services/       # Graph API, best-time engine
│   ├── jobs/           # Scheduled publishing workers
│   └── models/
└── README.md
```

---

## 🗺️ Roadmap

- [x] Facebook OAuth and Page connection
- [x] Insights by country and hour
- [ ] Best-time recommendation engine
- [ ] Multi-region post scheduler
- [ ] World heatmap
- [ ] Weekly email reports
- [ ] Instagram Business support
- [ ] AI caption suggestions per region

---

## ⚠️ Compliance

GlobePulse follows the [Meta Platform Terms](https://developers.facebook.com/terms/). Use it only on Pages you own or manage. Artificially inflating views, followers, or engagement is **not supported** and can get a Page restricted or removed.

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m "Add amazing feature"`
4. Push and open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.

---

<div align="center">

**Built by [Sudesh Hansika](https://github.com/Sudesh-2002)**

⭐ Star this repo if it helped you grow your page!

</div>
