"""
Mahi Technocrafts - Web Dashboard for Lead Automation
Run with: streamlit run app.py
"""

import streamlit as st
import pandas as pd
import json
import os
import sys

# Ensure local imports work
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from scrapers.local_business_scraper import LocalBusinessScraper
from scrapers.yc_startup_scraper import YCStartupScraper
from scrapers.website_auditor import WebsiteAuditor
from enrichment.email_verifier import EmailVerifier
from crm.exporter import LeadExporter

st.set_page_config(
    page_title="Mahi Technocrafts - Lead Automation Engine",
    page_icon="🚀",
    layout="wide"
)

st.title("🚀 Mahi Technocrafts — Automated Lead Generation Engine")
st.caption("AI-Powered B2B & Local Lead Sourcing, Verification, and Outreach")

tab1, tab2, tab3, tab4, tab5 = st.tabs([
    "📍 Local Business Leads (India/Global)",
    "💼 Tech Startup Founders (YC)",
    "🔍 Live Website Auditor & Pitch Generator",
    "✉️ Free Email Verifier (SMTP)",
    "📱 Outreach & WhatsApp Templates"
])

# ----------------- TAB 1: Local Business Leads -----------------
with tab1:
    st.subheader("Find High-Value Local Business Leads")
    st.markdown("Target businesses with **no website** or **poor digital presence**.")

    col1, col2, col3 = st.columns([2, 2, 1])
    with col1:
        category = st.text_input("Business Category / Niche", value="Doctors", placeholder="e.g. Doctors, Real Estate, Coaching, Hotels")
    with col2:
        location = st.text_input("City / Region", value="Bhopal", placeholder="e.g. Bhopal, Indore, Pune, Delhi, Mumbai")
    with col3:
        max_results = st.number_input("Max Leads", min_value=5, max_value=150, value=20, step=5)

    if st.button("🔎 Extract Leads", type="primary"):
        with st.spinner(f"🚀 Scanning live Google Maps for {category} in {location} (auto-scrolling feed)..."):
            scraper = LocalBusinessScraper()
            leads = scraper.scrape(query=category, location=location, max_results=max_results)
            
            if leads:
                st.success(f"Found {len(leads)} leads for {category} in {location}!")
                exporter = LeadExporter()
                filepath = exporter.export_local_leads(leads, filename_prefix=f"{category.lower()}_{location.lower()}")
                
                df = pd.read_csv(filepath)
                st.dataframe(
                    df,
                    column_config={
                        "Google Maps Link": st.column_config.LinkColumn("Google Maps", display_text="📍 View on Maps"),
                        "One-Click WhatsApp Link": st.column_config.LinkColumn("WhatsApp Chat", display_text="💬 Open WhatsApp")
                    },
                    use_container_width=True
                )

                col_d1, col_d2 = st.columns(2)
                with col_d1:
                    st.download_button(
                        label="📥 Download CSV File",
                        data=open(filepath, "rb").read(),
                        file_name=os.path.basename(filepath),
                        mime="text/csv"
                    )
                with col_d2:
                    excel_path = filepath.replace(".csv", ".xlsx")
                    if os.path.exists(excel_path):
                        st.download_button(
                            label="📊 Download Excel (.xlsx) File",
                            data=open(excel_path, "rb").read(),
                            file_name=os.path.basename(excel_path),
                            mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        )
            else:
                st.warning("No leads found with those keywords. Try a broader category.")

# ----------------- TAB 2: Tech Startups -----------------
with tab2:
    st.subheader("Find Funded Startup Founders for Web & MVP Dev")
    col1, col2, col3 = st.columns([1, 2, 1])
    with col1:
        batch = st.selectbox("YC Batch", ["W24", "S23", "W23", "S22", "All"])
    with col2:
        industry = st.text_input("Industry / Tech Focus", placeholder="e.g. AI, SaaS, Fintech, B2B")
    with col3:
        limit_yc = st.number_input("Count", min_value=3, max_value=30, value=10)

    if st.button("🚀 Fetch Startup Founders"):
        with st.spinner("Fetching tech startup launches..."):
            scraper = YCStartupScraper()
            yc_leads = scraper.scrape(batch=batch, industry=industry, limit=limit_yc)
            if yc_leads:
                st.success(f"Fetched {len(yc_leads)} tech startups!")
                exporter = LeadExporter()
                filepath = exporter.export_startup_leads(yc_leads)
                df_yc = pd.read_csv(filepath)
                st.dataframe(df_yc, use_container_width=True)

# ----------------- TAB 3: Website Auditor -----------------
with tab3:
    st.subheader("Live Website Audit & Sales Hook Generator")
    st.markdown("Paste a prospect's website to identify speed, mobile layout, and SEO flaws you can pitch to fix.")
    
    target_url = st.text_input("Prospect Website URL", placeholder="e.g. https://example-business.com")
    if st.button("⚡ Run Audit"):
        if target_url:
            with st.spinner("Analyzing performance, SSL, responsive tags, and tech stack..."):
                auditor = WebsiteAuditor()
                report = auditor.audit(target_url)

                col_a, col_b, col_c = st.columns(3)
                col_a.metric("Load Time", f"{report['load_time_seconds']} sec", delta="Needs Speedup" if report['load_time_seconds'] > 2 else "Good")
                col_b.metric("SSL Secure", "Yes" if report['has_ssl'] else "No ❌")
                col_c.metric("Mobile Viewport", "Yes" if report['mobile_viewport'] else "Missing ❌")

                st.markdown("### ⚠️ Identified Bottlenecks")
                if report["pain_points"]:
                    for p in report["pain_points"]:
                        st.error(f"• {p}")
                else:
                    st.info("No major basic errors detected.")

                st.markdown("### 🎯 Ready-Made Sales Pitch Hook for Mahi Technocrafts")
                st.success(f"\"{report['pitch_hook']}\"")
        else:
            st.warning("Please enter a valid website URL.")

# ----------------- TAB 4: Email Verifier -----------------
with tab4:
    st.subheader("Free SMTP Email Verifier (Zero Cost)")
    st.markdown("Verify if an email exists before sending cold outreach to protect domain reputation.")
    email_to_check = st.text_input("Enter Email Address", placeholder="e.g. founder@domain.com")
    if st.button("Verify Email"):
        if email_to_check:
            with st.spinner("Testing MX server connection..."):
                verifier = EmailVerifier()
                res = verifier.verify(email_to_check)
                if res["smtp_valid"]:
                    st.success(f"✅ {res['status']}: {res['message']}")
                else:
                    st.warning(f"⚠️ {res['status']}: {res['message']}")
                st.json(res)

# ----------------- TAB 5: Outreach Templates -----------------
with tab5:
    st.subheader("High-Converting Outreach Templates")
    template_type = st.radio("Choose Channel", ["WhatsApp Pitches (Local Clients)", "Cold Email Pitches (Startups & Web Redesign)"])
    
    if "WhatsApp" in template_type:
        wa_path = os.path.join(os.path.dirname(__file__), "templates", "whatsapp_pitches.json")
        with open(wa_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        for key, val in data.items():
            with st.expander(val["title"]):
                st.markdown("**Hinglish (Best for WhatsApp India):**")
                st.code(val["template_hinglish"])
                st.markdown("**English:**")
                st.code(val["template_english"])
    else:
        em_path = os.path.join(os.path.dirname(__file__), "templates", "email_pitches.json")
        with open(em_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        for key, val in data.items():
            with st.expander(val["subject"]):
                st.code(val["body"])
