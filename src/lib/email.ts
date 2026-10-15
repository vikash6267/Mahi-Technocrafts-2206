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

/**
 * Sends a notification email when a new blog is autonomously generated in draft mode,
 * providing the user with the exact AI image prompt to generate and upload manually.
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
  
  const textMsg = `A new blog post has been generated by Gemini AI and saved to DRAFTS.\n\nTitle: ${title}\nSlug: ${slug}\nCategory: ${category}\nFocus Keyword: ${focusKeyword}\nStatus: ${status.toUpperCase()}\n\nSuggested Image Prompt:\n${suggestedImagePrompt}\n\nExcerpt:\n${excerpt}\n\nUpload custom image & publish at: https://mahitechnocrafts.in/admin`;
  
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
            <h4 style="margin: 0; color: #6d28d9; font-size: 13px; text-transform: uppercase; font-weight: 800; letter-spacing: 0.5px;">Recommended Image Prompt (Copy & Paste):</h4>
          </div>
          <p style="font-size: 12px; color: #7c3aed; margin: 0 0 10px 0;">Copy this prompt into Midjourney, ChatGPT, Canva, or Flux to create your custom cover image:</p>
          <div style="background-color: #ffffff; border: 1px dashed #c4b5fd; border-radius: 8px; padding: 14px; font-family: 'SFMono-Regular', Consolas, Menlo, monospace; font-size: 12px; color: #4c1d95; line-height: 1.6; word-break: break-word;">
            ${suggestedImagePrompt || `High-end professional photography of ${title}, modern tech office workspace with developers and clean software interface, 4k resolution, cinematic lighting`}
          </div>
        </div>
        
        <!-- Action CTA Button -->
        <div style="text-align: center; margin-top: 32px; margin-bottom: 12px;">
          <a href="https://mahitechnocrafts.in/admin" style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); color: #ffffff; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-size: 14px; font-weight: 700; display: inline-block; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);">Open Admin Panel to Upload Image & Publish &rarr;</a>
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
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
      
      <!-- Top Brand Header -->
      <div style="background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #6366f1 100%); padding: 28px 24px; text-align: center;">
        <span style="display: inline-block; background-color: rgba(255, 255, 255, 0.2); padding: 4px 14px; border-radius: 20px; color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
          ${isClient ? 'Official Courtesy Notice' : 'Admin Control Notification'}
        </span>
        <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">MAHI TECHNOCRAFTS</h1>
        <p style="color: #e0f2fe; margin: 4px 0 0 0; font-size: 12px;">Web Engineering · Cloud Systems · Digital Solutions</p>
      </div>

      <!-- Main Content -->
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

        <!-- Reminder Card Box -->
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

        <!-- Call to Action Buttons -->
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
              ? 'Thank you for your valued partnership. If you have already processed this or have questions, feel free to ignore this notice or reply directly.'
              : 'This is an internal notification dispatched to keep your client accounts and deliverables on track.'
          }
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #f8fafc; padding: 18px 24px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; line-height: 1.5;">
        <strong>Mahi TechnoCrafts</strong> · MP Nagar Zone II, Bhopal, Madhya Pradesh 462011<br/>
        Email: <a href="mailto:mahitechnocrats@gmail.com" style="color: #0ea5e9; text-decoration: none;">mahitechnocrats@gmail.com</a> · Web: <a href="https://mahitechnocrafts.in" style="color: #0ea5e9; text-decoration: none;">mahitechnocrafts.in</a>
      </div>
    </div>
  `;

  return sendEmail({ to: targetEmail, subject, text: textMsg, html });
}

/**
 * Dispatches a 2FA One-Time Password (OTP) email for Admin and Super-Admin logins.
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
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; background-color: #070918; color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #1e293b; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
      <!-- Header banner -->
      <div style="background: linear-gradient(135deg, #0ea5e9, #6366f1, #a855f7); padding: 28px 24px; text-align: center;">
        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 800; color: rgba(255,255,255,0.9);">
          Mahi Technocrafts Security Center
        </span>
        <h1 style="color: #ffffff; font-size: 22px; font-weight: 900; margin: 6px 0 0 0;">
          Two-Step Login Verification
        </h1>
      </div>

      <!-- Main Body -->
      <div style="padding: 32px 28px;">
        <p style="font-size: 14px; color: #cbd5e1; margin-top: 0; line-height: 1.6;">
          Hello <strong style="color: #ffffff;">${name}</strong>,
        </p>
        <p style="font-size: 13px; color: #94a3b8; line-height: 1.6;">
          An authorization request was received to access the <strong>Mahi Tech Control Desk</strong>. Enter the single-use 6-digit verification code below to complete your login:
        </p>

        <!-- Big OTP Card -->
        <div style="margin: 28px 0; padding: 20px; background: rgba(14, 165, 233, 0.08); border: 2px dashed #0284c7; border-radius: 16px; text-align: center;">
          <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: #38bdf8; display: block; margin-bottom: 8px;">
            Your 6-Digit OTP Code
          </span>
          <div style="font-size: 38px; font-weight: 900; letter-spacing: 8px; color: #ffffff; font-family: 'Courier New', Courier, monospace;">
            ${otp}
          </div>
          <span style="font-size: 11px; color: #94a3b8; display: block; margin-top: 8px;">
            Valid for the next 10 minutes only
          </span>
        </div>

        <!-- Meta Details Box -->
        <div style="background: #0f172a; padding: 14px 18px; border-radius: 12px; border: 1px solid #1e293b; font-size: 11px; color: #64748b; line-height: 1.8;">
          <div>• <strong>Recipient:</strong> ${to}</div>
          <div>• <strong>Access Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} (IST)</div>
          ${ip ? `<div>• <strong>Requesting IP:</strong> <code style="color: #38bdf8;">${ip}</code></div>` : ''}
        </div>

        <p style="font-size: 12px; color: #f43f5e; line-height: 1.6; margin-top: 24px; padding: 12px; background: rgba(244, 63, 94, 0.1); border-radius: 10px; border: 1px solid rgba(244, 63, 94, 0.2);">
          ⚠️ <strong>Security Notice:</strong> Never share this code with anyone. Mahi Technocrafts staff will never ask for your authentication OTP. If you did not initiate this login, change your password immediately.
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #030213; padding: 18px 24px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #1e293b;">
        <strong>Mahi TechnoCrafts Engine</strong> · MP Nagar Zone II, Bhopal, MP<br/>
        Superadmin Security & Authentication Services
      </div>
    </div>
  `;

  return sendEmail({ to, subject, text: textMsg, html });
}


