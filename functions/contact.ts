interface TurnstileVerifyResult {
  success: boolean;
  'error-codes'?: string[];
}

export const onRequest: PagesFunction<{
  TURNSTILE_SECRET: string;
  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_EMAIL_TOKEN: string;
}> = async (context) => {
  if (context.request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const formData = await context.request.formData();
    const name = (formData.get('name') as string)?.trim() || '';
    const email = (formData.get('email') as string)?.trim() || '';
    const message = (formData.get('message') as string)?.trim() || '';
    const turnstileToken = formData.get('cf-turnstile-response') as string;

    if (!email || !message) {
      return new Response(JSON.stringify({ error: 'Email and message are required.' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    // Verify Turnstile token
    const turnstileResp = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        body: new URLSearchParams({
          secret: context.env.TURNSTILE_SECRET,
          response: turnstileToken,
        }),
      },
    );
    const turnstileResult: TurnstileVerifyResult = await turnstileResp.json();

    if (!turnstileResult.success) {
      return new Response(JSON.stringify({ error: 'Verification failed. Please try again.' }), {
        status: 403,
        headers: { 'content-type': 'application/json' },
      });
    }

    // Send email via Cloudflare Email Sending REST API
    const accountId = context.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = context.env.CLOUDFLARE_EMAIL_TOKEN;

    const emailResp = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/email/sending/send`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'sales@antbar.com',
          from: { address: 'noreply@antbar.com', name: 'ANTBAR Contact Form' },
          reply_to: email,
          subject: `Contact Form Message from ${name || email}`,
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
      return new Response(JSON.stringify({ error: 'Failed to send message. Please try again later.' }), {
        status: 500,
        headers: { 'content-type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    console.error('Contact form error:', err);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred.' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
