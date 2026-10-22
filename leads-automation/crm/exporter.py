"""
Lead Exporter & CRM Formatter for Mahi Technocrafts.
Exports leads to CSV / Excel with one-click direct WhatsApp links!
"""

import os
import csv
import json
import urllib.parse
import pandas as pd
from datetime import datetime

class LeadExporter:
    def __init__(self, output_dir: str = "data"):
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)

    def export_local_leads(self, leads: list, filename_prefix: str = "local_leads") -> str:
        """Exports local business leads with one-click WhatsApp chat links."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filepath = os.path.join(self.output_dir, f"{filename_prefix}_{timestamp}.csv")

        # Load default WhatsApp template
        template_text = (
            "Namaste {name} ji,\n\n"
            "Mai Vikash, Mahi Technocrafts se. Maine aapka business dekha. "
            "Hum local businesses ke liye modern websites aur digital presence banate hain. "
            "Aapke business ke liye ek ready-made preview link share karu?"
        )

        processed = []
        for l in leads:
            phone = str(l.get("phone", "")).strip()
            # Clean phone for wa.me link
            clean_digits = "".join(filter(str.isdigit, phone))
            if len(clean_digits) == 10:
                clean_digits = "91" + clean_digits  # Default India code

            name = l.get("name", "Business Owner")
            msg = template_text.format(name=name)
            encoded_msg = urllib.parse.quote(msg)

            wa_link = f"https://wa.me/{clean_digits}?text={encoded_msg}" if len(clean_digits) >= 10 else "No Valid Number"

            maps_link = l.get("maps_link")
            if not maps_link:
                query_parts = [name]
                if l.get("city"):
                    query_parts.append(l.get("city"))
                elif l.get("address"):
                    query_parts.append(l.get("address")[:40])
                maps_query = urllib.parse.quote_plus(" ".join(query_parts).strip())
                maps_link = f"https://www.google.com/maps/search/?api=1&query={maps_query}"

            row = {
                "Lead Score (1-100)": l.get("lead_score", 70),
                "Business Name": name,
                "Category": l.get("category", ""),
                "Phone": phone,
                "Website": l.get("website", ""),
                "Google Maps Link": maps_link,
                "One-Click WhatsApp Link": wa_link,
                "Recommended Service": l.get("recommended_service", "Website Development"),
                "Address": l.get("address", ""),
                "City": l.get("city", ""),
                "Source": l.get("source", "Scraper")
            }
            processed.append(row)

        df = pd.DataFrame(processed)
        if not df.empty and "Lead Score (1-100)" in df.columns:
            df.sort_values(by=["Lead Score (1-100)"], ascending=False, inplace=True)
        df.to_csv(filepath, index=False, encoding="utf-8-sig")

        # Also create Excel version if openpyxl is available
        excel_path = filepath.replace(".csv", ".xlsx")
        try:
            df.to_excel(excel_path, index=False)
            print(f"[+] Saved Excel format: {excel_path}")
        except Exception:
            pass

        print(f"[+] Saved {len(leads)} leads to: {filepath}")
        return filepath

    def export_startup_leads(self, leads: list, filename_prefix: str = "startup_leads") -> str:
        """Exports startup founder leads."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filepath = os.path.join(self.output_dir, f"{filename_prefix}_{timestamp}.csv")

        processed = []
        for l in leads:
            emails = ", ".join(l.get("predicted_emails", []))
            row = {
                "Company Name": l.get("company_name", ""),
                "Batch / Stage": l.get("batch", ""),
                "Founder": l.get("founder_username", ""),
                "Website": l.get("website", ""),
                "Predicted Emails": emails,
                "Pitch Angle": l.get("pitch_angle", "Fullstack Next.js"),
                "Source": l.get("source", "YC Directory")
            }
            processed.append(row)

        df = pd.DataFrame(processed)
        df.to_csv(filepath, index=False, encoding="utf-8-sig")
        print(f"[+] Saved {len(leads)} startup leads to: {filepath}")
        return filepath
