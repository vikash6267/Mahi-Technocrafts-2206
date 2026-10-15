import { createHmac, randomBytes } from 'node:crypto';

// Base32 RFC 4648 alphabet
const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

/**
 * Encodes a buffer to Base32 string
 */
export function base32Encode(buffer: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = '';

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;

    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }

  return output;
}

/**
 * Decodes a Base32 string to Buffer
 */
export function base32Decode(input: string): Buffer {
  const clean = input.toUpperCase().replace(/=+$/, '').replace(/\s+/g, '');
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (let i = 0; i < clean.length; i++) {
    const val = BASE32_ALPHABET.indexOf(clean[i]);
    if (val === -1) continue;

    value = (value << 5) | val;
    bits += 5;

    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(bytes);
}

/**
 * Generates a random Base32 secret for Google Authenticator (160-bit key)
 */
export function generateTotpSecret(bytes = 20): string {
  return base32Encode(randomBytes(bytes));
}

/**
 * Generates a standard `otpauth://` URI to encode into a QR code
 */
export function generateTotpUri({
  accountName,
  issuer = 'Mahi Technocrafts',
  secret
}: {
  accountName: string;
  issuer?: string;
  secret: string;
}): string {
  const encodedIssuer = encodeURIComponent(issuer);
  const encodedAccount = encodeURIComponent(accountName);
  return `otpauth://totp/${encodedIssuer}:${encodedAccount}?secret=${secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
}

/**
 * Computes a 6-digit TOTP code for a specific counter step
 */
function computeTotpCode(secretBuffer: Buffer, counter: number): string {
  const counterBuffer = Buffer.alloc(8);
  // Write counter as 64-bit big-endian integer
  counterBuffer.writeBigInt64BE(BigInt(counter), 0);

  const hmac = createHmac('sha1', secretBuffer);
  hmac.update(counterBuffer);
  const digest = hmac.digest();

  // Dynamic truncation (RFC 4226)
  const offset = digest[digest.length - 1] & 0x0f;
  const codeInt =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  const code = (codeInt % 1000000).toString().padStart(6, '0');
  return code;
}

/**
 * Verifies a 6-digit TOTP code against a Base32 secret with clock-drift window support
 */
export function verifyTotp({
  token,
  secret,
  window = 1
}: {
  token: string;
  secret: string;
  window?: number;
}): boolean {
  if (!token || !secret) return false;
  const cleanToken = token.trim().replace(/\s+/g, '');
  if (!/^\d{6}$/.test(cleanToken)) return false;

  try {
    const secretBuffer = base32Decode(secret);
    const step = 30; // 30 seconds
    const currentCounter = Math.floor(Date.now() / 1000 / step);

    for (let i = -window; i <= window; i++) {
      const computed = computeTotpCode(secretBuffer, currentCounter + i);
      if (computed === cleanToken) {
        return true;
      }
    }
  } catch {
    return false;
  }

  return false;
}
