'use client';

/**
 * Direct High-DPI PDF Downloader using jsPDF and html2canvas
 * Converts HTML element into an actual downloadable multi-page A4 .pdf file.
 */
export async function downloadProposalPdf(
  elementId: string,
  filename: string,
  onProgress?: (status: string) => void
): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    onProgress?.('Preparing document for capture...');
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element #${elementId} not found`);
    }

    onProgress?.('Rendering crisp document canvas (High DPI)...');

    // Dynamically import jspdf & html2canvas
    const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
      import('jspdf'),
      import('html2canvas')
    ]);

    // Capture DOM element with high resolution
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth
    });

    onProgress?.('Building multi-page PDF...');

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pdfWidth = 210; // A4 mm
    const pdfHeight = 297; // A4 mm
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const totalPdfHeight = (canvasHeight * pdfWidth) / canvasWidth;
    let heightLeft = totalPdfHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, totalPdfHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    // Subsequent pages if document exceeds single A4 page
    while (heightLeft > 0) {
      position = -(totalPdfHeight - heightLeft);
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, totalPdfHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }

    onProgress?.('Saving file...');
    const finalFilename = filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`;
    pdf.save(finalFilename);

    return true;
  } catch (error) {
    console.error('[PDF Generator Error]:', error);
    // Fallback to window.print if html2canvas/jspdf fails for any device reason
    if (typeof window !== 'undefined') {
      window.print();
    }
    return false;
  }
}
