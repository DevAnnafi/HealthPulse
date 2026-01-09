# HealthPulse: Disease & Symptom Tracking Platform

A comprehensive full-stack healthcare application that helps users monitor symptoms, 
track disease progression, visualize health trends, and generate reports for healthcare providers.

## Features

- 📝 Real-time symptom logging with severity tracking
- 📊 Interactive timeline and trend visualization
- 🔍 AI-powered pattern detection and correlation analysis
- 📄 Professional report generation (PDF)
- 🔐 Secure user authentication and data encryption
- 📱 Mobile-responsive design
- 🌙 Dark mode support

## Tech Stack

### Frontend
- React 18 + TypeScript
- Redux Toolkit
- Tailwind CSS
- Recharts
- Vite

### Backend
- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM
- Redis (caching & job queue)
- JWT Authentication
- Bull (task scheduling)

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL
- Redis
- npm or pnpm

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/healthpulse.git
cd healthpulse
```

2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

3. Backend Setup
```bash
cd ../backend
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

4. Access the application
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Docs: http://localhost:3000/api-docs

## Project Structure

See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed structure.

## Documentation

- [Setup Guide](./docs/SETUP.md)
- [API Documentation](./docs/API.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## Key Features Implementation

### Symptom Logging
- Quick-log interface with severity slider
- Category-based organization
- Photo/document uploads
- Timestamp and location tracking

### Analytics Engine
- Pattern detection algorithm
- Correlation detection
- Trend analysis
- Insight generation

### Report Generation
- Customizable date ranges
- Embedded visualizations
- Professional PDF export
- Shareable reports

## 🏆 Weekly Goal Streaks & Progress Tracking

HealthPulse includes a **goal-aware weekly streak system** that helps users measure **consistency over time**, not just raw daily numbers.

---

### What Is a Weekly Streak?

A **weekly streak** represents the number of **consecutive weeks (including the current week)** in which a user met their goal for a given health metric (e.g. steps, sleep, calories).

Key rules:
- Streaks reset immediately on a missed week  
- No partial credit is given  
- Each metric is evaluated independently  

**Example:**  
If a user meets their step goal for 4 weeks in a row, their streak is **4 weeks**.

---

### Metric-Specific Goal Rules

Different health metrics require different evaluation logic. HealthPulse applies **domain-aware comparison rules** per metric:

| Metric        | Rule | Goal Condition |
|--------------|------|----------------|
| Steps        | min  | Weekly average ≥ goal |
| Sleep        | min  | Weekly average ≥ goal |
| Calories     | max  | Weekly average ≤ goal |
| Heart Rate   | max  | Weekly average ≤ goal |
| Weight       | max  | Weekly average ≤ goal |

These rules are centrally defined and reused across analytics.

---

### How It Works (Under the Hood)

1. Health entries are grouped by day and summarized into **weekly averages**
2. Each week is evaluated against the user’s goal using the metric’s comparison rule
3. Weeks are traversed **backwards in time**
4. The streak increments for each consecutive “hit”
5. The streak stops immediately on a miss or missing data

This logic is implemented as a **pure analytics function**:

```ts
getWeeklyStreak(entries, metric, goal, weekStart)



## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)

## License

MIT License - see LICENSE file

## Authors

- Annafi Islam - Full Stack Developer

## Acknowledgments

- OpenFDA for medication data
- Medical references used for accuracy

