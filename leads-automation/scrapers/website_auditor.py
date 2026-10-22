"""
Website Auditor for Mahi Technocrafts.
Tests any lead's website for speed, mobile friendliness, SSL security, and tech stack.
Generates instant personalized audit reports to use in cold outreach!
"""

import time
import requests
from bs4 import BeautifulSoup
import urllib.parse

class WebsiteAuditor:
    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)"
        }

    def audit(self, url: str) -> dict:
        """Audits a website URL and extracts actionable sales pitch points."""
        if not url.startswith("http://") and not url.startswith("https://"):
            url = "https://" + url

        report = {
            "target_url": url,
            "status": "Accessible",
            "load_time_seconds": 0.0,
            "has_ssl": url.startswith("https://"),
            "mobile_viewport": False,
            "meta_description": "",
            "tech_stack": [],
            "pain_points": [],
            "pitch_hook": ""
        }

        start_time = time.time()
        try:
            resp = requests.get(url, headers=self.headers, timeout=12, verify=False)
            elapsed = round(time.time() - start_time, 2)
            report["load_time_seconds"] = elapsed
            report["status_code"] = resp.status_code

            soup = BeautifulSoup(resp.text, "html.parser")

            # Check Mobile Viewport
            viewport = soup.find("meta", attrs={"name": "viewport"})
            report["mobile_viewport"] = bool(viewport)
            if not viewport:
                report["pain_points"].append("Missing Mobile Viewport tag (Looks distorted on smartphones)")

            # Check Meta Description (SEO)
            meta_desc = soup.find("meta", attrs={"name": "description"})
            if meta_desc and meta_desc.get("content"):
                report["meta_description"] = meta_desc.get("content")[:100] + "..."
            else:
                report["pain_points"].append("Missing SEO Meta Description (Hurts Google ranking)")

            # Detect Tech Stack
            html_lower = resp.text.lower()
            if "wp-content" in html_lower or "wordpress" in html_lower:
                report["tech_stack"].append("WordPress (Often slow and prone to plugin security issues)")
                report["pain_points"].append("Legacy WordPress build (Can be upgraded to lightning-fast Next.js)")
            elif "shopify" in html_lower:
                report["tech_stack"].append("Shopify E-commerce")
            elif "wix" in html_lower:
                report["tech_stack"].append("Wix Website Builder")
                report["pain_points"].append("Built with generic builder (Limited SEO & custom feature capabilities)")
            elif "_next" in html_lower or "__next" in html_lower:
                report["tech_stack"].append("Modern Next.js / React")
            else:
                report["tech_stack"].append("Custom HTML / PHP / Standard Stack")

            # Check Speed
            if elapsed > 2.5:
                report["pain_points"].append(f"Slow Load Time ({elapsed}s vs ideal < 1.0s) leading to lost customers")

            # Check SSL
            if not report["has_ssl"]:
                report["pain_points"].append("Insecure HTTP connection (Browser flags as 'Not Secure')")

            # Craft Pitch Hook
            if report["pain_points"]:
                bullet_points = " & ".join(report["pain_points"][:2])
                report["pitch_hook"] = (
                    f"Notice that your current website has a few performance bottlenecks: {bullet_points}. "
                    f"Mahi Technocrafts can rebuild or optimize this into a modern, lightning-fast web app."
                )
            else:
                report["pitch_hook"] = (
                    "Your website is well-maintained! Mahi Technocrafts can help take it further with custom mobile apps, "
                    "advanced CRM integrations, or local SEO campaigns."
                )

        except Exception as e:
            report["status"] = "Error connecting"
            report["pain_points"].append(f"Website is currently inaccessible or timing out ({e})")
            report["pitch_hook"] = "Your website appears down or unreachable — immediate opportunity for reliable hosting & rebuild."

        return report
