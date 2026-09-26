import crypto from 'node:crypto';
import https from 'node:https';

interface ServiceAccountKey {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
  universe_domain?: string;
}

// Embedded production service account credentials for Google Indexing API
const DEFAULT_SERVICE_ACCOUNT: ServiceAccountKey = {
  type: "service_account",
  project_id: "mahitechno-indexing",
  private_key_id: "4fd5d5aeb22c4902e08bebfafca9334ee0077ad1",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCuuK2tKc4YQmIW\nVVKXMlCdmNs9B3e+7NzewWidU/nZ8gZlia58GWzgRnGHMnhEmTFUKdHjicmz/Cba\nyaqTA1QR/BmV1HPA97e4FpGOKwE7ypGfh2NUo6GS4nQkBV/WCGBk56W+beF/oD5D\n/lJGPg1o2Ey6ZFaxkGiyox5HppuGFWVKyRiLtXHgduXe/IVuQ8XglKeQ+FzYAH+j\nOgvL86ptpI+PZL8Cg8E5e2QdKIIgKju2yM+fr8TW6+ryQKqpGDvxarZG2usdyUmA\nsG4O5Hpb/eQ7QIejLdy8opyfwq0S/8zjwKQO+dmeaLJu3HVW/0OtrV7xjOgtVwbP\nYNvmg4hfAgMBAAECggEAIKAIgiyruLjwkuYEwYnaJstrqMYztHmLNqcbz0Dmhy1b\nx2sBo1emDmzo9wtUDM8kOGiEsj3A5bRgVvtQOBpngOI3rtQYd0BqVFwWetsJ5G3L\namQABsZ1PbW+ZRmBzzgKM91ThC8Fa+zyo4SiPU6J93loPmfNDmP+QNkXpt5z7QHT\npvb4GuWx+hlgRS0zVNQi6HvZzh11E/KR+bHwgYR/1C9LBxIupORln8S6iU9+8C4l\nAuJK/IptGtAGUQ82bSkL2wr6sIlV5WVEQURNg4JFdyzZ722EVepVQwSYQEI1NwLK\nilN/ORFg7o/A1se9sXM/LergLZSr1vXC0vUNBfWYQQKBgQDf7LnYCw/N1pniJZTj\nH5Jkkn2CK/BYH63N4pmw7UNXoiZhscgWnMbkVGUlwQL9l2YTlf3ye91CS+u6/e60\nmY8fK3CP5eaMSW6ZM4UQSkCYS1g4rIflhoUCFynqwCMv8dHNc6ZF38pl3U6Lr1Rd\nhNF1jOC5+UDE6VdrQOA5kYu3QQKBgQDHv61Oaqo+4zUhIA50cPLtAGwNLmfQed2G\n5MmFG1rJn4dGTWEgnn2vrKD2rdtPza7jZamy8E9yi5AWqULWOWKe27HhGqebwzp4\nRLTSOCk71LTrArmZyu9OfXoMh8igjUeyM40hVCXMQ+AU2dtc5yw2bafgccS9PUqu\nW8lG3K33nwKBgAkYbnwOBvhPbTS4XhHTqHiZUqvE6SBLOR4RxDhhisi2d2SkegIh\nIBsKKomcC2kNi0HkZ8o/qb8Vol+YDOgdDKkxdIMDzZeJLArhAtiki3ckKFM0/tgd\n3K03D6bPYx6BbgowVmKkMm5szNHzrzOVP4TM0hv7udvFtp1Op0zvUoOBAoGAIxDa\nKsb85hda71rCTty5OLP3RAUegnGyWwj0+6IGuRiBVe0lnOVV6S4j/8obkxHnntHt\nDZW0TMaFYAUMz7C5SGwG+R6FyAlozU46dCEZ1AAOVqdez8nZYu0SLPr1VIIY0QbN\nwskT7Z0IzIBGSzPmBhQQAY3XXOVSo/NHDWKWQ78CgYBiRO5Uk8wtR8rbNJY5YYDG\n89b1Ng5sqfKnJSV6vbBgR/P46V0rfbvNo35NZ97m7nmesBRPx71NUkx4emaZaOCC\n7B/TXwoAcMIq4qSNSctSGBeKdcFlNEKoxNMwrHVcLiznp5V637b7CsVS6TOh2I48\ntnJV3IWahI9+cRgtJ4/9Wg==\n-----END PRIVATE KEY-----\n",
  client_email: "indexing-api-sa@mahitechno-indexing.iam.gserviceaccount.com",
  client_id: "102368421895041112714",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/indexing-api-sa%40mahitechno-indexing.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

function getServiceAccount(): ServiceAccountKey {
  if (process.env.GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON) {
    try {
      return JSON.parse(process.env.GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON);
    } catch {
      // Fallback
    }
  }
  return DEFAULT_SERVICE_ACCOUNT;
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

/**
 * Generates Google OAuth2 JWT Bearer token and fetches access token for Indexing API
 */
async function getGoogleIndexingAccessToken(): Promise<string> {
  const sa = getServiceAccount();
  const now = Math.floor(Date.now() / 1000);
  
  const header = { alg: 'RS256', typ: 'JWT' };
  const claim = {
    iss: sa.client_email,
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
  const signature = signer.sign(sa.private_key, 'base64')
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
