// pages/docs/index.tsx
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Link from "next/link";

const NAV_ITEMS = [
  {
    title: "Authentication",
    items: [
      { title: "Register", anchor: "#register" },
      { title: "Login", anchor: "#login" },
      { title: "Session", anchor: "#session" },
      { title: "Profile", anchor: "#profile" },
      { title: "Subscription", anchor: "#subscription" },
    ],
  },
  {
    title: "Data Ingestion",
    items: [
      { title: "Import CSV", anchor: "#import-csv" },
      { title: "Manual Entry", anchor: "#manual-entry" },
      { title: "Integrations Setup", anchor: "#integrations-setup" },
      { title: "Integration Status", anchor: "#integration-status" },
    ],
  },
  {
    title: "Analytics",
    items: [
      { title: "Sentiment", anchor: "#sentiment" },
      { title: "Trends", anchor: "#trends" },
      { title: "Themes", anchor: "#themes" },
      { title: "Keywords", anchor: "#keywords" },
      { title: "Dashboard", anchor: "#dashboard" },
    ],
  },
  {
    title: "Alerts & Notifications",
    items: [
      { title: "Configure Alert", anchor: "#configure-alert" },
      { title: "Recent Alerts", anchor: "#recent-alerts" },
      { title: "Update Alert", anchor: "#update-alert" },
    ],
  },
  {
    title: "Reports & Exports",
    items: [
      { title: "Generate PDF", anchor: "#generate-pdf" },
      { title: "Generate CSV", anchor: "#generate-csv" },
      { title: "Report History", anchor: "#report-history" },
    ],
  },
  {
    title: "Billing",
    items: [
      { title: "Create Checkout Session", anchor: "#create-checkout" },
      { title: "Change Subscription", anchor: "#change-subscription" },
      { title: "Billing History", anchor: "#billing-history" },
      { title: "Stripe Webhook", anchor: "#stripe-webhook" },
    ],
  },
  {
    title: "Technical",
    items: [
      { title: "Database Structure", anchor: "#database-structure" },
      { title: "API Routes", anchor: "#api-routes" },
      { title: "NLP Integration", anchor: "#nlp-integration" },
      { title: "Stripe Integration", anchor: "#stripe-integration" },
      { title: "Data Import", anchor: "#data-import" },
      { title: "Frontend Integration", anchor: "#frontend-integration" },
      { title: "Testing with Cypress", anchor: "#testing-cypress" },
      { title: "Deployment", anchor: "#deployment" },
    ],
  },
];

function Sidebar() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (title: string) => {
    setExpanded((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <aside className="w-64 bg-secondary border-border h-screen overflow-y-auto">
      <div className="p-4 border-b-border">
        <img src="/logo.png" alt="Famalytics AI" className="h-8 mb-2" />
        <span className="text-xs text-muted-foreground">API Documentation</span>
      </div>
      <nav className="p-4 text-sm">
        {NAV_ITEMS.map((group) => (
          <div key={group.title} className="mb-4">
            <div
              className="font-bold cursor-pointer text-foreground"
              onClick={() => toggleExpand(group.title)}
            >
              {group.title}
            </div>
            {expanded[group.title] && (
              <ul className="mt-2 ml-4 space-y-1">
                {group.items.map((item) => (
                  <li key={item.anchor}>
                    <Link href={item.anchor}>
                      <button
                        className="text-primary hover:underline"
                        onClick={() => (window.location.href = item.anchor)}
                      >
                        {item.title}
                      </button>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}

function CodeSwitcher({
  codeLang,
  setCodeLang,
}: {
  codeLang: string;
  setCodeLang: (lang: string) => void;
}) {
  const languages = ["react", "javascript", "curl"];

  return (
    <div className="flex items-center justify-end mb-4">
      <span className="mr-2 text-sm text-foreground">Code examples in:</span>
      {languages.map((lang) => (
        <button
          key={lang}
          className={`px-3 py-1 text-sm border rounded mr-2 ${
            codeLang === lang
              ? "bg-accent text-foreground"
              : "bg-background text-foreground"
          }`}
          onClick={() => setCodeLang(lang)}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function MainContent() {
  const [codeLang, setCodeLang] = useState("react");

  useEffect(() => {
    const savedLang = Cookies.get("codeLang");
    if (savedLang) {
      setCodeLang(savedLang);
    }
  }, []);

  useEffect(() => {
    Cookies.set("codeLang", codeLang);
  }, [codeLang]);

  return (
    <div className="p-8 overflow-y-auto flex-1 bg-background text-foreground">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Famalytics AI API Reference</h1>
        <p className="text-muted-foreground max-w-3xl">
          The Famalytics AI API helps you manage user feedback, run sentiment
          analysis, and extract valuable insights. Below you’ll find
          authentication details, endpoints, and code examples to help you
          integrate quickly.
        </p>
        <div className="mt-4 flex space-x-6">
          <div className="bg-card p-4 rounded w-1/2">
            <h3 className="font-semibold mb-2">Just getting started?</h3>
            <p className="text-sm text-card-foreground">
              Check out our quickstart guide for basic setup and first calls.
            </p>
          </div>
          <div className="bg-card p-4 rounded w-1/2">
            <h3 className="font-semibold mb-2">Not a developer?</h3>
            <p className="text-sm text-card-foreground">
              We also offer no-code solutions that let you explore our features
              without writing code.
            </p>
          </div>
        </div>
      </header>

      <CodeSwitcher codeLang={codeLang} setCodeLang={setCodeLang} />

      {/* Authentication Section */}
      <section id="authentication" className="mb-12">
        <h2 className="text-2xl font-bold mb-2">Authentication</h2>
        <p className="text-foreground mb-4">
          Use our token-based system to access all endpoints.
        </p>
        <hr className="my-4" />

        {/* Example Endpoint: Register */}
        <div id="register" className="mb-6">
          <h3 className="text-xl font-semibold">POST /api/auth/register</h3>
          <p className="text-foreground">
            Create a new user account in Famalytics AI.
          </p>
          <div className="text-background p-4 rounded mt-2 overflow-x-auto">
            {codeLang === "react" && (
              <pre>
                {`// React + Axios
axios.post('/api/auth/register', {
  email: 'user@example.com',
  password: 'password123',
  company_name: 'My Company'
})
.then(res => console.log(res.data))
.catch(err => console.error(err));`}
              </pre>
            )}
            {codeLang === "javascript" && (
              <pre>
                {`// Plain JavaScript
fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    company_name: 'My Company'
  })
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));`}
              </pre>
            )}
            {codeLang === "curl" && (
              <pre>
                {`# cURL
curl -X POST https://yourapi.com/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"email":"user@example.com","password":"password123","company_name":"My Company"}'`}
              </pre>
            )}
          </div>
        </div>

        {/* Example Endpoint: Login */}
        <div id="login" className="mb-6">
          <h3 className="text-xl font-semibold">POST /api/auth/login</h3>
          <p className="text-foreground">
            Log in a user and receive an auth token.
          </p>
          <div className="text-background p-4 rounded mt-2 overflow-x-auto">
            {codeLang === "react" && (
              <pre>
                {`// React + Axios
axios.post('/api/auth/login', {
  email: 'user@example.com',
  password: 'password123'
})
.then(res => console.log(res.data))
.catch(err => console.error(err));`}
              </pre>
            )}
          </div>
        </div>
      </section>

      {/* Data Ingestion Section */}
      <section id="data-ingestion" className="mb-12">
        <h2 className="text-2xl font-bold mb-2">Data Ingestion</h2>
        <p className="text-foreground mb-4">
          Ingest feedback from CSV, manual entry, or external integrations.
        </p>
        <hr className="my-4" />

        {/* Example Endpoint: Import CSV */}
        <div id="import-csv" className="mb-6">
          <h3 className="text-xl font-semibold">POST /api/data/import/csv</h3>
          <p className="text-foreground">Upload CSV data for analysis.</p>
          <div className="text-background p-4 rounded mt-2 overflow-x-auto">
            {codeLang === "react" && (
              <pre>
                {`// React + Axios with FormData
const formData = new FormData();
formData.append('file', file);
formData.append('mappings', JSON.stringify({ feedback: 'Comment', date: 'Feedback Date' }));

axios.post('/api/data/import/csv', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})
.then(res => console.log(res.data))
.catch(err => console.error(err));`}
              </pre>
            )}
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section id="analytics" className="mb-12">
        <h2 className="text-2xl font-bold mb-2">Analytics</h2>
        <p className="text-foreground mb-4">
          Retrieve sentiment scores, track trends, extract themes, and more.
        </p>
        <hr className="my-4" />

        {/* Example Endpoint: Sentiment */}
        <div id="sentiment" className="mb-6">
          <h3 className="text-xl font-semibold">
            GET /api/analytics/sentiment
          </h3>
          <p className="text-foreground">
            Fetch sentiment analysis results for your feedback.
          </p>
          <div className="text-background p-4 rounded mt-2 overflow-x-auto">
            {codeLang === "react" && (
              <pre>
                {`// React + Axios
axios.get('/api/analytics/sentiment', {
  params: { timeframe: '7d', limit: 50 }
})
.then(res => console.log(res.data))
.catch(err => console.error(err));`}
              </pre>
            )}
          </div>
        </div>
      </section>

      {/* Alerts & Notifications */}
      <section id="alerts" className="mb-12">
        <h2 className="text-2xl font-bold mb-2">Alerts &amp; Notifications</h2>
        <p className="text-foreground mb-4">
          Configure alerts for specific conditions and retrieve recent alerts.
        </p>
        <hr className="my-4" />

        <div id="configure-alert" className="mb-6">
          <h3 className="text-xl font-semibold">POST /api/alerts/configure</h3>
          <p className="text-foreground">
            Set up alert thresholds and channels.
          </p>
          <div className="text-background p-4 rounded mt-2 overflow-x-auto">
            {codeLang === "react" && (
              <pre>
                {`// React + Axios
axios.post('/api/alerts/configure', {
  name: 'Negative Sentiment Alert',
  description: 'Triggers if sentiment < -0.5',
  condition: { type: 'sentiment', threshold: -0.5 },
  channel: ['email', 'in-app']
})
.then(res => console.log(res.data))
.catch(err => console.error(err));`}
              </pre>
            )}
          </div>
        </div>
      </section>

      {/* Reports & Exports */}
      <section id="reports" className="mb-12">
        <h2 className="text-2xl font-bold mb-2">Reports &amp; Exports</h2>
        <p className="text-foreground mb-4">
          Generate and retrieve PDF or CSV exports of your analysis.
        </p>
        <hr className="my-4" />

        <div id="generate-pdf" className="mb-6">
          <h3 className="text-xl font-semibold">
            POST /api/reports/generate/pdf
          </h3>
          <p className="text-foreground">
            Create a PDF report with the specified parameters.
          </p>
          <div className="text-background p-4 rounded mt-2 overflow-x-auto">
            {codeLang === "react" && (
              <pre>
                {`// React + Axios
axios.post('/api/reports/generate/pdf', {
  parameters: { dateRange: 'this_month' }
})
.then(res => console.log(res.data))
.catch(err => console.error(err));`}
              </pre>
            )}
          </div>
        </div>
      </section>

      {/* Billing */}
      <section id="billing" className="mb-12">
        <h2 className="text-2xl font-bold mb-2">Billing</h2>
        <p className="text-foreground mb-4">
          Manage subscription plans and billing history with Stripe.
        </p>
        <hr className="my-4" />

        <div id="create-checkout" className="mb-6">
          <h3 className="text-xl font-semibold">
            POST /api/billing/create-checkout-session
          </h3>
          <p className="text-foreground">
            Create a Stripe checkout session for a subscription plan.
          </p>
          <div className="text-background p-4 rounded mt-2 overflow-x-auto">
            {codeLang === "react" && (
              <pre>
                {`// React + Axios
axios.post('/api/billing/create-checkout-session', {
  planId: 'pro',
  interval: 'month'
})
.then(res => console.log(res.data))
.catch(err => console.error(err));`}
              </pre>
            )}
          </div>
        </div>
      </section>

      {/* Technical */}
      <section id="technical" className="mb-12">
        <h2 className="text-2xl font-bold mb-2">Technical Implementation</h2>
        <p className="text-foreground mb-4">
          Learn about our database structure, API routes, NLP, and more.
        </p>
        <hr className="my-4" />

        <div id="database-structure" className="mb-6">
          <h3 className="text-xl font-semibold">Database Structure</h3>
          <p className="text-foreground">We use Supabase for storage.</p>
          <div className="text-background p-4 rounded mt-2 overflow-x-auto">
            <pre>
              {`-- Example: Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  company_name TEXT,
  industry TEXT,
  subscription_tier TEXT DEFAULT 'free',
  stripe_customer_id TEXT
);`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function DocsPage() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <MainContent />
    </div>
  );
}
