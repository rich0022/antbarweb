import { turnstileErrorMessage, verifyTurnstile } from '../utils/turnstile';

interface ContactEnv {
  TURNSTILE_SECRET_KEY?: string;
  CLOUDFLARE_ACCOUNT_ID?: string;
  CLOUDFLARE_EMAIL_TOKEN?: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
  CONTACT_LEADS_TABLE?: string;
  DB: D1Database;
}

export const onRequest: PagesFunction<ContactEnv> = async (context) => {
  if (context.request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const formData = await context.request.formData();
    const name = text(formData.get('name'), 160);
    const email = text(formData.get('email'), 240);
    const message = text(formData.get('message'), 4000);
    const website = text(formData.get('website'), 200);
    const sourcePath = text(formData.get('source_path'), 500) || '/contact/';
    const token = text(formData.get('cf-turnstile-response'), 2048);
    const ip = context.request.headers.get('CF-Connecting-IP');

    // Honeypot anti-bot field: real users should leave it empty.
    if (website) {
      return json({ ok: true });
    }

    if (!email || !message || !isEmail(email)) {
      return json({ error: 'Email and message are required.' }, { status: 400 });
    }

    const hostname = new URL(context.request.url).hostname;
    const turnstile = await verifyTurnstile(context.env, token, ip, hostname);
    if (!turnstile.ok) {
      return json({ error: turnstileErrorMessage(turnstile.errors) }, { status: 400 });
    }

    const referrer = context.request.headers.get('Referer') || '';
    const userAgent = context.request.headers.get('User-Agent') || '';
    const ipHash = ip ? await hashIp(ip) : null;
    const landingPage = parseLandingPage(referrer);
    const leadsTable = assertSqlIdentifier(
      context.env.CONTACT_LEADS_TABLE || 'antbar_contact',
      'CONTACT_LEADS_TABLE',
    );

    try {
      await context.env.DB.prepare(
        `INSERT INTO ${leadsTable} (
          name, email, message, source_path, landing_page, referrer, user_agent, ip_hash
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
        .bind(
          name || null,
          email,
          message,
          sourcePath,
          landingPage,
          referrer || null,
          userAgent || null,
          ipHash,
        )
        .run();
    } catch (dbError) {
      console.error('D1 insert failed (email will still send):', dbError);
    }

    const contactTo = context.env.CONTACT_TO;
    const contactFrom = parseContactFrom(context.env.CONTACT_FROM || '');
    const accountId = context.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = context.env.CLOUDFLARE_EMAIL_TOKEN;

    if (!contactTo || !contactFrom.address || !accountId || !apiToken) {
      console.error('Contact email env is not fully configured');
      return json({ error: 'Failed to send message. Please try again later.' }, { status: 500 });
    }

    const subjectName = name || email;
    const emailResp = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/email/sending/send`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: contactTo,
          from: { address: contactFrom.address, name: contactFrom.name },
          reply_to: email,
          subject: `Contact Form Message from ${subjectName}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <table style="border-collapse:collapse;width:100%;max-width:600px">
              <tr><td style="padding:8px;font-weight:600;width:100px">Name</td><td style="padding:8px">${escapeHtml(name)}</td></tr>
              <tr><td style="padding:8px;font-weight:600">Email</td><td style="padding:8px">${escapeHtml(email)}</td></tr>
              <tr><td style="padding:8px;font-weight:600">Message</td><td style="padding:8px">${escapeHtml(message)}</td></tr>
            </table>
          `,
          text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        }),
      },
    );

    const emailResult = await emailResp.json();

    if (!emailResp.ok) {
      console.error('Email send failed:', emailResult);
      return json({ error: 'Failed to send message. Please try again later.' }, { status: 500 });
    }

    return json({ ok: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
};

function json(body: Record<string, unknown>, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set('content-type', 'application/json');
  return new Response(JSON.stringify(body), { ...init, headers });
}

function text(value: FormDataEntryValue | null, maxLength: number) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function parseLandingPage(referrer: string) {
  if (!referrer) return null;
  try {
    return new URL(referrer).pathname;
  } catch {
    return null;
  }
}

function parseContactFrom(value: string) {
  const match = value.match(/^(.+?)\s*<([^>]+)>$/);
  if (match) {
    return { name: match[1].trim(), address: match[2].trim() };
  }
  return { name: 'Contact Form', address: value.trim() };
}

function assertSqlIdentifier(value: string, fieldName: string): string {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(value)) {
    throw new Error(`Invalid SQL identifier for ${fieldName}: ${value}`);
  }
  return value;
}

async function hashIp(ip: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
