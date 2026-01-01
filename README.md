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

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)

## License

MIT License - see LICENSE file

## Authors

- Annafi Islam - Full Stack Developer

## Acknowledgments

- OpenFDA for medication data
- Medical references used for accuracy