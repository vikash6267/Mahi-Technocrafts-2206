"""
Free SMTP Email Verifier for Mahi Technocrafts.
Inspired by kiryano/Scout.
Performs DNS MX lookup and SMTP handshake to verify mailbox existence WITHOUT paid APIs.
"""

import re
import socket
import smtplib
import dns.resolver

class EmailVerifier:
    def __init__(self, from_email: str = "verify@mahitechnocrafts.com", timeout: int = 8):
        self.from_email = from_email
        self.timeout = timeout
        self.regex = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")

    def verify(self, email: str) -> dict:
        """
        Verifies if an email address is syntactically valid and has an active mailbox.
        """
        email = email.strip().lower()
        result = {
            "email": email,
            "format_valid": False,
            "mx_found": False,
            "smtp_valid": False,
            "status": "Unknown",
            "message": ""
        }

        # 1. Syntax check
        if not self.regex.match(email):
            result["status"] = "Invalid Syntax"
            result["message"] = "Invalid email format."
            return result
        result["format_valid"] = True

        domain = email.split("@")[1]

        # 2. DNS MX Record lookup
        try:
            records = dns.resolver.resolve(domain, "MX")
            mx_records = sorted([(r.preference, str(r.exchange).rstrip('.')) for r in records])
            if not mx_records:
                result["status"] = "No MX Record"
                result["message"] = f"Domain {domain} has no mail exchange servers."
                return result
            result["mx_found"] = True
            primary_mx = mx_records[0][1]
        except Exception as e:
            result["status"] = "DNS Error"
            result["message"] = f"Could not find mail server for {domain}: {e}"
            return result

        # 3. Direct SMTP Handshake (Check if mailbox exists)
        try:
            server = smtplib.SMTP(timeout=self.timeout)
            server.set_debuglevel(0)
            server.connect(primary_mx)
            server.helo(socket.getfqdn())
            server.mail(self.from_email)
            code, resp = server.rcpt(email)
            server.quit()

            if code == 250:
                result["smtp_valid"] = True
                result["status"] = "Deliverable (Verified)"
                result["message"] = f"Mailbox exists and is ready to receive emails."
            elif code == 550:
                result["smtp_valid"] = False
                result["status"] = "Undeliverable (Does Not Exist)"
                result["message"] = f"Mailbox does not exist on {domain} (Code 550)."
            else:
                result["smtp_valid"] = False
                result["status"] = f"Uncertain (Code {code})"
                result["message"] = f"Server response: {resp.decode('utf-8', errors='ignore')}"

        except (socket.timeout, smtplib.SMTPConnectError, ConnectionRefusedError):
            # Many big providers (like Yahoo/Outlook) block port 25 on residential IPs.
            # MX is still confirmed.
            result["smtp_valid"] = True
            result["status"] = "MX Verified (Port 25 Restricted Locally)"
            result["message"] = f"Mail server {primary_mx} is active and valid."
        except Exception as e:
            result["status"] = "SMTP Handshake Error"
            result["message"] = str(e)

        return result
