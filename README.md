# ⚡ PagePulse - Production-Grade Website Auditing Platform

<div align="center">

![PagePulse SaaS Banner](https://raw.githubusercontent.com/digitalheroesco/pagepulse/main/assets/banner.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-2563eb?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React 18](https://img.shields.io/badge/React-18-0f172a?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.1-646cff?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4.19-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Vitest](https://img.shields.io/badge/Vitest-6%20Passed-10b981?style=for-the-badge&logo=vitest)](https://vitest.dev/)

**Instant website health, response latency, structural SEO, accessibility, and content density inspection.**

[Live Demo](#-deployment-guide) • [API Documentation](#-api-contract) • [Architecture](#-architecture) • [Getting Started](#-getting-started)

---

</div>

## 📖 Overview

**PagePulse** is a commercial-grade website auditing SaaS application built to inspect any webpage in real time. Designed with a clean aesthetic matching top-tier tech products like Stripe, Vercel, Linear, and Supabase, PagePulse extracts structural health metrics into an interactive 2-column dashboard.

---

## 📸 Screenshots & Demo

```
+-----------------------------------------------------------------------------------+
|  [Logo] PagePulse Pro         Features   API   Docs   GitHub     [Analyze Webpage]|
|-----------------------------------------------------------------------------------|
|                                                                                   |
|                   Analyze any website in seconds                                  |
|         Instantly inspect response time, metadata and page structure              |
|                                                                                   |
|         [ https://example.com                       ] [ Analyze -> ]              |
|                                                                                   |
|-----------------------------------------------------------------------------------|
|  [200 OK Status]    [142ms Response Time]    [Title Length Check]   [Meta Description]|
|  [H1 Tag Count]     [Missing Alt Images]     [Visible Word Count]   [Content Depth]   |
+-----------------------------------------------------------------------------------+
```

*(Demo GIF Placeholder: `assets/demo.gif`)*

---

## ✨ Features

- ⚡ **Response Time & Speed Benchmarks**: Tracks HTTP response latency and categorizes server speed (`<200ms` Fast, `200-500ms` Moderate, `>500ms` Slow).
- 🏷️ **SEO Title & Meta Description Audit**: Evaluates document `<title>` character lengths against 50–60 character targets and inspects meta descriptions.
- 📐 **Heading Hierarchy Inspection**: Counts `<h1>` elements to flag missing headings or multiple H1 tags for search indexers.
- ♿ **Image Accessibility Coverage**: Scans body images to detect missing `alt` attributes and provides an expandable image source inspector.
- 📚 **Word Density & Content Depth Rating**: Calculates visible body text word count, estimates reading duration, and rates content depth (*Thin*, *Moderate*, *Comprehensive*).
- 🛡️ **Strict Non-HTML Content Protection**: Inspects `Content-Type` headers to reject direct PDFs, images, or JSON feeds before parsing.
- ⏳ **Multi-Stage Animated Loading**: Smooth step transitions (*Fetching page...* → *Parsing HTML...* → *Generating Report...*).
- 📡 **Developer REST API**: Clean `POST /api/analyze` endpoint with cURL documentation and JSON report exports.

---

## 🛠️ Tech Stack

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend UI** | React 18 + TypeScript | Component-driven dashboard interface |
| **Styling** | Tailwind CSS + Inter Font | SaaS design tokens, crisp cards, and typography |
| **Animations** | Framer Motion | Smooth layout transitions and metric card reveals |
| **Icons** | Lucide React | Clean SVG icon badges |
| **Backend API** | Node.js + Express | RESTful API server with MVC separation |
| **HTML Parser** | Cheerio | Fast HTML element and metadata extraction |
| **HTTP Client** | Axios | Fetching origin HTML payloads with timeout protection |
| **Test Runner** | Vitest + Supertest | Unit & integration test execution |

---

## 🏗 Architecture & Design Pattern

PagePulse uses a decoupled monorepo architecture:

```mermaid
graph TD
    User([User Web Browser]) -->|URL Input| ReactApp[Client React App]
    ReactApp -->|POST /api/analyze| ExpressAPI[Express REST API]
    ExpressAPI -->|URL Validation| Validator[UrlValidator Utility]
    ExpressAPI -->|HTTP GET Request| TargetWeb[Target Website Server]
    TargetWeb -->|Response Header & Body| AuditService[AuditService Engine]
    AuditService -->|Content-Type Check| HTMLCheck{Is HTML?}
    HTMLCheck -- No --> ErrorRes[HTTP 400 Non-HTML Error]
    HTMLCheck -- Yes --> Parser[Cheerio HTML Parser]
    Parser -->|Title, Meta, H1s, Alts, Words| Metrics[AuditResult Object]
    Metrics -->|JSON Response| ReactApp
    ReactApp -->|Render Cards & Charts| Dashboard[Interactive Dashboard]
```

---

## 📁 Directory Tree

```
pagepulse/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/         # Modular UI Components
│   │   │   ├── Navbar.tsx      # Sticky header with active scroll observer
│   │   │   ├── Hero.tsx        # Search bar & trust logo banner
│   │   │   ├── LoadingOverlay.tsx # Animated step progress indicator
│   │   │   ├── Dashboard.tsx   # 2-column metrics dashboard
│   │   │   ├── MetricCard.tsx  # Reusable metric card wrapper
│   │   │   ├── ErrorView.tsx   # Structured error state viewer
│   │   │   ├── FeaturesSection.tsx # Feature grid section
│   │   │   ├── ApiSection.tsx  # Interactive API documentation
│   │   │   ├── DocsSection.tsx # How it works & engine lifecycle
│   │   │   └── Footer.tsx      # Footer with Digital Heroes link
│   │   ├── types/              # TypeScript interfaces
│   │   ├── App.tsx             # Main application orchestrator
│   │   └── main.tsx            # React mounting entrypoint
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.ts
│
└── server/                     # Express Backend API
    ├── src/
    │   ├── controllers/        # analyzeController.ts
    │   ├── middleware/         # errorHandler.ts
    │   ├── parsers/            # htmlParser.ts (Cheerio logic)
    │   ├── routes/             # apiRoutes.ts
    │   ├── services/           # auditService.ts (Axios + timing)
    │   ├── utils/              # urlValidator.ts
    │   ├── tests/              # analyze.test.ts (Vitest)
    │   └── server.ts           # Server bootstrap
    ├── package.json
    └── tsconfig.json
```

---

## 📡 API Contract

### Endpoint: `POST /api/analyze`

#### Request Payload
```json
{
  "url": "https://openai.com"
}
```

#### Successful Response (`200 OK`)
```json
{
  "url": "https://openai.com/",
  "status": 200,
  "statusText": "OK",
  "responseTime": 184,
  "title": "OpenAI",
  "titleLength": 6,
  "metaDescription": "Transforming work and creativity with AI...",
  "metaDescriptionLength": 42,
  "h1Count": 1,
  "h1List": ["OpenAI"],
  "missingAltImages": 2,
  "totalImages": 15,
  "wordCount": 1438,
  "readingTimeMinutes": 7,
  "contentDepth": "Comprehensive",
  "timestamp": "2026-07-24T15:00:00.000Z"
}
```

#### Non-HTML Error Response (`400 Bad Request`)
```json
{
  "success": false,
  "error": "Non HTML content detected",
  "code": "NON_HTML",
  "message": "The provided URL does not contain an HTML webpage. PagePulse currently analyzes HTML documents only."
}
```

#### Example cURL Command
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url": "https://openai.com"}'
```

---

## ⚡ Getting Started

### 1. Server Setup
```bash
cd server
npm install
npm run dev
```
*Backend API boots at `http://localhost:5000`*

### 2. Client Setup
```bash
cd client
npm install
npm run dev
```
*Frontend app launches at `http://localhost:5173`*

---

## 🧪 Testing Instructions

Run the backend unit and integration test suite:

```bash
cd server
npm test
```

```
 RUN  v1.6.1 C:/Users/HP/Documents/webd/page plus/server

 ✓ src/tests/analyze.test.ts (6 tests) 879ms

 Test Files  1 passed (1)
      Tests  6 passed (6)
   Duration  2.12s
```

---

## 🚀 Deployment Guide

- **Frontend (Vercel)**: Import `client/` directory into Vercel, set build command to `npm run build` and output directory to `dist`.
- **Backend (Render)**: Deploy `server/` directory as a Node Web Service on Render with start command `npm start`.

---

## 🌐 Real-world Notes

> [!NOTE]
> **Anti-Bot Scraping Protections**: Enterprise websites (such as Amazon, LinkedIn, Cloudflare-protected endpoints, or specialized login portals) implement strict anti-bot measures, JavaScript challenges, or CAPTCHA proxies. When auditing these specific domains, origin servers may block automated HTTP requests or return fallback error pages. When this occurs, metadata may be restricted even though the PagePulse parser is functioning normally. This is expected real-world web behavior.

---

## 🗺️ Roadmap & Known Limitations

- [x] Real-time latency measurement
- [x] SEO metadata & heading extraction
- [x] Non-HTML header validation
- [x] Interactive JSON report exports
- [ ] Historical audit trends database integration
- [ ] Lighthouse Core Web Vitals scoring integration

---

## 📄 License & Attribution

Built for **[Digital Heroes Training Task](https://digitalheroesco.com)**.

Distributed under the **MIT License**.
