import nodemailer from 'nodemailer';

const mailUser = process.env.MAIL_USER || 'mahitechnocrats@gmail.com';
const mailPass = process.env.MAIL_PASS || 'hiwk dwsl soqn hfos';
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
      from: `"Mahi Technocrafts Engine" <${mailUser}>`,
      to,
      subject,
      text,
      html,
    });
    console.log('Email sent successfully: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
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
  const subject = `📬 New Contact Inquiry from ${name} (${company || 'Individual'})`;
  
  const text = `New Contact Form Inquiry:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nCompany: ${company}\nService Required: ${service}\nBudget: ${budget}\n\nMessage:\n${message}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
      <div style="background: linear-gradient(135deg, #0ea5e9 0%, #f97316 100%); padding: 24px; text-align: center;">
        <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: bold; letter-spacing: 0.5px;">NEW CONTACT FORM SUBMISSION</h2>
      </div>
      <div style="padding: 24px; background-color: #fafaff; color: #1e293b;">
        <p style="font-size: 14px; margin-top: 0;">You have received a new project inquiry from the Mahi Technocrafts website.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #475569; width: 130px; border-bottom: 1px solid #f1f5f9;">Name:</td>
            <td style="padding: 8px 0; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #475569; border-bottom: 1px solid #f1f5f9;">Email:</td>
            <td style="padding: 8px 0; color: #0ea5e9; border-bottom: 1px solid #f1f5f9;"><a href="mailto:${email}" style="color: #0ea5e9; text-decoration: none;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #475569; border-bottom: 1px solid #f1f5f9;">Phone:</td>
            <td style="padding: 8px 0; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${phone || 'Not Provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #475569; border-bottom: 1px solid #f1f5f9;">Company:</td>
            <td style="padding: 8px 0; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${company || 'Not Provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #475569; border-bottom: 1px solid #f1f5f9;">Service:</td>
            <td style="padding: 8px 0; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${service}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #475569; border-bottom: 1px solid #f1f5f9;">Estimated Budget:</td>
            <td style="padding: 8px 0; color: #f97316; font-weight: bold; border-bottom: 1px solid #f1f5f9;">${budget}</td>
          </tr>
        </table>
        
        <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-top: 16px;">
          <h4 style="margin: 0 0 8px 0; color: #475569; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Message Detail:</h4>
          <p style="margin: 0; font-size: 13px; color: #334155; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>
      </div>
      <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0;">
        Sent automatically by Mahi Technocrafts Web Engine
      </div>
    </div>
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
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
      <div style="background: linear-gradient(135deg, #0ea5e9 0%, #f97316 100%); padding: 24px; text-align: center;">
        <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: bold; letter-spacing: 0.5px;">NEW REVIEW PENDING APPROVAL</h2>
      </div>
      <div style="padding: 24px; background-color: #fafaff; color: #1e293b;">
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
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #475569; border-bottom: 1px solid #f1f5f9;">Approval Status:</td>
            <td style="padding: 8px 0; color: #d97706; font-weight: bold; border-bottom: 1px solid #f1f5f9;">PENDING (Go to CMS to approve)</td>
          </tr>
        </table>
        
        <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-top: 16px;">
          <h4 style="margin: 0 0 8px 0; color: #475569; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Review Details:</h4>
          <p style="margin: 0; font-size: 13px; color: #334155; line-height: 1.6; font-style: italic;">&ldquo;${text}&rdquo;</p>
        </div>
        
        <div style="text-align: center; margin-top: 24px;">
          <a href="https://mahitechnocrafts.in/admin" style="background-color: #0ea5e9; color: #ffffff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 12px; font-weight: bold; display: inline-block;">Go to CMS Admin Panel</a>
        </div>
      </div>
      <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0;">
        Sent automatically by Mahi Technocrafts Web Engine
      </div>
    </div>
  `;

  return sendEmail({ subject, text: textMsg, html });
}
