import { NextResponse } from 'next/server';
import { renderHtmlToPdf } from '@/lib/server-pdf';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { html, filename = 'Proposal.pdf', title = 'Proposal' } = body;

    if (!html || typeof html !== 'string') {
      return NextResponse.json({ error: 'Missing HTML content to generate PDF' }, { status: 400 });
    }

    const pdfBuffer = await renderHtmlToPdf(html, title);

    const safeFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(safeFilename)}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Length': pdfBuffer.length.toString()
      }
    });
  } catch (error: any) {
    console.error('[API Proposals PDF Error]:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate PDF using Puppeteer' },
      { status: 500 }
    );
  }
}
