import nodemailer from 'nodemailer';

const mailUser = process.env.SMTP_USER || process.env.MAIL_USER || 'vikashvarnsolutions@gmail.com';
const mailPass = process.env.SMTP_PASS || process.env.MAIL_PASS || 'azed htdc gsfc qqts';
const adminEmail = process.env.ADMIN_EMAIL || 'vikasmaheshwari6267@gmail.com';

// Create nodemailer transporter using Google App Password SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: mailUser,
    pass: mailPass,
  },
});

interface EmailPayload {
  to?: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendEmail({ to = adminEmail, subject, text, html }: EmailPayload): Promise<boolean> {
  try {
    const info = await transporter.sendMail({
      from: `"Mahi Technocrafts Security & Admin" <${mailUser}>`,
      to,
      subject,
      text,
      html,
    });
    console.log('Email sent successfully: %s to %s', info.messageId, to);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

/**
 * Dispatches a 2FA One-Time Password (OTP) email for Admin and Super-Admin logins.
 * Premium dark tech cyber security theme with glowing OTP card.
 */
export async function sendAdminLoginOtpEmail({
  to,
  name,
  otp,
  ip
}: {
  to: string;
  name: string;
  otp: string;
  ip?: string;
}): Promise<boolean> {
  const subject = `🔐 [Security Code: ${otp}] Mahi Tech Admin Login Verification`;
  const textMsg = `Hello ${name},\n\nYour 2-Factor Authentication security code for Mahi Technocrafts Admin Login is: ${otp}\n\nThis code is valid for 10 minutes. If you did not attempt this login from IP ${ip || 'Unknown'}, please secure your account immediately.\n\n— Mahi Technocrafts Security Engine`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login Verification</title>
    </head>
    <body style="margin: 0; padding: 24px 12px; background-color: #040212; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px; margin: 0 auto; background-color: #070918; border-radius: 24px; overflow: hidden; border: 1px solid #1e293b; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);">
        <!-- Gradient Brand Header -->
        <tr>
          <td style="background: linear-gradient(135deg, #0284c7 0%, #4f46e5 50%, #9333ea 100%); padding: 36px 28px; text-align: center;">
            <div style="display: inline-block; padding: 6px 16px; background-color: rgba(255, 255, 255, 0.18); border-radius: 9999px; margin-bottom: 12px; border: 1px solid rgba(255, 255, 255, 0.25);">
              <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 800; color: #ffffff;">
                🛡️ Mahi Technocrafts Security Center
              </span>
            </div>
            <h1 style="color: #ffffff; font-size: 24px; font-weight: 900; margin: 0; letter-spacing: -0.5px;">
              Two-Step Login Verification
            </h1>
            <p style="color: #e0e7ff; margin: 6px 0 0 0; font-size: 13px;">
              Identity Authentication & Control Desk Access
            </p>
          </td>
        </tr>

        <!-- Main Body Content -->
        <tr>
          <td style="padding: 36px 32px; color: #cbd5e1;">
            <p style="font-size: 15px; color: #f8fafc; margin: 0 0 12px 0; font-weight: 600;">
              Hello <span style="color: #38bdf8;">${name}</span>,
            </p>
            <p style="font-size: 13px; color: #94a3b8; line-height: 1.6; margin: 0 0 24px 0;">
              An authorization request was received to sign in to the <strong style="color: #ffffff;">Mahi Tech Admin Control Desk</strong>. Use the single-use 6-digit verification code below to complete your authentication:
            </p>

            <!-- High-Contrast OTP Code Card -->
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 24px 0; background: linear-gradient(180deg, rgba(14, 165, 233, 0.12) 0%, rgba(99, 102, 241, 0.08) 100%); border: 2px dashed #0ea5e9; border-radius: 18px; text-align: center;">
              <tr>
                <td style="padding: 26px 20px;">
                  <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: #38bdf8; display: block; margin-bottom: 10px;">
                    Your One-Time Passcode (OTP)
                  </span>
                  <div style="font-size: 44px; font-weight: 900; letter-spacing: 12px; color: #ffffff; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; text-shadow: 0 0 20px rgba(56, 189, 248, 0.5);">
                    ${otp}
                  </div>
                  <span style="font-size: 12px; color: #94a3b8; display: block; margin-top: 10px; font-weight: 500;">
                    ⏱️ Expires in <strong>10 minutes</strong> · Single-Use Only
                  </span>
                </td>
              </tr>
            </table>

            <!-- Session Metadata Box -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0b0f24; border-radius: 14px; border: 1px solid #1e293b; margin-top: 20px; font-size: 12px; color: #64748b;">
              <tr>
                <td style="padding: 14px 18px; line-height: 1.8;">
                  <div>• <strong>Authorized Email:</strong> <span style="color: #e2e8f0;">${to}</span></div>
                  <div>• <strong>Request Time:</strong> <span style="color: #e2e8f0;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} (IST)</span></div>
                  ${ip ? `<div>• <strong>Client IP:</strong> <code style="color: #38bdf8; font-family: monospace;">${ip}</code></div>` : ''}
                </td>
              </tr>
            </table>

            <!-- Security Notice Warning -->
            <div style="margin-top: 24px; padding: 14px 18px; background-color: rgba(244, 63, 94, 0.1); border-left: 4px solid #f43f5e; border-radius: 8px;">
              <p style="margin: 0; font-size: 12px; color: #fda4af; line-height: 1.5;">
                ⚠️ <strong>Security Advisory:</strong> Never share this code with anyone. Mahi Technocrafts staff will never ask for your authentication code. If you did not initiate this login attempt, change your admin password immediately.
              </p>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color: #030213; padding: 22px 28px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #1e293b; line-height: 1.6;">
            <strong style="color: #94a3b8;">Mahi TechnoCrafts Security & Autonomous Systems</strong><br/>
            MP Nagar Zone II, Bhopal, Madhya Pradesh 462011 · Superadmin Protection Desk
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return sendEmail({ to, subject, text: textMsg, html });
}

/**
 * Dispatches an instant Security Alert Email whenever critical security actions occur
 * (e.g. Password Changed, MFA Enabled/Disabled, Suspicious Login).
 */
export async function sendSecurityAlertEmail({
  to,
  name,
  actionTitle,
  details,
  ip,
  location,
  device
}: {
  to: string;
  name: string;
  actionTitle: string;
  details: string;
  ip?: string;
  location?: string;
  device?: string;
}): Promise<boolean> {
  const subject = `🚨 Security Alert: ${actionTitle} - Mahi Technocrafts Account`;
  const textMsg = `Security Alert for ${name}:\n\nAction: ${actionTitle}\nDetails: ${details}\nTime: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} (IST)\nIP Address: ${ip || 'Unknown'}\nLocation: ${location || 'India'}\nDevice: ${device || 'Unknown'}\n\nIf you did not make this change, please log in immediately and secure your account.`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Security Alert</title>
    </head>
    <body style="margin: 0; padding: 24px 12px; background-color: #040212; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px; margin: 0 auto; background-color: #070918; border-radius: 24px; overflow: hidden; border: 1px solid #1e293b; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);">
        <tr>
          <td style="background: linear-gradient(135deg, #e11d48 0%, #b91c1c 100%); padding: 32px 28px; text-align: center;">
            <div style="display: inline-block; padding: 5px 14px; background-color: rgba(255, 255, 255, 0.2); border-radius: 9999px; margin-bottom: 10px;">
              <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 800; color: #ffffff;">
                🛡️ Account Security Notification
              </span>
            </div>
            <h1 style="color: #ffffff; font-size: 22px; font-weight: 900; margin: 0;">
              ${actionTitle}
            </h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 32px 28px; color: #cbd5e1;">
            <p style="font-size: 14px; color: #f8fafc; margin-top: 0;">
              Hello <strong>${name}</strong>,
            </p>
            <p style="font-size: 13px; color: #94a3b8; line-height: 1.6;">
              A critical security modification was recorded on your administrative account:
            </p>

            <div style="background-color: #0b0f24; border-left: 4px solid #f43f5e; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <p style="margin: 0; font-size: 13px; color: #f1f5f9; font-weight: 600;">
                ${details}
              </p>
            </div>

            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0b0f24; border-radius: 12px; border: 1px solid #1e293b; font-size: 12px; color: #94a3b8;">
              <tr>
                <td style="padding: 14px 18px; line-height: 1.8;">
                  <div>• <strong>Timestamp:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} (IST)</div>
                  ${ip ? `<div>• <strong>IP Address:</strong> <code style="color: #38bdf8;">${ip}</code></div>` : ''}
                  ${location ? `<div>• <strong>Location:</strong> ${location}</div>` : ''}
                  ${device ? `<div>• <strong>Device & Browser:</strong> ${device}</div>` : ''}
                </td>
              </tr>
            </table>

            <div style="margin-top: 24px; text-align: center;">
              <a href="https://mahitechnocrafts.in/admin/settings" style="display: inline-block; background: linear-gradient(135deg, #0284c7, #4f46e5); color: #ffffff; padding: 12px 28px; border-radius: 12px; font-size: 13px; font-weight: 700; text-decoration: none;">
                Review Account Security &rarr;
              </a>
            </div>

            <p style="font-size: 12px; color: #f43f5e; margin-top: 24px; line-height: 1.5; text-align: center;">
              If you did not make this change, your credentials may have been compromised. Please reset your password immediately.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #030213; padding: 18px 28px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #1e293b;">
            Mahi TechnoCrafts Security Desk · MP Nagar Zone II, Bhopal
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return sendEmail({ to, subject, text: textMsg, html });
}

/**
 * Sends a notification email for a new contact form submission.
 */
export async function sendContactNotification({
  name,
  email,
  phone,
  company,
  service,
  budget,
  message,
}: {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  budget: string;
  message: string;
}) {
  const subject = `📬 New Project Inquiry: ${name} (${company || 'Individual'}) - ${service}`;
  const text = `New Contact Form Inquiry:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nCompany: ${company}\nService Required: ${service}\nBudget: ${budget}\n\nMessage:\n${message}`;
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><title>New Inquiry</title></head>
    <body style="margin: 0; padding: 24px 12px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);">
        <tr>
          <td style="background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #6366f1 100%); padding: 28px; text-align: center;">
            <span style="background: rgba(255, 255, 255, 0.2); color: #ffffff; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; display: inline-block; margin-bottom: 8px;">
              New High-Value Lead
            </span>
            <h2 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 900; letter-spacing: -0.5px;">
              Client Project Inquiry
            </h2>
          </td>
        </tr>
        <tr>
          <td style="padding: 28px; color: #1e293b;">
            <p style="font-size: 14px; margin-top: 0; color: #475569;">
              You have received a new consultation request on the Mahi Technocrafts website:
            </p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px;">
              <tr>
                <td style="padding: 10px 0; font-weight: 700; color: #64748b; width: 130px; border-bottom: 1px solid #f1f5f9;">Client Name:</td>
                <td style="padding: 10px 0; color: #0f172a; font-weight: 700; border-bottom: 1px solid #f1f5f9;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: 700; color: #64748b; border-bottom: 1px solid #f1f5f9;">Email:</td>
                <td style="padding: 10px 0; color: #0ea5e9; border-bottom: 1px solid #f1f5f9;"><a href="mailto:${email}" style="color: #0ea5e9; text-decoration: none; font-weight: 600;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: 700; color: #64748b; border-bottom: 1px solid #f1f5f9;">Phone / WhatsApp:</td>
                <td style="padding: 10px 0; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${phone || 'Not Provided'}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: 700; color: #64748b; border-bottom: 1px solid #f1f5f9;">Company:</td>
                <td style="padding: 10px 0; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${company || 'Not Provided'}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: 700; color: #64748b; border-bottom: 1px solid #f1f5f9;">Target Service:</td>
                <td style="padding: 10px 0; color: #6366f1; font-weight: 700; border-bottom: 1px solid #f1f5f9;">${service}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: 700; color: #64748b; border-bottom: 1px solid #f1f5f9;">Estimated Budget:</td>
                <td style="padding: 10px 0; color: #10b981; font-weight: 800; font-size: 14px; border-bottom: 1px solid #f1f5f9;">${budget}</td>
              </tr>
            </table>
            
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-top: 18px;">
              <h4 style="margin: 0 0 8px 0; color: #475569; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Requirement Description:</h4>
              <p style="margin: 0; font-size: 13px; color: #334155; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>

            <div style="text-align: center; margin-top: 26px;">
              <a href="mailto:${email}?subject=${encodeURIComponent(`Re: Project Inquiry with Mahi Technocrafts (${service})`)}" style="display: inline-block; background: #0ea5e9; color: #ffffff; padding: 12px 26px; border-radius: 10px; text-decoration: none; font-size: 13px; font-weight: 700;">
                Quick Reply via Email &rarr;
              </a>
              ${phone ? `
                <a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}" style="display: inline-block; background: #25D366; color: #ffffff; padding: 12px 26px; border-radius: 10px; text-decoration: none; font-size: 13px; font-weight: 700; margin-left: 8px;">
                  WhatsApp Chat
                </a>
              ` : ''}
            </div>
          </td>
        </tr>
        <tr>
          <td style="background-color: #f8fafc; padding: 18px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
            Sent automatically by Mahi Technocrafts Web Engine
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return sendEmail({ subject, text, html });
}

/**
 * Sends a notification email for a newly submitted customer review.
 */
export async function sendReviewNotification({
  name,
  role,
  company,
  rating,
  text,
}: {
  name: string;
  role: string;
  company: string;
  rating: number;
  text: string;
}) {
  const subject = `⭐ New Review Submitted by ${name} (${rating}/5 Stars)`;
  const textMsg = `New Client Review Submitted:\n\nName: ${name}\nRole: ${role} at ${company}\nRating: ${rating} of 5 Stars\nStatus: PENDING (Requires Approval)\n\nReview Text:\n${text}`;
  const starsHtml = Array.from({ length: rating }).map(() => '★').join('') + Array.from({ length: 5 - rating }).map(() => '☆').join('');
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); padding: 24px; text-align: center;">
        <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: bold; letter-spacing: 0.5px;">NEW REVIEW PENDING APPROVAL</h2>
      </div>
      <div style="padding: 24px; color: #1e293b;">
        <p style="font-size: 14px; margin-top: 0;">A new client testimonial has been submitted on the website and is currently <strong>PENDING</strong> approval.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #475569; width: 130px; border-bottom: 1px solid #f1f5f9;">Client Name:</td>
            <td style="padding: 8px 0; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #475569; border-bottom: 1px solid #f1f5f9;">Position:</td>
            <td style="padding: 8px 0; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${role} at ${company}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #475569; border-bottom: 1px solid #f1f5f9;">Rating:</td>
            <td style="padding: 8px 0; color: #eab308; font-size: 16px; font-weight: bold; border-bottom: 1px solid #f1f5f9;">${starsHtml} (${rating}/5)</td>
          </tr>
        </table>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-top: 16px;">
          <h4 style="margin: 0 0 8px 0; color: #475569; font-size: 11px; text-transform: uppercase;">Review Details:</h4>
          <p style="margin: 0; font-size: 13px; color: #334155; line-height: 1.6; font-style: italic;">&ldquo;${text}&rdquo;</p>
        </div>
        
        <div style="text-align: center; margin-top: 24px;">
          <a href="https://mahitechnocrafts.in/admin/reviews" style="background-color: #0f172a; color: #ffffff; padding: 11px 24px; border-radius: 10px; text-decoration: none; font-size: 12px; font-weight: bold; display: inline-block;">Approve in Admin Panel &rarr;</a>
        </div>
      </div>
      <div style="background-color: #f8fafc; padding: 16px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
        Sent automatically by Mahi Technocrafts Web Engine
      </div>
    </div>
  `;

  return sendEmail({ subject, text: textMsg, html });
}

/**
 * Sends a notification email when a new blog is autonomously generated in draft mode.
 */
export async function sendNewBlogNotification({
  title,
  slug,
  category = 'Web Development',
  excerpt = '',
  focusKeyword = '',
  suggestedImagePrompt = '',
  status = 'draft'
}: {
  title: string;
  slug: string;
  category?: string;
  excerpt?: string;
  focusKeyword?: string;
  suggestedImagePrompt?: string;
  status?: string;
}) {
  const subject = `📝 New Blog Created in Drafts: "${title.slice(0, 50)}..."`;
  const textMsg = `A new blog post has been generated by Gemini AI and saved to DRAFTS.\n\nTitle: ${title}\nSlug: ${slug}\nCategory: ${category}\nFocus Keyword: ${focusKeyword}\nStatus: ${status.toUpperCase()}\n\nSuggested Image Prompt:\n${suggestedImagePrompt}\n\nExcerpt:\n${excerpt}\n\nUpload custom image & publish at: https://mahitechnocrafts.in/admin/blogs`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 640px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06); background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%); padding: 28px; text-align: center;">
        <span style="background: rgba(255, 255, 255, 0.2); color: #ffffff; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; display: inline-block; margin-bottom: 8px;">AI Content Ready</span>
        <h2 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">New Blog Saved to Drafts</h2>
      </div>
      
      <div style="padding: 28px; color: #1e293b;">
        <p style="font-size: 14px; margin-top: 0; color: #475569; line-height: 1.5;">
          A brand new SEO-optimized article was written by Gemini AI and placed in <strong>DRAFT MODE</strong> with a fallback image. You can now generate your custom image and publish it.
        </p>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0;">
          <h3 style="margin: 0 0 12px 0; color: #0f172a; font-size: 16px; font-weight: bold; line-height: 1.4;">${title}</h3>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="padding: 6px 0; font-weight: 600; color: #64748b; width: 130px;">Category:</td>
              <td style="padding: 6px 0; color: #6366f1; font-weight: 600;">${category}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: 600; color: #64748b;">Target Keyword:</td>
              <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${focusKeyword || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: 600; color: #64748b;">Current Status:</td>
              <td style="padding: 6px 0;"><span style="background-color: #fef3c7; color: #b45309; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase;">${status.toUpperCase()}</span></td>
            </tr>
          </table>
          
          <div style="margin-top: 14px; padding-top: 14px; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.6;"><strong>Summary:</strong> ${excerpt}</p>
          </div>
        </div>
        
        <!-- Suggested Image Prompt Box -->
        <div style="background: linear-gradient(135deg, #f5f3ff 0%, #faf5ff 100%); border: 1px solid #ddd6fe; border-radius: 12px; padding: 20px; margin: 24px 0;">
          <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <span style="font-size: 16px; margin-right: 8px;">🎨</span>
            <h4 style="margin: 0; color: #6d28d9; font-size: 13px; text-transform: uppercase; font-weight: 800; letter-spacing: 0.5px;">Recommended Image Prompt:</h4>
          </div>
          <div style="background-color: #ffffff; border: 1px dashed #c4b5fd; border-radius: 8px; padding: 14px; font-family: 'SFMono-Regular', Consolas, Menlo, monospace; font-size: 12px; color: #4c1d95; line-height: 1.6; word-break: break-word;">
            ${suggestedImagePrompt || `High-end professional photography of ${title}, modern tech office workspace with developers and clean software interface, 4k resolution, cinematic lighting`}
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 28px; margin-bottom: 12px;">
          <a href="https://mahitechnocrafts.in/admin/blogs" style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); color: #ffffff; padding: 12px 28px; border-radius: 10px; text-decoration: none; font-size: 13px; font-weight: 700; display: inline-block;">Open Blogs in Admin Panel &rarr;</a>
        </div>
      </div>
      
      <div style="background-color: #f8fafc; padding: 18px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
        Sent automatically to Vikash Maheshwari by Mahi Technocrafts Autonomous AI System
      </div>
    </div>
  `;

  return sendEmail({ subject, text: textMsg, html });
}

/**
 * Sends automated / manual reminder emails to clients and/or admin
 */
export async function sendClientReminderEmail({
  reminder,
  recipientType = 'client',
  customNote
}: {
  reminder: {
    id: string;
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
    company?: string;
    title: string;
    description: string;
    category: string;
    dueDate: string;
    amount?: string;
    priority: string;
  };
  recipientType?: 'client' | 'admin';
  customNote?: string;
}): Promise<boolean> {
  const categoryNames: Record<string, { label: string; icon: string; color: string }> = {
    domain: { label: 'Domain Renewal / Expiry', icon: '🌐', color: '#0284c7' },
    hosting: { label: 'Cloud Hosting Renewal', icon: '🖥️', color: '#6366f1' },
    payment: { label: 'Payment Due / Invoice', icon: '💰', color: '#059669' },
    amc: { label: 'Annual Maintenance (AMC)', icon: '🛠️', color: '#d97706' },
    ssl: { label: 'SSL Security Certificate', icon: '🔒', color: '#7c3aed' },
    milestone: { label: 'Project Milestone Due', icon: '🎯', color: '#2563eb' },
    general: { label: 'Important Reminder', icon: '📌', color: '#475569' },
  };

  const cat = categoryNames[reminder.category] || categoryNames.general;
  const isClient = recipientType === 'client';
  const targetEmail = isClient ? reminder.clientEmail : adminEmail;

  if (!targetEmail) {
    console.error('sendClientReminderEmail: No recipient email provided.');
    return false;
  }

  const subject = isClient
    ? `${cat.icon} Courtesy Reminder: ${reminder.title} (Due: ${reminder.dueDate})`
    : `⏰ [Admin Reminder Alert] ${reminder.clientName}: ${reminder.title}`;

  const textMsg = isClient
    ? `Dear ${reminder.clientName},\n\nThis is a courtesy reminder regarding your ${cat.label} with Mahi TechnoCrafts.\n\nItem: ${reminder.title}\nDue Date: ${reminder.dueDate}\n${reminder.amount ? `Amount: ${reminder.amount}\n` : ''}Details: ${reminder.description}\n\n${customNote ? `Note from our team: ${customNote}\n\n` : ''}For questions or assistance, contact us on +91 79878 20358 or reply to this email.\n\nBest regards,\nMahi TechnoCrafts Team\nhttps://mahitechnocrafts.in`
    : `Admin Alert - Client Reminder Due\n\nClient: ${reminder.clientName} (${reminder.clientEmail})\nCompany: ${reminder.company || 'N/A'}\nTitle: ${reminder.title}\nCategory: ${cat.label}\nDue Date: ${reminder.dueDate}\nAmount: ${reminder.amount || 'N/A'}\nDetails: ${reminder.description}\n\nManage in Admin Panel: https://mahitechnocrafts.in/admin/reminders`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 620px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);">
      <div style="background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #6366f1 100%); padding: 28px 24px; text-align: center;">
        <span style="display: inline-block; background-color: rgba(255, 255, 255, 0.2); padding: 4px 14px; border-radius: 20px; color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
          ${isClient ? 'Official Courtesy Notice' : 'Admin Control Notification'}
        </span>
        <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">MAHI TECHNOCRAFTS</h1>
        <p style="color: #e0f2fe; margin: 4px 0 0 0; font-size: 12px;">Web Engineering · Cloud Systems · Digital Solutions</p>
      </div>

      <div style="padding: 32px 28px; color: #1e293b;">
        <p style="font-size: 15px; line-height: 1.6; margin-top: 0; color: #334155;">
          ${isClient ? `Dear <strong>${reminder.clientName}</strong>,` : `Admin Notification for Client: <strong>${reminder.clientName}</strong>,`}
        </p>

        <p style="font-size: 14px; line-height: 1.6; color: #475569;">
          ${
            isClient
              ? `This is a friendly reminder from the Mahi TechnoCrafts team regarding your scheduled <strong>${cat.label}</strong>.`
              : `A scheduled reminder for <strong>${reminder.clientName}</strong> (${reminder.company || 'Client'}) has reached its due date.`
          }
        </p>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 5px solid ${cat.color}; border-radius: 12px; padding: 20px; margin: 24px 0;">
          <div style="display: flex; align-items: center; margin-bottom: 12px;">
            <span style="font-size: 20px; margin-right: 8px;">${cat.icon}</span>
            <span style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: ${cat.color};">
              ${cat.label}
            </span>
          </div>

          <h3 style="margin: 0 0 10px 0; font-size: 18px; color: #0f172a; font-weight: 700;">
            ${reminder.title}
          </h3>

          <p style="margin: 0 0 16px 0; font-size: 13px; line-height: 1.6; color: #475569; white-space: pre-wrap;">
            ${reminder.description}
          </p>

          <table style="width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; background-color: #ffffff; border-radius: 8px; border: 1px solid #f1f5f9;">
            <tr>
              <td style="padding: 10px 14px; font-weight: 600; color: #64748b; width: 40%; border-bottom: 1px solid #f1f5f9;">Due / Expiry Date:</td>
              <td style="padding: 10px 14px; font-weight: 700; color: #dc2626; border-bottom: 1px solid #f1f5f9;">
                📅 ${reminder.dueDate}
              </td>
            </tr>
            ${
              reminder.amount
                ? `
            <tr>
              <td style="padding: 10px 14px; font-weight: 600; color: #64748b; width: 40%; border-bottom: 1px solid #f1f5f9;">Amount / Fee:</td>
              <td style="padding: 10px 14px; font-weight: 800; color: #059669; font-size: 15px; border-bottom: 1px solid #f1f5f9;">
                ${reminder.amount}
              </td>
            </tr>`
                : ''
            }
            ${
              reminder.company
                ? `
            <tr>
              <td style="padding: 10px 14px; font-weight: 600; color: #64748b; width: 40%;">Company / Business:</td>
              <td style="padding: 10px 14px; color: #0f172a;">${reminder.company}</td>
            </tr>`
                : ''
            }
          </table>
        </div>

        ${
          customNote
            ? `
        <div style="background-color: #eff6ff; border: 1px dashed #93c5fd; border-radius: 10px; padding: 14px; margin: 18px 0;">
          <strong style="color: #1e40af; font-size: 12px; text-transform: uppercase;">Direct message from our coordinator:</strong>
          <p style="margin: 6px 0 0 0; font-size: 13px; color: #1e3a8a; line-height: 1.5;">${customNote}</p>
        </div>`
            : ''
        }

        ${
          isClient
            ? `
        <div style="text-align: center; margin: 28px 0 10px 0;">
          <a href="https://wa.me/917987820358?text=${encodeURIComponent(`Hi Mahi Technocrafts, I received the reminder for: ${reminder.title}. Please share details.`)}" 
             style="background: #25D366; color: #ffffff; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-size: 13px; font-weight: 700; display: inline-block; margin: 0 6px 10px 6px;">
            💬 Connect on WhatsApp
          </a>
          <a href="tel:+917987820358" 
             style="background: #0ea5e9; color: #ffffff; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-size: 13px; font-weight: 700; display: inline-block; margin: 0 6px 10px 6px;">
            📞 Call Direct (+91 79878 20358)
          </a>
        </div>
        `
            : `
        <div style="text-align: center; margin: 28px 0 10px 0;">
          <a href="https://mahitechnocrafts.in/admin/reminders" 
             style="background: #0f172a; color: #ffffff; padding: 12px 28px; border-radius: 10px; text-decoration: none; font-size: 13px; font-weight: 700; display: inline-block;">
            Open Admin Reminders Panel &rarr;
          </a>
        </div>
        `
        }

        <p style="font-size: 12px; color: #94a3b8; line-height: 1.6; margin-top: 24px; text-align: center;">
          ${
            isClient
              ? 'Thank you for your valued partnership. If you have already processed this, feel free to ignore this notice.'
              : 'This is an internal notification dispatched to keep client accounts and deliverables on track.'
          }
        </p>
      </div>

      <div style="background-color: #f8fafc; padding: 18px 24px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; line-height: 1.5;">
        <strong>Mahi TechnoCrafts</strong> · MP Nagar Zone II, Bhopal, Madhya Pradesh 462011<br/>
        Email: <a href="mailto:mahitechnocrats@gmail.com" style="color: #0ea5e9; text-decoration: none;">mahitechnocrats@gmail.com</a> · Web: <a href="https://mahitechnocrafts.in" style="color: #0ea5e9; text-decoration: none;">mahitechnocrafts.in</a>
      </div>
    </div>
  `;

  return sendEmail({ to: targetEmail, subject, text: textMsg, html });
}
