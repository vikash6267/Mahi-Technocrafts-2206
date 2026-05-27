import { ImageResponse } from 'next/og';
import fs from 'fs';
import path from 'path';

export const alt = 'Mahi Technocrafts | Premium Web & AI Solutions';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  // Read the local logo.png file and convert it to a Base64 Data URI
  const logoPath = path.join(process.cwd(), 'public', 'logo.png');
  const logoBuffer = fs.readFileSync(logoPath);
  const logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          background: '#fafaff',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Subtle grid backdrop */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(to right, rgba(128, 128, 128, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(128, 128, 128, 0.04) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            opacity: 0.8,
          }}
        />

        {/* Decorative blur glows */}
        <div
          style={{
            position: 'absolute',
            top: '15%',
            left: '15%',
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            background: '#0ea5e9',
            filter: 'blur(80px)',
            opacity: 0.1,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '15%',
            right: '15%',
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            background: '#f97316',
            filter: 'blur(80px)',
            opacity: 0.1,
          }}
        />

        {/* Logo Card */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid rgba(14, 165, 233, 0.15)',
            borderRadius: '32px',
            padding: '40px 70px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.06)',
            zIndex: 10,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoBase64}
            alt="Mahi Technocrafts Logo"
            style={{
              height: '130px',
              objectFit: 'contain',
            }}
          />
        </div>

        {/* Slogan */}
        <div
          style={{
            marginTop: '35px',
            fontSize: '18px',
            fontWeight: 'bold',
            letterSpacing: '6px',
            color: '#64748b',
            textTransform: 'uppercase',
            zIndex: 10,
          }}
        >
          Your Imagination, Our Creation
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
