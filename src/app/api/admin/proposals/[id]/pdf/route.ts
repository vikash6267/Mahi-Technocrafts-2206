import { NextResponse } from 'next/server';
import { getProposalById } from '@/lib/db';
import { renderHtmlToPdf } from '@/lib/server-pdf';
import puppeteer from 'puppeteer-core';
import { getBrowserExecutablePath } from '@/lib/server-pdf';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const proposal = await getProposalById(id);

    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    const executablePath = getBrowserExecutablePath();
    if (!executablePath) {
      return NextResponse.json({ error: 'Chromium/Chrome not available on server' }, { status: 500 });
    }

    // Determine host to load public proposal view
    const urlObj = new URL(request.url);
    const host = urlObj.host || 'localhost:3111';
    const protocol = urlObj.protocol || 'http:';
    const proposalPageUrl = `${protocol}//${host}/proposal/${id}`;

    const browser = await puppeteer.launch({
      executablePath,
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--hide-scrollbars'
      ]
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });
      
      // Load public proposal page
      await page.goto(proposalPageUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

      // Ensure print media CSS applies
      await page.emulateMediaType('print');

      // Wait a moment for fonts and images
      await new Promise((r) => setTimeout(r, 600));

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        margin: {
          top: '10mm',
          right: '12mm',
          bottom: '12mm',
          left: '12mm'
        }
      });

      const clientName = (proposal.clientName || 'Client').replace(/\s+/g, '_');
      const filename = `${proposal.proposalNumber || 'Proposal'}_${clientName}.pdf`;

      return new NextResponse(new Uint8Array(pdfBuffer), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Content-Length': pdfBuffer.length.toString()
        }
      });
    } finally {
      await browser.close().catch(() => {});
    }
  } catch (error: any) {
    console.error('[API Proposal ID PDF Error]:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate proposal PDF' },
      { status: 500 }
    );
  }
}
