import crypto from 'node:crypto';
import https from 'node:https';

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

/**
 * Retrieves service account credentials securely from environment variables.
 * Never commit private keys to version control.
 */
function getCredentials(): { clientEmail: string; privateKey: string } | null {
  // Option 1: Full JSON string in env
  if (process.env.GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON) {
    try {
      const parsed = JSON.parse(process.env.GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON);
      if (parsed.client_email && parsed.private_key) {
        return {
          clientEmail: parsed.client_email,
          privateKey: parsed.private_key.replace(/\\n/g, '\n')
        };
      }
    } catch (e) {
      console.warn('[Google Indexing] Failed to parse GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON:', e);
    }
  }

  // Option 2: Individual env variables
  const clientEmail = process.env.GOOGLE_INDEXING_CLIENT_EMAIL;
  let privateKey = process.env.GOOGLE_INDEXING_PRIVATE_KEY;

  if (clientEmail && privateKey) {
    return {
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n')
    };
  }

  return null;
}

/**
 * Generates Google OAuth2 JWT Bearer token and fetches access token for Indexing API
 */
async function getGoogleIndexingAccessToken(): Promise<string | null> {
  const creds = getCredentials();
  if (!creds) {
    console.warn('[Google Indexing API] Skipped: GOOGLE_INDEXING_PRIVATE_KEY or GOOGLE_INDEXING_CLIENT_EMAIL not set in env.');
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claim = {
    iss: creds.clientEmail,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedClaim = base64UrlEncode(JSON.stringify(claim));
  const signInput = `${encodedHeader}.${encodedClaim}`;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signInput);
  const signature = signer.sign(creds.privateKey, 'base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const jwt = `${signInput}.${signature}`;
  const postData = `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`;

  return new Promise((resolve, reject) => {
    const req = https.request('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.access_token) {
            resolve(parsed.access_token);
          } else {
            reject(new Error(`OAuth2 failed: ${data}`));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

/**
 * Notifies Google Indexing API that a URL has been added, updated, or removed.
 * Instant crawl signal for Google Bots.
 */
export async function publishToGoogleIndexing(
  url: string,
  type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED'
): Promise<{ success: boolean; status?: number; response?: any; error?: string }> {
  try {
    const accessToken = await getGoogleIndexingAccessToken();
    if (!accessToken) {
      return { success: false, error: 'Indexing API skipped: No credentials in environment' };
    }

    const payload = JSON.stringify({ url, type });

    return new Promise((resolve) => {
      const req = https.request('https://indexing.googleapis.com/v3/urlNotifications:publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
          'Authorization': `Bearer ${accessToken}`
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          let parsedData: any = data;
          try {
            parsedData = JSON.parse(data);
          } catch {}

          if (res.statusCode === 200) {
            console.log(`[Google Indexing API] Successfully pinged Google for URL: ${url} (${type})`);
            resolve({ success: true, status: res.statusCode, response: parsedData });
          } else {
            console.warn(`[Google Indexing API] Warning: status ${res.statusCode} for ${url}:`, parsedData);
            resolve({ success: false, status: res.statusCode, response: parsedData });
          }
        });
      });

      req.on('error', (err) => {
        console.error(`[Google Indexing API] Network Error:`, err);
        resolve({ success: false, error: err.message });
      });

      req.write(payload);
      req.end();
    });
  } catch (error: any) {
    console.error(`[Google Indexing API] Failed to publish URL:`, error);
    return { success: false, error: error.message || 'Unknown error' };
  }
}
