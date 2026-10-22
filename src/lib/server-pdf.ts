import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

/**
 * Finds available Chrome or Edge browser executable on the current host.
 */
export function getBrowserExecutablePath(): string | null {
  // 1. Check custom env override
  if (process.env.PUPPETEER_EXECUTABLE_PATH && fs.existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  // 2. Platform-specific common paths
  const candidates: string[] = [];

  if (process.platform === 'win32') {
    const localAppData = process.env.LOCALAPPDATA || '';
    const programFiles = process.env['ProgramFiles'] || 'C:\\Program Files';
    const programFilesX86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)';

    candidates.push(
      path.join(programFiles, 'Google\\Chrome\\Application\\chrome.exe'),
      path.join(programFilesX86, 'Google\\Chrome\\Application\\chrome.exe'),
      path.join(localAppData, 'Google\\Chrome\\Application\\chrome.exe'),
      path.join(programFiles, 'Microsoft\\Edge\\Application\\msedge.exe'),
      path.join(programFilesX86, 'Microsoft\\Edge\\Application\\msedge.exe'),
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
    );
  } else if (process.platform === 'darwin') {
    candidates.push(
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
      '/Applications/Chromium.app/Contents/MacOS/Chromium'
    );
  } else {
    // Linux
    candidates.push(
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable',
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser',
      '/snap/bin/chromium'
    );
  }

  for (const candidate of candidates) {
    if (candidate && fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

/**
 * Inlines relative image URLs (e.g. /logo.png, /_next/image) into Base64 Data URIs
 * so Puppeteer renders them with 100% guarantee without needing a web server.
 */
function inlineLocalImages(html: string): string {
  const publicDir = path.join(process.cwd(), 'public');

  return html.replace(/<img([^>]+)src=["']([^"']+)["']([^>]*)>/gi, (match, before, srcPath, after) => {
    // If already data: URI, skip
    if (srcPath.startsWith('data:')) return match;

    let cleanPath = srcPath;
    if (cleanPath.startsWith('/_next/image')) {
      try {
        const u = new URL('http://dummy' + cleanPath);
        cleanPath = u.searchParams.get('url') || cleanPath;
      } catch {}
    }

    if (cleanPath.startsWith('/')) {
      cleanPath = cleanPath.slice(1);
    }
    cleanPath = cleanPath.split('?')[0];

    // Priority candidate files
    const localCandidates = [
      path.join(publicDir, cleanPath),
      path.join(process.cwd(), cleanPath),
      path.join(publicDir, 'logo.png'),
      path.join(publicDir, 'logo.jpeg'),
      path.join(process.cwd(), 'newlogo.jpeg')
    ];

    let foundPath = '';
    for (const c of localCandidates) {
      if (fs.existsSync(c) && fs.statSync(c).isFile()) {
        foundPath = c;
        break;
      }
    }

    if (foundPath) {
      const ext = path.extname(foundPath).toLowerCase();
      let mime = 'image/png';
      if (ext === '.jpg' || ext === '.jpeg') mime = 'image/jpeg';
      else if (ext === '.svg') mime = 'image/svg+xml';
      else if (ext === '.webp') mime = 'image/webp';
      else if (ext === '.ico') mime = 'image/x-icon';

      const base64Data = fs.readFileSync(foundPath).toString('base64');
      const dataUri = `data:${mime};base64,${base64Data}`;
      // Remove srcset if present so browser uses the base64 src
      const cleanBefore = before.replace(/\s+srcset=["'][^"']*["']/gi, '');
      const cleanAfter = after.replace(/\s+srcset=["'][^"']*["']/gi, '');
      return `<img${cleanBefore}src="${dataUri}"${cleanAfter}>`;
    }

    return match;
  });
}

/**
 * Converts HTML string to a PDF buffer using Puppeteer Core and system Chromium.
 */
export async function renderHtmlToPdf(htmlBody: string, title: string = 'Proposal'): Promise<Buffer> {
  const executablePath = getBrowserExecutablePath();
  if (!executablePath) {
    throw new Error('No Chromium/Chrome/Edge browser executable found on system. Please install Chrome or Edge.');
  }

  // Pre-process images into inline Base64
  const inlinedBody = inlineLocalImages(htmlBody);

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--font-render-hinting=none',
      '--hide-scrollbars'
    ]
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });
    await page.emulateMediaType('screen');

    // Wrap with full HTML shell including Tailwind & typography styles
    const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            display: ['Outfit', 'system-ui', 'sans-serif'],
            sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
          }
        }
      }
    }
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap');

    @page {
      size: A4 portrait;
      margin: 8mm 10mm 10mm 10mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      margin: 0;
      padding: 0;
      background-color: #ffffff !important;
      color: #0f172a !important;
      font-family: 'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif !important;
    }
    .font-display {
      font-family: 'Outfit', system-ui, -apple-system, sans-serif !important;
      letter-spacing: -0.02em !important;
    }
    .font-sans {
      font-family: 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif !important;
    }
    .font-mono {
      font-family: 'JetBrains Mono', monospace !important;
    }
    .no-print {
      display: none !important;
    }
    #proposal-document {
      width: 100% !important;
      max-width: 100% !important;
      margin: 0 auto !important;
      box-shadow: none !important;
      border: 1px solid #e2e8f0 !important;
      border-radius: 16px !important;
      overflow: hidden !important;
      background-color: #ffffff !important;
    }
    table {
      page-break-inside: auto;
    }
    tr {
      page-break-inside: avoid;
      page-break-after: auto;
    }
    thead {
      display: table-header-group;
    }
  </style>
</head>
<body class="bg-white text-slate-800">
  ${inlinedBody}
</body>
</html>
    `;

    await page.setContent(fullHtml, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    // Wait until web fonts are completely loaded and painted
    await page.evaluateHandle('document.fonts.ready');
    await new Promise((r) => setTimeout(r, 400));

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: '8mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm'
      }
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close().catch(() => {});
  }
}
