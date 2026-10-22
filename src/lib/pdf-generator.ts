'use client';

/**
 * Professional Proposal PDF Downloader
 * Generates and downloads a real, crisp, multi-page A4 .pdf file using server-side Puppeteer.
 * Eliminates unwanted browser print dialogs.
 */
export async function downloadProposalPdf(
  elementId: string,
  filename: string,
  onProgress?: (status: string) => void
): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    onProgress?.('Preparing document for PDF export...');
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element #${elementId} not found in DOM`);
    }

    onProgress?.('Sending document to Puppeteer PDF engine...');

    // Clean outerHTML (cloned so we can strip any print-only or interactive buttons if needed)
    const cloned = element.cloneNode(true) as HTMLElement;
    // Remove any interactive action buttons from the PDF capture
    cloned.querySelectorAll('.no-print').forEach((el) => el.remove());

    // Ensure all images are converted to inline Base64 data URLs from the live DOM
    const liveImages = Array.from(element.querySelectorAll('img'));
    const clonedImages = Array.from(cloned.querySelectorAll('img'));

    liveImages.forEach((liveImg, index) => {
      const targetCloned = clonedImages[index];
      if (!targetCloned) return;

      try {
        if (liveImg.complete && liveImg.naturalWidth > 0) {
          const canvas = document.createElement('canvas');
          canvas.width = liveImg.naturalWidth;
          canvas.height = liveImg.naturalHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(liveImg, 0, 0);
            const dataUrl = canvas.toDataURL('image/png');
            if (dataUrl && dataUrl.length > 100) {
              targetCloned.src = dataUrl;
              targetCloned.removeAttribute('srcset');
            }
          }
        } else if (liveImg.src) {
          // If relative, make absolute so server/headless browser can resolve
          targetCloned.src = liveImg.src;
        }
      } catch (err) {
        console.warn('Image canvas base64 conversion fallback:', err);
      }
    });

    const htmlContent = cloned.outerHTML;

    // Call server-side Puppeteer API
    const response = await fetch('/api/admin/proposals/pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        html: htmlContent,
        filename,
        title: filename.replace(/\.pdf$/i, '')
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `Server returned error status ${response.status}`);
    }

    onProgress?.('Downloading PDF file...');
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoke URL after a small delay
    setTimeout(() => {
      window.URL.revokeObjectURL(downloadUrl);
    }, 1500);

    return true;
  } catch (error: any) {
    console.error('[PDF Generator Error]:', error);

    // Fallback: If server-side Puppeteer fails, try client-side jsPDF
    try {
      onProgress?.('Using client-side fallback renderer...');
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas')
      ]);

      const element = document.getElementById(elementId);
      if (!element) return false;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pdfWidth = 210;
      const pdfHeight = 297;
      const totalPdfHeight = (canvas.height * pdfWidth) / canvas.width;
      let heightLeft = totalPdfHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, totalPdfHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = -(totalPdfHeight - heightLeft);
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, totalPdfHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }

      pdf.save(filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`);
      return true;
    } catch (clientErr) {
      console.error('[Client-Side Fallback Failed]:', clientErr);
      alert('Unable to generate PDF automatically. Please check your internet connection or use the Print button.');
      return false;
    }
  }
}
