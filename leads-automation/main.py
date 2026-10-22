"""
Mahi Technocrafts - Automated Lead Engine CLI
Interactive terminal for finding, qualifying, and pitching leads.
"""

import sys
import os
import json

# Ensure local imports work
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from scrapers.local_business_scraper import LocalBusinessScraper
from scrapers.yc_startup_scraper import YCStartupScraper
from scrapers.website_auditor import WebsiteAuditor
from enrichment.email_verifier import EmailVerifier
from crm.exporter import LeadExporter

def banner():
    print("""
========================================================================
    🚀 MAHI TECHNOCRAFTS - AUTOMATED LEAD ENGINE (V1.0)
    Web Dev | Mobile Apps | Custom Software | SEO Leads
========================================================================
    """)

def menu():
    print("Select an option:")
    print("  [1] Find Local Business Leads (Google / Open Maps - India/Global)")
    print("  [2] Find Funded Startup Founder Leads (YC / Tech Startups)")
    print("  [3] Run Live Website Audit on a Prospect (Generate Custom Pitch)")
    print("  [4] Verify Email Address (Free SMTP MX Check)")
    print("  [5] View Outreach Pitches (WhatsApp & Cold Email Templates)")
    print("  [6] Launch Interactive Web Dashboard (Streamlit UI)")
    print("  [0] Exit")
    print("------------------------------------------------------------------------")

def handle_local_leads():
    query = input("\nEnter Business Category (e.g., Doctors, Real Estate, Coaching, Restaurants): ").strip()
    location = input("Enter City / Region (e.g., Bhopal, Indore, Delhi, Mumbai, Jaipur): ").strip()
    limit = input("Max leads to find (default: 15): ").strip()
    limit = int(limit) if limit.isdigit() else 15

    scraper = LocalBusinessScraper()
    leads = scraper.scrape(query=query, location=location, max_results=limit)

    if not leads:
        print("\n[-] No leads found. Try a broader search term.")
        return

    print(f"\n[+] Found {len(leads)} leads:")
    for i, l in enumerate(leads, 1):
        print(f" {i}. [{l['lead_score']}/100 Score] {l['name']} | Ph: {l['phone']} | Web: {l['website']}")

    exporter = LeadExporter()
    filepath = exporter.export_local_leads(leads, filename_prefix=f"{query.lower().replace(' ', '_')}_{location.lower()}")
    print(f"\n[✓] Exported to CSV/Excel with 1-Click WhatsApp Direct Links:\n    {filepath}\n")

def handle_startup_leads():
    batch = input("\nEnter YC Batch (e.g. W24, S23, W23) [Default W24]: ").strip() or "W24"
    industry = input("Industry filter (e.g. SaaS, AI, Health, B2B) [Optional]: ").strip()
    limit = input("Max companies to find (default: 10): ").strip()
    limit = int(limit) if limit.isdigit() else 10

    scraper = YCStartupScraper()
    leads = scraper.scrape(batch=batch, industry=industry, limit=limit)

    print(f"\n[+] Found {len(leads)} Tech Startups:")
    for i, l in enumerate(leads, 1):
        emails = ", ".join(l.get("predicted_emails", [])[:2])
        print(f" {i}. {l['company_name']} ({l['batch']}) | Web: {l['website']} | Emails: {emails}")

    exporter = LeadExporter()
    filepath = exporter.export_startup_leads(leads, filename_prefix="startup_leads")
    print(f"\n[✓] Exported to CSV:\n    {filepath}\n")

def handle_website_audit():
    url = input("\nEnter website URL to audit (e.g. example.com): ").strip()
    if not url:
        return
    print(f"\n[*] Auditing {url}...")
    auditor = WebsiteAuditor()
    report = auditor.audit(url)

    print("\n" + "=" * 50)
    print(f"AUDIT REPORT FOR: {report['target_url']}")
    print(f"Status: {report['status']} (Load Time: {report['load_time_seconds']}s)")
    print(f"SSL Secured: {'YES' if report['has_ssl'] else 'NO (Insecure!)'}")
    print(f"Mobile Viewport: {'YES' if report['mobile_viewport'] else 'NO (Distorted layout!)'}")
    print(f"Tech Stack Detected: {', '.join(report['tech_stack']) if report['tech_stack'] else 'Standard'}")
    
    if report["pain_points"]:
        print("\nIdentified Bottlenecks:")
        for p in report["pain_points"]:
            print(f"  • {p}")
    
    print("\nTailored Pitch Hook for Mahi Technocrafts:")
    print(f"\"{report['pitch_hook']}\"")
    print("=" * 50 + "\n")

def handle_email_verify():
    email = input("\nEnter email address to verify (e.g. founder@domain.com): ").strip()
    if not email:
        return
    print(f"\n[*] Checking mail exchange and mailbox for: {email}...")
    verifier = EmailVerifier()
    res = verifier.verify(email)

    print(f"\nResult:")
    print(f"  Status: {res['status']}")
    print(f"  Syntax Valid: {res['format_valid']}")
    print(f"  MX Records Found: {res['mx_found']}")
    print(f"  Deliverable: {res['smtp_valid']}")
    print(f"  Details: {res['message']}\n")

def handle_view_pitches():
    print("\n--- Available Pitch Templates ---")
    print("1. Doctors / Clinics (WhatsApp)")
    print("2. Businesses with NO Website (WhatsApp)")
    print("3. Coaching Institutes (WhatsApp)")
    print("4. Tech Startups / MVP Development (Cold Email)")
    print("5. Website Redesign & Speed Audit (Cold Email)")
    choice = input("Select template (1-5): ").strip()

    wa_path = os.path.join(os.path.dirname(__file__), "templates", "whatsapp_pitches.json")
    em_path = os.path.join(os.path.dirname(__file__), "templates", "email_pitches.json")

    with open(wa_path, "r", encoding="utf-8") as f:
        wa_data = json.load(f)
    with open(em_path, "r", encoding="utf-8") as f:
        em_data = json.load(f)

    if choice == "1":
        print("\n" + wa_data["doctor_clinic"]["template_hinglish"] + "\n")
    elif choice == "2":
        print("\n" + wa_data["business_without_website"]["template_hinglish"] + "\n")
    elif choice == "3":
        print("\n" + wa_data["coaching_institute"]["template_hinglish"] + "\n")
    elif choice == "4":
        p = em_data["startup_mvp_founder"]
        print(f"\nSubject: {p['subject']}\n\n{p['body']}\n")
    elif choice == "5":
        p = em_data["website_redesign_performance"]
        print(f"\nSubject: {p['subject']}\n\n{p['body']}\n")
    else:
        print("Invalid choice.")

def launch_web_ui():
    print("\n[*] Starting Streamlit Web UI...")
    os.system("streamlit run app.py")

def main():
    banner()
    while True:
        menu()
        choice = input("Enter your choice (0-6): ").strip()
        if choice == "1":
            handle_local_leads()
        elif choice == "2":
            handle_startup_leads()
        elif choice == "3":
            handle_website_audit()
        elif choice == "4":
            handle_email_verify()
        elif choice == "5":
            handle_view_pitches()
        elif choice == "6":
            launch_web_ui()
            break
        elif choice == "0":
            print("\nExiting. Best of luck with leads for Mahi Technocrafts!\n")
            break
        else:
            print("\nInvalid choice. Please select from 0 to 6.\n")

if __name__ == "__main__":
    main()
