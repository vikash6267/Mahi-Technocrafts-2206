# 🚀 Mahi Technocrafts — Lead Automation Suite

Mahi Technocrafts ke liye banaya gaya complete Automated Lead Generation, Scraping, Verification aur Outreach System.

---

## 📁 Folder Structure

```
leads-automation/
├── scrapers/
│   ├── local_business_scraper.py   # Local businesses (Google/Maps) finder with Lead Scoring
│   ├── yc_startup_scraper.py       # YC funded tech startups & founder email predictor
│   └── website_auditor.py          # Live website performance & SEO auditor for personalized pitch
├── enrichment/
│   └── email_verifier.py           # Free direct SMTP email check (Zero API cost)
├── templates/
│   ├── whatsapp_pitches.json       # High-converting WhatsApp messages (Hinglish/English)
│   └── email_pitches.json          # Cold email pitch templates for founders & redesigns
├── crm/
│   └── exporter.py                 # Exports to CSV/Excel with 1-Click direct WhatsApp chat links
├── data/                           # Scraped leads CSV/Excel files yahan save honge
├── main.py                         # Interactive Terminal CLI tool
├── app.py                          # Beautiful Browser Web UI (Streamlit)
└── requirements.txt
```

---

## ⚡ Quick Start (2 Ways to Run)

### Method 1: Web UI (Sabse Easy — Recommended)
Browser me chalane ke liye terminal me ye command run karein:
```bash
cd leads-automation
streamlit run app.py
```
👉 Browser me `http://localhost:8501` automatically open ho jayega jahan aap point-and-click se leads nikal sakte hain!

---

### Method 2: Terminal CLI
Agar aap terminal pasand karte hain:
```bash
cd leads-automation
python main.py
```

---

## 🎯 How to Get Leads Daily for Mahi Technocrafts

### 1. Local B2B Clients (High Conversion on WhatsApp)
1. **Niche aur City select karein:** (e.g. *Doctors in Bhopal*, *Builders in Indore*, *Coaching in Delhi*).
2. Scraper run karein.
3. System automatic **Lead Score (0-100)** calculate karega:
   - **Score 90-100:** Inke paas koi website nahi hai! Inhe direct new website offer karein.
   - **Score 60-80:** Inki website purani hai ya sirf directory listing hai. Inhe redesign/SEO offer karein.
4. **Excel Download karein:** Excel file me har ek lead ke aage **"One-Click WhatsApp Link"** hoga. Sirf link par click karein aur WhatsApp pe pre-filled tailored pitch chali jayegi!

### 2. High-Budget Tech Startups (MVP & Custom Next.js Dev)
1. YC Batch select karein (e.g. W24, S23).
2. Found founders ke predicted emails nikalen.
3. Cold email template use karke reach-out karein: *"We build Next.js apps in under 3 weeks"*.

### 3. Website Audit se Client Convert Karein
1. Kisi bhi prospect ki website ka URL **Website Auditor** me dalein.
2. Tool uski speed, mobile responsiveness, aur tech stack check karke exact **Pain Points** nikaal dega.
3. Client ko wahi specific pain points dikha kar pitch karein.

---

## 💡 Outreach Channels

- **India / Local Clients:** WhatsApp + Phone Call (90%+ open rate)
- **International / SaaS Clients:** Cold Email (via `warmbly` or standard email)
