type TurnstileEnv = {
  TURNSTILE_SECRET_KEY?: string;
};

type SiteverifyResult = {
  success?: boolean;
  'error-codes'?: string[];
};

export function skipsTurnstile(hostname: string) {
  return hostname.endsWith('.workers.dev');
}

export async function verifyTurnstile(
  env: TurnstileEnv,
  token: string,
  ip: string | null,
  hostname: string,
) {
  if (skipsTurnstile(hostname)) {
    return { ok: true, errors: [] as string[] };
  }

  if (!env.TURNSTILE_SECRET_KEY) {
    return { ok: true, errors: [] as string[] };
  }

  if (!token) {
    return { ok: false, errors: ['missing-input-response'] };
  }

  const body = new FormData();
  body.append('secret', env.TURNSTILE_SECRET_KEY);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });

  const result = (await response.json()) as SiteverifyResult;
  const errors = result['error-codes'] ?? [];

  if (!result.success) {
    console.warn('Turnstile siteverify failed', { hostname, errors });
  }

  return { ok: Boolean(result.success), errors };
}

export function turnstileErrorMessage(errors: string[]) {
  if (errors.includes('hostname-mismatch')) {
    return 'Security check failed for this domain. Add the current hostname to your Turnstile widget in Cloudflare.';
  }
  if (errors.includes('invalid-input-secret')) {
    return 'Turnstile secret key is invalid. Check TURNSTILE_SECRET_KEY in Worker secrets.';
  }
  if (errors.includes('invalid-input-response') || errors.includes('timeout-or-duplicate')) {
    return 'Security check expired. Please complete it again and resend your message.';
  }
  if (errors.includes('missing-input-response')) {
    return 'Please complete the security check, then send the message again.';
  }
  return 'Turnstile verification failed. Please refresh the page and try again.';
}
