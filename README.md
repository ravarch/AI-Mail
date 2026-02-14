# AI Secure Mail (React SPA on Cloudflare Workers)

**Overview:**
This project is a sophisticated, full-stack "Disposable/Secure Identity" email service. It is built as a Single Page Application (SPA) using **React 19** and **Tailwind CSS 4**, hosted entirely on **Cloudflare Workers**.

**Core Logic:**
The application functions as a monorepo-style serverless app. The Cloudflare Worker handles both serving the static React assets and running the Hono-based backend API.

**Key Features & Architecture:**

1. **AI-Powered Context:** Every incoming email is intercepted by the Worker, parsed, and analyzed by **Llama-3 (via Workers AI)** to generate a 2-sentence summary and detect attachment types before the user even opens the email.
2. **Real-Time Updates:** It uses **Cloudflare Durable Objects** to manage WebSocket connections. When a new email arrives, the backend pushes the data instantly to the connected frontend client without polling.
3. **Hybrid Storage Strategy:**
* **Cloudflare D1 (SQLite):** Stores user credentials (identities) and lightweight email metadata (sender, subject, AI summary, read status).
* **Cloudflare R2 (Object Storage):** Stores the raw, heavy JSON structure of the parsed email content to ensure performance and scalability.


4. **Modern Frontend:**
* Built with React 19 and Vite 7.
* Styled with Tailwind CSS v4.
* Animations powered by Framer Motion.
* Includes a responsive Mobile Sidebar and "Glassmorphism" UI design.


5. **Secure Communication:**
* Generates random identities (Username/Password).
* Supports end-to-end encryption principles (stored secure password).
* Allows replying to emails via Cloudflare Email Routing.



---

### **Generated README.md**

Below is the ready-to-use Markdown file. You can copy this directly into your `README.md`.

```markdown
# AI Secure Mail 🛡️

A modern, serverless, AI-powered email service built on **Cloudflare Workers**, **React 19**, and **Hono**. This application allows users to generate secure email identities, receive emails in real-time via WebSockets, and get instant content summaries via Llama-3.

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-orange?logo=cloudflare)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)

## 🚀 Features

-   **🤖 AI Analysis:** Incoming emails are automatically summarized by `Meta Llama-3-8b` to provide quick context and safety checks.
-   **⚡ Real-time Inbox:** Uses **Durable Objects** and WebSockets to push new emails to the client instantly (no page refreshes).
-   **🔒 Secure Identities:** Generate random, persistent credentials or log in with existing ones.
-   **☁️ Serverless Architecture:** Hosted entirely on the Edge. No traditional servers.
    -   **Storage:** Raw email content in **R2**, Metadata in **D1**.
    -   **Backend:** Hono API running on Cloudflare Workers.
-   **📱 Modern UI:** Fully responsive design with Dark/Light glassmorphism aesthetics, built with Tailwind v4 and Framer Motion.
-   **reply Functionality:** Send replies directly from the interface.

## 🛠️ Tech Stack

**Frontend:**
* React 19
* Vite 7
* Tailwind CSS v4
* Framer Motion (Animations)
* Lucide React (Icons)

**Backend (Edge):**
* Cloudflare Workers
* Hono (Web Framework)
* Durable Objects (WebSockets)
* Cloudflare D1 (SQLite Database)
* Cloudflare R2 (Object Storage)
* Workers AI (Llama-3 Inference)
* PostalMime (Email Parsing)

## 📂 Project Structure

```bash
├── public/              # Static assets
├── src/
│   ├── components/      # React components (TelegramBanner, etc.)
│   ├── App.tsx          # Main React Application Logic
│   ├── index.css        # Tailwind V4 Imports
│   └── index.ts         # Backend Logic (Hono API + Email Worker)
├── wrangler.jsonc       # Cloudflare Infrastructure Config
├── package.json         # Dependencies
└── vite.config.ts       # Build configuration

```

## ⚙️ Prerequisites

1. **Node.js** (v20+ recommended)
2. **Cloudflare Account**
3. **Wrangler CLI** installed globally: `npm install -g wrangler`

## 📦 Installation & Setup

1. **Clone the repository:**
```bash
git clone https://github.com/ravarch/AI-Mail
cd AI-Mail

```


2. **Install dependencies:**
```bash
npm install

```


3. **Setup Cloudflare Infrastructure:**
You need to create the specific resources defined in `wrangler.jsonc`.
* **Create D1 Database:**
```bash
npx wrangler d1 create saas-db-prod

```


*Update the `database_id` in `wrangler.jsonc` with the ID output from this command.*
* **Create R2 Bucket:**
```bash
npx wrangler r2 bucket create mail-storage

```


* **Initialize Database Schema:**
Create a file named `schema.sql` (if not present) with the following content, then execute it:
```sql
CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY,
    password TEXT
);
CREATE TABLE IF NOT EXISTS emails (
    id TEXT PRIMARY KEY,
    username TEXT,
    sender TEXT,
    subject TEXT,
    snippet TEXT,
    raw_r2_key TEXT,
    has_attachments INTEGER DEFAULT 0,
    is_read INTEGER DEFAULT 0,
    ai_summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_emails_user ON emails(username);

```


**Apply Schema:**
```bash
npx wrangler d1 execute saas-db-prod --local --file=./schema.sql

```




4. **Configure Variables:**
Update `wrangler.jsonc` with your domain:
```json
"vars": {
    "DOMAIN": "yourdomain.com",
    "JWT_SECRET": "your-secret-key"
}

```



## 🏃‍♂️ Development

Run the frontend and backend locally. Since this uses Hono + Vite + Cloudflare, we use Wrangler to emulate the environment.

```bash
npm run dev

```

*Access the app at `http://localhost:8787*`

## 🚀 Deployment

1. **Build the Frontend:**
```bash
npm run build

```


*This generates the `dist` folder which `wrangler` will serve as assets.*
2. **Deploy to Cloudflare:**
```bash
npm run deploy

```


3. **Connect Email Routing:**
In your Cloudflare Dashboard > Email > Email Routing:
* Enable Email Routing for your domain.
* Go to **Routes**.
* Create a "Catch-all" rule or specific address rule.
* **Action:** "Send to a Worker".
* **Destination:** Select your deployed `react-spa` worker.



## 📧 Usage

1. Open the deployed URL.
2. Click **"Generate Identity"** to create a fresh inbox.
3. Send an email to the generated address (e.g., `user123@yourdomain.com`).
4. Watch it appear instantly in the inbox with an AI-generated summary!

## 🤝 Community

Join the discussion and get support:
<a href="https://t.me/drkingbd">
<img src="https://www.google.com/search?q=https://img.shields.io/badge/Telegram-Channel-blue%3Fstyle%3Dfor-the-badge%26logo%3Dtelegram" alt="Telegram" />
</a>

## 📄 License

This project is open source.

### **Notes for the User (Implementation Details)**

Based on the files provided, here are a few critical things you need to do to make this work 100%:

1.  **Missing Schema:** The code references tables (`users`, `emails`) but no SQL file was included. I have inferred the schema in the "Installation" section above based on the `INSERT` and `SELECT` statements in `src/index.ts`. You **must** run that SQL against your D1 database.
2.  **Email Routing Binding:** In `wrangler.jsonc`, you have `"send_email"`. Ensure you have verified the destination address (`admin@drkingbd.cc`) in your Cloudflare dashboard under Email Routing > Settings, or you won't be able to reply to emails.
3.  **Workers AI:** Ensure your Cloudflare plan supports Workers AI (Llama-3) or that you have enabled the beta features if required.
