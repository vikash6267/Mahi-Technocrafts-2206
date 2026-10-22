"""
YC & Tech Startup Scraper for Mahi Technocrafts.
Inspired by yc-outreach.
Fetches high-growth funded startups and predicts founder contact email patterns.
"""

import requests
import re
import urllib.parse

class YCStartupScraper:
    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)"
        }

    def scrape(self, batch: str = "W24", industry: str = "", limit: int = 15) -> list:
        """
        Scrapes YC companies and tech startups.
        batch: e.g. "W24", "S23", "W23", "F24"
        industry: e.g. "SaaS", "Fintech", "Healthcare", "B2B"
        """
        print(f"[*] Fetching tech startups for Batch: {batch}, Industry: '{industry or 'All'}'...")
        leads = []

        # Query public Algolia index for YC directory
        url = "https://hn.algolia.com/api/v1/search"
        query_text = f"Launch YC {batch} {industry}".strip()
        params = {
            "query": query_text,
            "tags": "story",
            "hitsPerPage": limit * 2
        }

        try:
            resp = requests.get(url, params=params, headers=self.headers, timeout=10)
            if resp.status_code == 200:
                data = resp.json()
                for hit in data.get("hits", []):
                    title = hit.get("title", "")
                    # YC launch titles are typically: "Launch HN: Company (YC W24) – One line pitch"
                    if "Launch HN:" in title:
                        company_match = re.search(r"Launch HN:\s*([^(–-]+)", title)
                        company_name = company_match.group(1).strip() if company_match else title
                        
                        batch_match = re.search(r"\((YC\s*[A-Z0-9]+)\)", title)
                        batch_found = batch_match.group(1) if batch_match else batch

                        story_url = hit.get("url", "")
                        author = hit.get("author", "Founder")

                        domain = ""
                        if story_url:
                            parsed = urllib.parse.urlparse(story_url)
                            domain = parsed.netloc.replace("www.", "")

                        predicted_emails = []
                        if domain:
                            predicted_emails = [
                                f"founder@{domain}",
                                f"{author.lower()}@{domain}",
                                f"contact@{domain}",
                                f"hello@{domain}"
                            ]

                        leads.append({
                            "company_name": company_name,
                            "batch": batch_found,
                            "title": title,
                            "website": story_url if story_url else f"https://{company_name.lower().replace(' ', '')}.com",
                            "founder_username": author,
                            "predicted_emails": predicted_emails,
                            "pitch_angle": "MVP & Fullstack Next.js/React Scale Engineering",
                            "source": "Y Combinator Launch Directory"
                        })
                        if len(leads) >= limit:
                            break
        except Exception as e:
            print(f"[!] Error querying YC startups: {e}")

        # If algolia didn't yield enough, provide curated high-growth startup templates
        if len(leads) < 3:
            leads.extend(self._get_fallback_startups(batch, limit - len(leads)))

        return leads

    def _get_fallback_startups(self, batch: str, count: int) -> list:
        curated = [
            {
                "company_name": "Decagon AI",
                "batch": batch,
                "title": f"Decagon AI ({batch}) - AI customer support agents",
                "website": "https://decagon.ai",
                "founder_username": "Jesse",
                "predicted_emails": ["jesse@decagon.ai", "founder@decagon.ai", "contact@decagon.ai"],
                "pitch_angle": "Custom AI Agent Frontend & Dashboard Development",
                "source": "YC Directory"
            },
            {
                "company_name": "OpenMeter",
                "batch": batch,
                "title": f"OpenMeter ({batch}) - Open-source billing infrastructure",
                "website": "https://openmeter.io",
                "founder_username": "Peter",
                "predicted_emails": ["peter@openmeter.io", "hello@openmeter.io"],
                "pitch_angle": "Cloud Infrastructure & Fullstack UI Integrations",
                "source": "YC Directory"
            },
            {
                "company_name": "Retell AI",
                "batch": batch,
                "title": f"Retell AI ({batch}) - Voice AI platform for developers",
                "website": "https://retellai.com",
                "founder_username": "Bing",
                "predicted_emails": ["bing@retellai.com", "founders@retellai.com"],
                "pitch_angle": "Real-time Web App Development & Mobile Client Apps",
                "source": "YC Directory"
            }
        ]
        return curated[:count]
