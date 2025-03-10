# Famalytics

**Turning Early Chatter into Lasting Growth**

Famalytics is an AI-powered customer sentiment analysis platform that transforms unstructured customer feedback from multiple channels into actionable insights. By leveraging advanced natural language processing (NLP) and real-time analytics, Famalytics empowers small and medium-sized businesses (SMBs) to monitor, analyze, and respond to customer sentiment—fueling growth and innovation with every interaction.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Screens & User Interfaces](#screens--user-interfaces)
  - [System Admin Dashboard](#system-admin-dashboard)
  - [Client Admin Dashboard](#client-admin-dashboard)
  - [Client Normal User Dashboard](#client-normal-user-dashboard)
  - [Client Observer Dashboard](#client-observer-dashboard)
- [Architecture & Workflow](#architecture--workflow)
- [Installation & Setup](#installation--setup)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Overview

Famalytics is designed to provide real-time sentiment analysis and trend detection by aggregating customer feedback from various sources such as social media, surveys, emails, support tickets, and review sites. Our platform stands out by offering vertical-specific insights, predictive analytics, and customizable dashboards—addressing the unique needs of SMBs while remaining agile and cost‑efficient compared to traditional enterprise solutions.

Key Differentiators:
- **AI-Powered Analysis:** Utilizes advanced NLP models (e.g., OpenAI’s GPT‑3.5/4 and DeepSeek) to score feedback, extract keywords, and categorize sentiment.
- **Multi-Channel Aggregation:** Seamlessly ingests data from multiple channels to create a unified view of customer sentiment.
- **Vertical-Specific Customization:** Offers tailored insights and KPIs for specific industries (e.g., hospitality, retail).
- **Advanced Alerts & Predictive Analytics:** Detects trends, crises, and potential churn with automated alerts and proactive recommendations.
- **Extensible Integrations:** Provides robust API access and white‑labeling options for integrations with popular platforms like Shopify, OpenTable, and Toast POS.

---

## Key Features

- **Multi-Channel Data Ingestion:**  
  - CSV uploads (via `react-dropzone` and `papaparse`)  
  - Manual entry forms  
  - API integration & webhook support
  
- **Real-Time Sentiment Analysis:**  
  - AI-driven sentiment scoring and keyword extraction  
  - Batch processing using scheduled background jobs
  
- **Trend & Theme Extraction:**  
  - Theme clustering and trend analysis  
  - Storage of industry‑specific themes and KPIs
  
- **Automated Alerts:**  
  - Configurable thresholds and notification channels (email, in‑app, Slack, MS Teams)
  
- **Customizable Dashboards & Reporting:**  
  - Interactive charts (line, bar, pie) and exportable reports  
  - White‑label and API access options

- **Advanced Analytics:**  
  - Predictive analytics for churn forecasting and what‑if scenarios  
  - Crisis detection and multimedia (video/audio) sentiment analysis

---

## Tech Stack

- **Frontend:** Next.js, Tailwind CSS, shadcn UI  
- **Backend:** Next.js API routes, Supabase  
- **Database:** PostgreSQL (via Supabase)  
- **Authentication:** Supabase Auth  
- **Payments:** Stripe  
- **AI/NLP:** OpenAI API, DeepSeek  
- **Hosting:** Vercel  
- **Others:** Redis (for caching and rate limiting), BullMQ (optional for background job queuing)

---

## Screens & User Interfaces

### 1. System Admin Dashboard:
   - **Impersonate User Button:**  
     • *Description:* Redirects to a dedicated page for system admins to log in as a specific client user for troubleshooting.  
   - **Active Subscribers Graph:**  
     • *Description:* A line chart displaying the total number of subscribers over a selectable time period.  
   - **Global Revenue Trend Graph:**  
     • *Description:* Visualizes overall revenue growth across all clients.  
   - **System Load & Performance Chart:**  
     • *Description:* Displays real-time metrics (CPU, memory, API response times).  
   - **Activity Log Table:**  
     • *Description:* A sortable table showing detailed logs of system and user actions (timestamps, IP addresses, actions).  
   - **AI Task Monitor List:**  
     • *Description:* Lists all AI processing tasks with statuses, logs, and error notifications.

### 2. Client Admin Dashboard:
   - **Client Overview Panel:**  
     • *Description:* Summarizes key metrics (active users, feedback count, average sentiment) for the client organization.  
   - **Active Users Graph:**  
     • *Description:* Line graph tracking active user count over time.  
   - **Feedback Volume Graph:**  
     • *Description:* Bar chart showing feedback entries received per channel.  
   - **Sentiment Distribution Pie Chart:**  
     • *Description:* Visualizes the breakdown of positive, neutral, and negative feedback.  
   - **Trend Analysis Graph:**  
     • *Description:* Line graph highlighting emerging feedback trends by theme.  
   - **Custom KPI Trend Graph:**  
     • *Description:* Displays vertical-specific metrics (e.g., room cleanliness, checkout efficiency) over time.  
   - **Benchmark Comparison Chart:**  
     • *Description:* Compares client KPIs against industry benchmarks.  
   - **Integration Status Panel:**  
     • *Description:* Lists current integrations (e.g., SHOPIFY, OPENTABLE) with operational health indicators.  
   - **Customization Settings Page:**  
     • *Description:* Allows configuration of white‑label options, dashboard layouts, and integration setups.

### 3. Client Normal User Dashboard:
   - **Personal Feedback Feed:**  
     • *Description:* A paginated list of individual feedback entries with sentiment scores, keywords, and analysis details.  
   - **Real-Time Sentiment Graph:**  
     • *Description:* Live line chart showing the sentiment trend for the user’s feedback.  
   - **Detailed Feedback Analysis Card:**  
     • *Description:* Breaks down sentiment analysis results including keyword extraction and topic highlights.  
   - **Report Export Interface:**  
     • *Description:* Allows selection of date ranges and export of charts/reports in PDF/CSV format.  
   - **Profile & Account Settings:**  
     • *Description:* Manage personal details, notification preferences, and security settings.  
   - **API Usage Dashboard (if applicable):**  
     • *Description:* Read-only view of API documentation and usage statistics.

### 4. Client Observer Dashboard:
   - **Read-Only Overview Panel:**  
     • *Description:* Summarizes key metrics without editing privileges.  
   - **Sentiment Trends Graph:**  
     • *Description:* Line graph that displays sentiment trends using AI‑classified data.  
   - **Aggregated Feedback Volume Graph:**  
     • *Description:* Bar chart visualizing total feedback volume segmented by data source.  
   - **Vertical-Specific KPI Graph:**  
     • *Description:* Individual graphs for metrics like “room cleanliness” or “checkout efficiency.”  
   - **Historical Reports Graph:**  
     • *Description:* Displays archived data trends for retrospective analysis.  
   - **Notification Log Table:**  
     • *Description:* Lists all alerts and notifications received, with timestamps and descriptions.

---

## Architecture & Workflow

1. **Data Ingestion:**  
   - Multi-channel ingestion via CSV, manual entry, and API/webhook endpoints.
   - Data is parsed, validated, and stored in the `feedback_entries` table.

2. **AI Processing:**  
   - Real-time sentiment analysis through scheduled background tasks.
   - Trend detection, theme clustering, and predictive analytics run in dedicated services.
   - Results are aggregated and cross‑validated using multiple AI providers (OpenAI, DeepSeek) managed by an orchestrator.

3. **Dashboard & Reporting:**  
   - Interactive visualizations built with Next.js components.
   - Customizable reports, alert configurations, and integration management are available to admins and users.

4. **Security & Compliance:**  
   - All API communications are encrypted (HTTPS, API key encryption).
   - Supabase Auth and row‑level security ensure data isolation.
   - Regular database backups and audit logs are maintained.

5. **DevOps & Deployment:**  
   - CI/CD via GitHub Actions with staging and production deployments on Vercel.
   - Monitoring and logging integrated with Vercel Analytics and Sentry.

---

## Installation & Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/famalytics.git
   cd famalytics
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set Up Environment Variables:**
   - Create a `.env.local` file and add necessary variables (e.g., `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `STRIPE_SECRET_KEY`, `OPENAI_API_KEY`).
   - Ensure API keys for AI providers are encrypted and managed as described in our documentation.

4. **Run Database Migrations:**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

---

## Contributing

We welcome contributions from the community! Please follow our [CONTRIBUTING.md](CONTRIBUTING.md) guidelines to submit issues, propose features, or create pull requests.

---

## License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.

---

## Contact

For more information, please visit our [website](https://www.famalytics.com) or contact us at [support@famalytics.com](mailto:support@famalytics.com).

---

Famalytics empowers businesses to transform early customer chatter into lasting growth with cutting‑edge AI analytics, customizable dashboards, and real‑time alerts. Join us on our journey to revolutionize customer feedback analysis!
```

---
