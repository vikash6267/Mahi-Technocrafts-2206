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

