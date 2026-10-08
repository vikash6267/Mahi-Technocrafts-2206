import { NextRequest, NextResponse } from 'next/server';
import { getChatSession, saveChatSession, ChatMessage, ChatSession } from '@/lib/db';
import { sendEmail } from '@/lib/email';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

const SYSTEM_INSTRUCTION = `You are Mahi Technocrafts AI BOT, the customer assistant for Mahi TechnoCrafts in Bhopal, India. Answer the latest question directly and briefly. Match the user's language, including Romanized Hindi/Hinglish. Do not repeat a generic pitch. Only answer about Mahi TechnoCrafts, its services, projects, pricing, founder, or starting a project. Politely decline unrelated topics. Use only these facts; if something is unknown, say so and ask one relevant question.

FACTS: Founder/CEO: Vikash Maheshwari. Office: Hamidia Rd, Badabagh, Shahjahanabad, Bhopal, MP 462001. Phone/WhatsApp: +91 6267144122. Email: support@mahitechnocrafts.in. Services: custom websites/e-commerce, Android/iOS apps, AI chatbots/WhatsApp automation, UI/UX, ERP/CRM/inventory/billing software, hosting/DevOps. Website stack: Next.js, React, Tailwind CSS, TypeScript, Node.js. Mobile apps: Flutter or React Native. Do not claim unlisted technologies such as PHP or WordPress. Starting price is ₹2,999*. This exact starting price is authoritative: never substitute another price or a general market estimate. Final quotes depend on project scope. Packages include 6 months of free maintenance/bug fixes and full source-code/database ownership. Typical delivery depends on scope; do not promise a date without requirements.`;

// Call Gemini API with fallback
async function getGeminiReply(messages: ChatMessage[], clientName?: string): Promise<string> {
  const lastUserText = [...messages].reverse().find((msg) => msg.sender === 'user')?.text || '';
  const knownAnswer = getFallbackReply(lastUserText, clientName);
  if (knownAnswer) return knownAnswer;

  if (!GEMINI_API_KEY) {
    return getUnknownReply(lastUserText, clientName);
  }

  // Gemini requires alternating user/model turns. Keep the business instructions
  // in systemInstruction instead of pretending they are a conversation turn.
  const recentHistory = messages
    .filter((msg) => msg.sender === 'user' || msg.sender === 'bot')
    .slice(-10);
  const formattedContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

  for (const msg of recentHistory) {
    const role = msg.sender === 'user' ? 'user' : 'model';
    const previous = formattedContents[formattedContents.length - 1];

    // Merge adjacent turns with the same role. This can happen when old sessions
    // start mid-conversation or contain locally generated welcome messages.
    if (previous?.role === role) {
      previous.parts[0].text += `\n\n${msg.text}`;
    } else {
      formattedContents.push({ role, parts: [{ text: msg.text }] });
    }
  }

  // Gemini conversations must begin with a user turn.
  while (formattedContents[0]?.role === 'model') formattedContents.shift();
  // The newest turn must be the user's question; discard any trailing model turn.
  while (formattedContents.at(-1)?.role === 'model') formattedContents.pop();

  if (!formattedContents.length) {
    return getFallbackReply('', clientName);
  }

  const modelsToTry = [
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent',
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent',
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent',
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent',
  ];

  for (const endpoint of modelsToTry) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: formattedContents,
          systemInstruction: {
            parts: [{ text: `${SYSTEM_INSTRUCTION}\n\nClient Name: ${clientName || 'Valued Visitor'}\nReply in the same language as the user's latest message (Hindi, English, or Hinglish). Answer the specific question first; do not repeat a generic company pitch.` }],
          },
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 500,
            thinkingConfig: { thinkingLevel: 'low' },
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts
          ?.map((part: { text?: string }) => part.text || '')
          .join('');
        if (text && text.trim().length > 0) {
          return text.trim();
        }
        console.warn(`Gemini returned no text for ${endpoint}:`, JSON.stringify(data).slice(0, 1000));
      } else {
        console.error(`Gemini request failed (${response.status}) for ${endpoint}:`, (await response.text()).slice(0, 1000));
      }
    } catch (err) {
      console.error(`Gemini call failed on ${endpoint}:`, err);
    }
  }

  // Fallback if network or quota issue
  return getUnknownReply(lastUserText, clientName);
}

// Fallback logic for Mahi TechnoCrafts
function getFallbackReply(query: string, clientName?: string): string | null {
  const q = query.toLowerCase().trim();
  const isHindi = /[\u0900-\u097f]/.test(query) || /\b(kya|kaise|kese|kais[ae]|kitna|kitne|hai|hain|ho|batao|chahiye|karna|karo|aap|aapka|tumhara|hindi|baat|bat|sakte|sakti|bol|bhasha|namaste|namaskar|shukriya|dhanyavaad)\b/i.test(query);
  const greeting = clientName ? `${isHindi ? `नमस्ते ${clientName}! ` : `Hello ${clientName}! `}` : '';
  const answer = (english: string, hindi: string) => `${greeting}${isHindi ? hindi : english}`;

  if (/\b(kese ho|kaise ho|how are you|hindi me baat|hindi mein baat|bat kar sakte|baat kar sakte|speak hindi|hindi bol)\b/i.test(q)) {
    return answer(
      'I am doing well, thank you! I can chat in Hindi, Hinglish, or English. What would you like to know about Mahi TechnoCrafts?',
      'Haan, bilkul! Main Hindi ya Hinglish mein baat kar sakta hoon. Aap Mahi TechnoCrafts ke kis service ya project ke baare mein jaanna chahenge?'
    );
  }

  if (/\b(technology|technologies|tech stack|framework|programming language|which tech|what tech|tools do you use|stack do you use)\b/i.test(q)) {
    return answer(
      'For websites, we use Next.js, React, TypeScript, Tailwind CSS, and Node.js. For mobile apps, we use Flutter or React Native. The best fit depends on your project.',
      'Websites ke liye hum Next.js, React, TypeScript, Tailwind CSS aur Node.js use karte hain. Mobile apps Flutter ya React Native mein banate hain. Sahi stack aapke project par depend karega.'
    );
  }

  if (/\b(timeline|how long|delivery time|deliver|kitna time|kitne din|kab tak|when can|time lagega)\b/i.test(q)) {
    return answer(
      'Delivery time depends on the features and scope. Share what you need built, and we can suggest a realistic timeline.',
      'Delivery ka time features aur project ke scope par depend karta hai. Aap kya banwana chahte hain batayein, hum realistic timeline bata denge.'
    );
  }

  if (/\b(price|pricing|cost|rate|package|kitna|kitne|keemat|daam|kharcha|charges?)\b/.test(q)) {
    return answer(
      'Projects start at ₹2,999*. The final quote depends on the features and scope. Packages include 6 months of free maintenance and full source-code ownership. Share what you want to build for an exact estimate: WhatsApp +91 6267144122.',
      'Projects ₹2,999* se shuru hote hain. Final price features aur project ke scope par depend karti hai. Package mein 6 mahine ki free maintenance aur poore source code ka ownership shamil hai. Exact estimate ke liye apni requirement WhatsApp +91 6267144122 par bhejein.'
    );
  }

  if (/\b(service|services|offer|work|web|website|site|app|mobile|develop|software|banate|banate|banaoge|banao|banwana)\b/.test(q)) {
    return answer(
      'We build custom websites and e-commerce, Android/iOS apps, AI chatbots and WhatsApp automation, Figma UI/UX, and business software such as ERP/CRM. Which one are you looking for?',
      'Hum custom websites/e-commerce, Android/iOS apps, AI chatbots aur WhatsApp automation, Figma UI/UX, aur ERP/CRM jaise business software banate hain. Aapko inmein se kis solution ki zaroorat hai?'
    );
  }

  if (/\b(contact|call|phone|number|whatsapp|address|office|email|sampark|baat|location|kahan|kahaan|pata)\b/.test(q)) {
    return answer(
      'Phone/WhatsApp: +91 6267144122 · Email: support@mahitechnocrafts.in · Office: Hamidia Rd, Badabagh, Shahjahanabad, Bhopal, MP 462001.',
      'Phone/WhatsApp: +91 6267144122 · Email: support@mahitechnocrafts.in · Office: Hamidia Rd, Badabagh, Shahjahanabad, Bhopal, MP 462001.'
    );
  }

  if (/\b(founder|ceo|vikash|owner|sansthapak|malik)\b/.test(q)) {
    return answer(
      'Mahi TechnoCrafts was founded by Vikash Maheshwari, CEO and Lead Software Architect.',
      'Mahi TechnoCrafts ke founder Vikash Maheshwari hain. Woh CEO aur Lead Software Architect hain.'
    );
  }

  if (/\b(maintenance|support|source code|ownership|malikana|code|warranty)\b/.test(q)) {
    return answer(
      'Development packages include 6 months of free maintenance and bug-fix support. You receive full ownership of the source code and database.',
      'Development packages ke saath 6 mahine ki free maintenance aur bug-fix support milti hai. Source code aur database ka poora ownership aapko diya jata hai.'
    );
  }

  return null;
}

function getUnknownReply(query: string, clientName?: string): string {
  const isHindi = /[\u0900-\u097f]/.test(query) || /\b(kya|kaise|kese|hai|hain|ho|hindi|baat|bat|sakte|sakti|aap)\b/i.test(query);
  const greeting = clientName ? `${isHindi ? `नमस्ते ${clientName}! ` : `Hello ${clientName}! `}` : '';
  return isHindi
    ? `${greeting}Is baare mein mere paas pakki jaankari nahi hai. Aap Mahi TechnoCrafts ke kis project ya service ke baare mein pooch rahe hain?`
    : `${greeting}I don't have confirmed details about that yet. Could you tell me which Mahi TechnoCrafts project or service you mean?`;
}

// GET: Load chat session history by sessionId
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'sessionId is required' }, { status: 400 });
    }

    const session = await getChatSession(sessionId);
    return NextResponse.json({
      success: true,
      session: session || null,
    });
  } catch (error: any) {
    console.error('Error fetching chat session:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}

// POST: Add message, update lead details, and generate AI response
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { sessionId, message, clientName, clientPhone } = body;

    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }

    // Retrieve existing session or initialize
    let existingSession = await getChatSession(sessionId);
    const isNewLead = (!existingSession?.clientPhone && clientPhone) || (!existingSession?.clientName && clientName);

    const name = clientName || existingSession?.clientName || '';
    const phone = clientPhone || existingSession?.clientPhone || '';

    const currentMessages: ChatMessage[] = existingSession?.messages || [];

    // If message is provided, process it
    let botReplyText = '';
    if (message && typeof message === 'string' && message.trim().length > 0) {
      const userMessage: ChatMessage = {
        id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        sender: 'user',
        text: message.trim(),
        timestamp: new Date().toISOString(),
      };

      currentMessages.push(userMessage);

      // Generate Gemini response
      botReplyText = await getGeminiReply(currentMessages, name);

      const botMessage: ChatMessage = {
        id: `bot_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        sender: 'bot',
        text: botReplyText,
        timestamp: new Date().toISOString(),
      };

      currentMessages.push(botMessage);
    }

    // Save session in MongoDB Atlas
    const updatedSession: ChatSession = {
      sessionId,
      clientName: name,
      clientPhone: phone,
      messages: currentMessages,
      createdAt: existingSession?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveChatSession(updatedSession);

    // If newly captured lead details with phone number, dispatch notification email to Vikash
    if (isNewLead && phone) {
      sendEmail({
        subject: `🔥 New Chatbot Lead: ${name || 'Prospective Client'} (${phone})`,
        text: `New Lead captured via Mahi Technocrafts AI BOT!\n\nName: ${name || 'N/A'}\nPhone/WhatsApp: ${phone}\nSession ID: ${sessionId}\nTotal Messages: ${currentMessages.length}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px; background-color: #ffffff;">
            <div style="background-color: #0284c7; padding: 15px; border-radius: 8px; color: #ffffff; text-align: center;">
              <h2 style="margin: 0; font-size: 20px;">🔥 New Chatbot Lead Captured!</h2>
              <p style="margin: 5px 0 0; font-size: 13px; opacity: 0.9;">Mahi Technocrafts AI BOT</p>
            </div>
            <div style="padding: 20px 0; font-size: 15px; color: #334155; line-height: 1.6;">
              <p>A new visitor has submitted their details in the live AI chatbot:</p>
              <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <tr style="background-color: #f8fafc;">
                  <td style="padding: 10px; font-weight: bold; border: 1px solid #e2e8f0; width: 35%;">Name:</td>
                  <td style="padding: 10px; border: 1px solid #e2e8f0;">${name || 'Not provided'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;">Phone / WhatsApp:</td>
                  <td style="padding: 10px; border: 1px solid #e2e8f0;"><a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}" style="color: #0284c7; font-weight: bold;">${phone}</a></td>
                </tr>
                <tr style="background-color: #f8fafc;">
                  <td style="padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;">Session ID:</td>
                  <td style="padding: 10px; border: 1px solid #e2e8f0; font-family: monospace; font-size: 12px;">${sessionId}</td>
                </tr>
              </table>
              <div style="margin-top: 25px; text-align: center;">
                <a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}" style="background-color: #22c55e; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  💬 Open WhatsApp Chat
                </a>
              </div>
            </div>
            <div style="border-top: 1px solid #e2e8f0; padding-top: 15px; text-align: center; font-size: 12px; color: #94a3b8;">
              Mahi TechnoCrafts Autonomous System • Bhopal, MP
            </div>
          </div>
        `
      }).catch(err => console.error('Error sending chatbot lead notification email:', err));
    }

    return NextResponse.json({
      success: true,
      sessionId,
      reply: botReplyText,
      session: updatedSession,
    });
  } catch (error: any) {
    console.error('Error in chat API route:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}
