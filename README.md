# SLTMobitel Customer Feedback System

An AI-powered customer feedback collection and analytics platform developed for **SLTMobitel Matale**.

The system provides a conversational chatbot for collecting customer feedback and a secure administrative dashboard for analysing responses through sentiment classification, interactive visualisations, AI-generated insights, and downloadable reports.

---

## 📌 Overview

The **SLTMobitel Customer Feedback System** modernises the traditional customer feedback process by combining:

* 💬 Conversational feedback collection
* ⭐ Customer service ratings
* 🤖 AI-assisted sentiment analysis
* 📊 Interactive analytics
* 🧠 AI-generated insights and recommendations
* 🗄️ Persistent Supabase database storage
* 📄 Automated Word report generation
* 🔐 Administrator authentication
* ☁️ Cloud deployment using GitHub Pages and Render

Customers can submit feedback through a simple chatbot-style interface, while administrators can monitor customer satisfaction and identify areas requiring improvement through a central dashboard.

---

## ✨ Features

### 💬 Customer Feedback Chatbot

The customer-facing interface provides a simple conversational experience for collecting structured and unstructured feedback.

**Features include:**

* Step-by-step conversational feedback collection
* Service selection:

  * SLT
  * Mobitel
  * Both
* Optional customer phone number
* Waiting-time rating
* Staff knowledge/service rating
* Office environment rating
* Parking rating
* Free-text customer comments
* Real-time sentiment classification
* Responsive design for desktop and mobile devices

---

### 📊 Admin Analytics Dashboard

Administrators can access a dedicated dashboard to monitor customer feedback and satisfaction.

**Dashboard features include:**

* Total feedback count
* Positive feedback count
* Neutral feedback count
* Negative feedback count
* Sentiment percentages
* Service usage statistics
* Waiting-time ratings
* Staff ratings
* Office-environment ratings
* Parking ratings
* Weekly feedback trends
* Complete customer feedback table
* AI-generated summary
* Key findings
* Improvement recommendations

---

### 🤖 AI-Powered Analysis

The system provides automated analysis of customer feedback.

#### Sentiment Classification

Customer comments and ratings can be classified into:

* 🟢 Positive
* 🟡 Neutral
* 🔴 Negative

The backend supports:

* Rule-based sentiment analysis
* Optional Hugging Face Transformers sentiment analysis

The optional Transformer-based analysis can be used through:

```text
backend/analysis.py
```

---

### 🧠 AI Insights

The system can generate an AI-powered summary of customer feedback.

The generated analysis can contain:

* Overall customer satisfaction
* Major positive trends
* Common customer complaints
* Important service issues
* Key findings
* Recommended improvements

The **Negative Feedback Review** functionality can also use Google Gemini to generate suggestions and summaries for negative customer feedback.

---

### 📈 Interactive Charts

The dashboard uses **Chart.js** to display customer feedback visually.

Available visualisations include:

* Sentiment distribution — Doughnut chart
* Service usage — Doughnut chart
* Waiting-time ratings — Bar chart
* Staff ratings — Bar chart
* Office-environment ratings — Bar chart
* Parking ratings — Bar chart
* Weekly feedback trend — Line chart

---

### 📄 Word Report Export

Administrators can download generated reports directly from the dashboard.

Supported exports include:

* AI summary report
* Customer feedback data

Reports are generated server-side using:

```text
python-docx
```

and downloaded as:

```text
.docx
```

files.

---

### 🎨 Premium UI/UX

The system uses a modern corporate interface designed around the SLTMobitel visual identity.

UI features include:

* Modern **Outfit** typography
* Responsive layouts
* Glassmorphism-inspired cards
* Soft shadows
* Smooth animations
* Hover interactions
* Loading skeletons
* Custom scrollbars
* Branded colour variables
* Mobile-friendly interface
* Clean dashboard navigation

---

## 🏗️ System Architecture

```text
                         CUSTOMER
                            │
                            │
                            ▼
                ┌──────────────────────┐
                │   Feedback Chatbot   │
                │                      │
                │ HTML / CSS / JS      │
                └──────────┬───────────┘
                           │
                           │ HTTPS / REST API
                           ▼
                ┌──────────────────────┐
                │    FastAPI Backend   │
                │                      │
                │ /questions           │
                │ /feedback            │
                │ /login               │
                │ /dashboard-data      │
                │ /ai-summary          │
                │ /download-*          │
                └──────────┬───────────┘
                           │
              ┌────────────┴─────────────┐
              │                          │
              ▼                          ▼
     ┌──────────────────┐       ┌──────────────────┐
     │    Supabase      │       │   AI / NLP       │
     │   PostgreSQL      │       │                  │
     │                  │       │ Hugging Face     │
     │ customer_feedback│       │ Gemini (optional)│
     └──────────────────┘       └──────────────────┘
              │
              │
              ▼
     ┌──────────────────────┐
     │   Admin Dashboard    │
     │                      │
     │ Charts               │
     │ KPIs                 │
     │ Feedback             │
     │ AI Insights          │
     │ Reports              │
     └──────────────────────┘
```

---

## ☁️ Deployment Architecture

```text
                   ┌──────────────────────┐
                   │      GitHub          │
                   │      Repository      │
                   └──────────┬───────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
       ┌─────────────────┐        ┌─────────────────┐
       │  GitHub Pages   │        │     Render      │
       │                 │        │                 │
       │ Static Frontend │ HTTPS  │ FastAPI Backend │
       └────────┬────────┘◄──────►└────────┬────────┘
                │                          │
                │                          │
                │                          ▼
                │                  ┌─────────────────┐
                │                  │    Supabase     │
                │                  │   PostgreSQL    │
                │                  └─────────────────┘
                │
                ▼
          Customer Browser
```

---

## 🧰 Technology Stack

| Category            | Technology                                      |
| ------------------- | ----------------------------------------------- |
| Frontend            | HTML5, CSS3, JavaScript                         |
| UI Design           | Custom CSS, Glassmorphism, CSS Animations       |
| Typography          | Outfit                                          |
| Backend             | Python 3.11+                                    |
| API Framework       | FastAPI                                         |
| ASGI Server         | Uvicorn                                         |
| Database            | PostgreSQL                                      |
| Database Platform   | Supabase                                        |
| Charts              | Chart.js                                        |
| AI/NLP              | Rule-based analysis + Hugging Face Transformers |
| Generative AI       | Google Gemini                                   |
| Report Generation   | python-docx                                     |
| Version Control     | Git / GitHub                                    |
| CI/CD               | GitHub Actions                                  |
| Frontend Hosting    | GitHub Pages                                    |
| Backend Hosting     | Render                                          |
| Containerisation    | Docker                                          |
| Alternative Hosting | Hugging Face Spaces                             |

---

## 📁 Project Structure

```text
cfs/
│
├── index.html
│
├── pages/
│   ├── login.html
│   └── dashboard.html
│
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   ├── login.css
│   │   └── dashboard.css
│   │
│   └── js/
│       ├── config.js
│       ├── script.js
│       ├── login.js
│       └── dashboard.js
│
├── backend/
│   ├── __init__.py
│   ├── app.py
│   ├── chatbot.py
│   ├── database.py
│   ├── analysis.py
│   ├── ai_summary.py
│   └── requirements.txt
│
├── .github/
│   └── workflows/
│       └── pages.yml
│
├── .env.example
├── Dockerfile
├── render.yaml
├── LICENSE
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Before running the system locally, install:

* Python 3.11 or later
* Git
* A Supabase account
* A Supabase PostgreSQL project
* A Google Gemini API key if AI-powered negative feedback analysis is required

---

## 1. Clone the Repository

```bash
git clone https://github.com/slt-matale/cfs.git
cd cfs
```

---

## 2. Create a Virtual Environment

### Windows

```bash
python -m venv venv
```

Activate it:

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

---

## 3. Install Dependencies

```bash
pip install -r backend/requirements.txt
```

---

# 🗄️ Supabase Database Setup

Create a Supabase project and create a table named:

```text
customer_feedback
```

Recommended schema:

| Column       | Type          | Description                    |
| ------------ | ------------- | ------------------------------ |
| `id`         | `int8`        | Primary key                    |
| `service`    | `text`        | SLT / Mobitel / Both           |
| `phone`      | `text`        | Optional customer phone number |
| `waiting`    | `text`        | Waiting-time rating            |
| `staff`      | `text`        | Staff rating                   |
| `office`     | `text`        | Office-environment rating      |
| `parking`    | `text`        | Parking rating                 |
| `comment`    | `text`        | Customer comment               |
| `sentiment`  | `text`        | Positive / Neutral / Negative  |
| `created_at` | `timestamptz` | Feedback submission time       |

Set:

```text
id
```

as the primary key with automatic identity/increment.

Set:

```text
created_at
```

to default to:

```sql
now()
```

---

# 🔐 Environment Variables

Create a `.env` file based on `.env.example`.

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key

ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-secure-password

GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash
```

### Important Security Notice

**Never commit your `.env` file to GitHub.**

Make sure `.gitignore` contains:

```gitignore
.env
venv/
__pycache__/
*.pyc
```

Never publish:

* Supabase secret/service-role keys
* Gemini API keys
* Production administrator passwords
* Other private credentials

If a secret is accidentally committed, rotate/revoke it immediately.

---

# ▶️ Running the Backend Locally

From the project root:

```bash
uvicorn backend.app:app --reload
```

The API will run at:

```text
http://127.0.0.1:8000
```

FastAPI documentation will be available at:

```text
http://127.0.0.1:8000/docs
```

and:

```text
http://127.0.0.1:8000/redoc
```

---

# 🌐 Running the Frontend Locally

Update:

```text
assets/js/config.js
```

with:

```javascript
const API_BASE_URL = "http://127.0.0.1:8000";
```

Then serve the project using a local HTTP server.

For example:

```bash
python -m http.server 5500
```

Open:

```text
http://127.0.0.1:5500
```

Using a local HTTP server is recommended instead of opening the HTML file directly with `file://`.

---

# 📡 API Reference

| Method | Endpoint                      | Description                              |
| ------ | ----------------------------- | ---------------------------------------- |
| `GET`  | `/`                           | API health check                         |
| `GET`  | `/questions`                  | Returns chatbot questions                |
| `POST` | `/feedback`                   | Submits customer feedback                |
| `POST` | `/login`                      | Administrator authentication             |
| `GET`  | `/dashboard-data`             | Returns dashboard analytics and feedback |
| `GET`  | `/ai-summary`                 | Generates AI feedback summary            |
| `GET`  | `/download-ai-summary`        | Downloads AI summary as `.docx`          |
| `GET`  | `/download-customer-feedback` | Downloads feedback as `.docx`            |
| `GET`  | `/test-supabase`              | Tests Supabase connectivity              |

---

# 📨 Submit Feedback

Example request:

```bash
curl -X POST https://your-api.onrender.com/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "service": "SLT",
    "phone": "0771234567",
    "waiting": "Good",
    "staff": "Excellent",
    "office": "Average",
    "parking": "Good",
    "comment": "Friendly and helpful staff"
  }'
```

Example response:

```json
{
  "message": "Feedback submitted successfully"
}
```

---

# 📊 Dashboard Data

The `/dashboard-data` endpoint provides aggregated information used by the administrator dashboard.

Typical response structure:

```json
{
  "total_feedback": 100,
  "sentiment": {
    "positive": 65,
    "neutral": 25,
    "negative": 10
  },
  "service": {
    "SLT": 30,
    "Mobitel": 45,
    "Both": 25
  },
  "waiting": {},
  "office": {},
  "staff": {},
  "parking": {},
  "feedback": []
}
```

The frontend uses this information to generate dashboard KPIs, charts, and feedback tables.

---

# 🤖 AI Analysis

The system supports multiple levels of automated feedback analysis.

## Rule-Based Analysis

The backend can classify feedback using:

* Customer ratings
* Positive keywords
* Negative keywords
* Overall response patterns

This provides a lightweight analysis method without requiring a large AI model.

---

## Hugging Face Transformers

Optional Transformer-based sentiment analysis can be enabled through:

```text
backend/analysis.py
```

This provides a more advanced NLP-based sentiment classification approach.

---

## Google Gemini

Google Gemini can optionally be used for:

* Negative feedback summaries
* Improvement suggestions
* AI-generated recommendations
* Customer experience analysis

Required environment variable:

```env
GEMINI_API_KEY=your-api-key
```

Optional model configuration:

```env
GEMINI_MODEL=gemini-2.5-flash
```

The rest of the system can operate without Gemini if the Negative Feedback Review AI functionality is not required.

---

# ☁️ Deployment

## Backend — Render

The backend can be deployed as a Render Web Service.

### Build Command

```bash
pip install -r backend/requirements.txt
```

### Start Command

```bash
uvicorn backend.app:app --host 0.0.0.0 --port $PORT
```

Set the following environment variables in Render:

```text
SUPABASE_URL
SUPABASE_KEY
ADMIN_USERNAME
ADMIN_PASSWORD
GEMINI_API_KEY
GEMINI_MODEL
```

After deployment, Render provides a backend URL similar to:

```text
https://your-service.onrender.com
```

Update the frontend configuration:

```javascript
const API_BASE_URL = "https://your-service.onrender.com";
```

### Render Free Tier

On Render's free tier, the service may spin down after a period of inactivity. The first request after inactivity may therefore take longer while the service starts again.

---

# 🌍 Frontend — GitHub Pages

The frontend is static and can be deployed using GitHub Pages.

The repository contains:

```text
.github/workflows/pages.yml
```

which can automatically deploy the frontend through GitHub Actions.

### Setup

1. Push the repository to GitHub.
2. Open the repository.
3. Go to:

```text
Settings → Pages
```

4. Select:

```text
Source → GitHub Actions
```

5. Push changes to the `main` branch.

GitHub Actions will deploy the frontend automatically.

---

# 🐳 Docker Deployment

A Dockerfile is included for containerised deployment.

Build the image:

```bash
docker build -t cfs .
```

Run:

```bash
docker run -p 7860:7860 \
  -e SUPABASE_URL=your-url \
  -e SUPABASE_KEY=your-key \
  -e ADMIN_USERNAME=your-admin \
  -e ADMIN_PASSWORD=your-password \
  cfs
```

The application is configured to expose port:

```text
7860
```

This makes the project suitable for Docker-based hosting environments such as Hugging Face Spaces.

---

# 🔧 Environment Variable Reference

| Variable         | Required | Default            | Description            |
| ---------------- | -------: | ------------------ | ---------------------- |
| `SUPABASE_URL`   |        ✅ | —                  | Supabase project URL   |
| `SUPABASE_KEY`   |        ✅ | —                  | Supabase API key       |
| `ADMIN_USERNAME` |        ❌ | `admin`            | Administrator username |
| `ADMIN_PASSWORD` |        ❌ | `admin123`         | Administrator password |
| `GEMINI_API_KEY` |       ⚠️ | —                  | Gemini API key         |
| `GEMINI_MODEL`   |        ❌ | `gemini-2.5-flash` | Gemini model           |

> `GEMINI_API_KEY` is required only when Gemini-powered functionality is enabled.

For production, always replace default credentials with strong credentials.

---

# 🔒 Security Considerations

This project is intended for demonstration, educational, internship, and controlled deployment purposes.

Before using it in a production environment, consider implementing:

* Password hashing
* JWT or secure session authentication
* Role-based access control
* HTTPS-only communication
* Secure cookie configuration
* API rate limiting
* Input validation and sanitisation
* Strong CORS configuration
* Secret management
* Database Row Level Security
* Audit logging
* CSRF protection where applicable
* Secure password policies

### Never expose server-side secrets

Do not place sensitive credentials inside:

```text
index.html
dashboard.html
JavaScript files
CSS files
GitHub repository
README.md
```

Server-side credentials should remain in environment variables.

---

# 🔄 Feedback Processing Workflow

```text
Customer
   │
   ▼
Open Feedback Chatbot
   │
   ▼
Answer Questions
   │
   ▼
Submit Feedback
   │
   ▼
FastAPI Backend
   │
   ├───────────────┐
   │               │
   ▼               ▼
Validation     Sentiment Analysis
   │               │
   └───────┬───────┘
           ▼
      Supabase DB
           │
           ▼
     Dashboard API
           │
           ▼
    Admin Dashboard
           │
      ┌────┴─────┐
      ▼          ▼
 Analytics      AI Insights
      │          │
      └────┬─────┘
           ▼
       Reports
```

---

# 📱 User Flow

### Customer

```text
Open Feedback System
        ↓
Select Service
        ↓
Enter Optional Phone Number
        ↓
Rate Waiting Time
        ↓
Rate Staff
        ↓
Rate Office Environment
        ↓
Rate Parking
        ↓
Enter Comment
        ↓
Submit Feedback
        ↓
Feedback Stored in Supabase
```

### Administrator

```text
Admin Login
     ↓
Dashboard
     ↓
View KPIs
     ↓
Analyse Charts
     ↓
Review Customer Feedback
     ↓
View AI Insights
     ↓
Review Negative Feedback
     ↓
Generate Reports
```

---

# 🧪 Testing

Before deployment, verify the following:

### Backend

```bash
uvicorn backend.app:app --reload
```

Check:

```text
GET /
GET /questions
GET /test-supabase
```

### Database

Confirm that customer responses are being inserted into:

```text
customer_feedback
```

### Frontend

Test:

* Chatbot navigation
* All feedback questions
* Optional phone field
* Sinhala/Unicode text if supported
* Feedback submission
* Error handling
* Mobile responsiveness

### Dashboard

Verify:

* Total feedback
* Sentiment counts
* Service distribution
* Rating charts
* Weekly trend
* Feedback table
* AI summary
* Word exports

---

# 🛠️ Troubleshooting

## Backend cannot connect

Check that the backend is running:

```bash
uvicorn backend.app:app --reload
```

Then visit:

```text
http://127.0.0.1:8000/
```

---

## Frontend shows "Failed to fetch"

Check:

1. FastAPI is running.
2. `API_BASE_URL` is correct.
3. The backend URL is accessible.
4. CORS configuration allows the frontend domain.
5. The Render service has finished starting.

---

## Dashboard shows zero feedback

Check:

1. Supabase credentials.
2. `customer_feedback` table name.
3. Database column names.
4. `/dashboard-data` response.
5. Browser developer console.
6. Backend terminal logs.

---

## Feedback is not saved

Check:

```text
POST /feedback
```

and verify that the request body matches the backend model.

Then verify the Supabase table directly.

---

## AI Summary does not work

Check:

```env
GEMINI_API_KEY=your-api-key
```

and verify that the selected model is available.

For example:

```env
GEMINI_MODEL=gemini-2.5-flash
```

---

# 📷 Screenshots

Add screenshots of the system here once available.

### Customer Feedback Chatbot

```text
docs/screenshots/customer-chatbot.png
```

### Admin Login

```text
docs/screenshots/admin-login.png
```

### Analytics Dashboard

```text
docs/screenshots/dashboard.png
```

### AI Insights

```text
docs/screenshots/ai-insights.png
```

### Negative Feedback Review

```text
docs/screenshots/negative-feedback.png
```

Recommended repository structure:

```text
docs/
└── screenshots/
    ├── customer-chatbot.png
    ├── admin-login.png
    ├── dashboard.png
    ├── ai-insights.png
    └── negative-feedback.png
```

---

# 📈 Future Improvements

Potential future enhancements include:

* 🔐 JWT-based authentication
* 👥 Multiple administrator roles
* 📧 Automatic negative-feedback email notifications
* 📱 Progressive Web App support
* 🌐 Sinhala / Tamil / English multilingual chatbot
* 📊 Advanced customer segmentation
* 📍 Branch-level analytics
* 📈 Predictive customer satisfaction analysis
* 🔔 Real-time dashboard notifications
* 🤖 More advanced LLM-powered feedback classification
* 📤 Excel and PDF report exports
* 📅 Custom date-range analytics
* 🔎 Advanced feedback search and filtering
* 🧾 Audit logs
* 🔒 Enhanced database security using Row Level Security
* 📱 QR-code-based branch feedback access

---

# 🤝 Contributing

Contributions and improvements are welcome.

### 1. Fork the repository

```bash
git clone https://github.com/slt-matale/cfs.git
```

### 2. Create a feature branch

```bash
git checkout -b feature/your-feature
```

### 3. Make your changes

Test the application locally before committing.

### 4. Commit your changes

```bash
git add .
git commit -m "Add your feature"
```

### 5. Push your branch

```bash
git push origin feature/your-feature
```

### 6. Open a Pull Request

Describe:

* What was changed
* Why the change was needed
* How it was tested

---

# 📜 License

This project is licensed under the **MIT License**.

See the [`LICENSE`](LICENSE) file for the complete license text.

```text
MIT License

Copyright (c) 2026 SLT Matale
```

---

# 👨‍💻 Project Information

**Project:** SLTMobitel Customer Feedback System

**Organisation:** SLT Matale

**Purpose:** Customer feedback collection, analytics, sentiment analysis, and AI-assisted customer experience improvement.

**Repository:**
https://github.com/slt-matale/cfs

---

# ⭐ Acknowledgements

This project uses and/or is inspired by the following technologies and services:

* FastAPI
* Python
* Supabase
* PostgreSQL
* Chart.js
* Hugging Face Transformers
* Google Gemini
* python-docx
* GitHub Actions
* GitHub Pages
* Render
* Docker

---

# 📌 Project Status

**Status:** Active Development

The system is designed to support customer feedback collection and analytics for the SLTMobitel Matale environment, with the architecture allowing future expansion to additional branches and services.

---

<p align="center">

**SLTMobitel Customer Feedback System**

AI-powered customer experience analytics and feedback management.

</p>
