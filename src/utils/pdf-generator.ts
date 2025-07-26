// Simplified PDF generation - now using only browser print functionality

// Legacy functions removed - now using only browser print functionality

// Simple print trigger that ensures content is visible
export const triggerBrowserPrint = () => {
  try {
    // Show instructions to user about disabling headers/footers
    const shouldContinue = window.confirm(
      "Print Instructions:\n\n" +
        "1. In the print dialog, click 'More settings'\n" +
        "2. IMPORTANT: Uncheck 'Headers and footers'\n" +
        "3. Set margins to 'Minimum'\n" +
        "4. Choose 'Save as PDF' to download or select printer to print\n\n" +
        "Click OK to open print dialog"
    );

    if (!shouldContinue) {
      return false;
    }

    // Find the resume preview element
    const resumeElement = document.getElementById("resume-preview");
    if (!resumeElement) {
      throw new Error("Resume preview not found");
    }

    // Get the actual template content from the nested div
    const templateContainer = resumeElement.querySelector("div");
    if (!templateContainer) {
      throw new Error("Template container not found");
    }

    // Create a new window for printing with the resume content
    const printWindow = window.open("", "_blank", "width=800,height=1000");
    if (!printWindow) {
      throw new Error("Failed to open print window. Please allow popups.");
    }

    // Get the resume content from the template container
    const resumeContent = templateContainer.innerHTML;

    // Write the print document
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Resume</title>
          <meta charset="utf-8">
          <style>
            @page {
              size: A4;
              margin: 0.5in;
            }
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            html, body {
              width: 100%;
              height: 100%;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              background: white;
              color: #000;
              line-height: 1.4;
              font-size: 14px;
            }
            
            .resume-container {
              width: 100%;
              max-width: 8.5in;
              margin: 0 auto;
              background: white;
              padding: 0;
            }
            
            /* Typography */
            h1 { font-size: 24px; font-weight: bold; margin-bottom: 8px; color: #111827; }
            h2 { font-size: 18px; font-weight: 600; margin-bottom: 6px; color: #f97316; }
            h3 { font-size: 16px; font-weight: 600; margin-bottom: 4px; color: #111827; }
            p { margin-bottom: 4px; color: #374151; }
            
            /* Colors */
            .text-orange-500, .text-orange-600 { color: #f97316; }
            .text-red-500, .text-red-600 { color: #ef4444; }
            .text-gray-900 { color: #111827; }
            .text-gray-800 { color: #1f2937; }
            .text-gray-700 { color: #374151; }
            .text-gray-600 { color: #4b5563; }
            .text-white { color: #ffffff; }
            
            .bg-white { background-color: #ffffff; }
            .bg-orange-500 { background-color: #f97316; }
            .bg-red-500 { background-color: #ef4444; }
            .bg-gray-50 { background-color: #f9fafb; }
            .bg-gray-100 { background-color: #f3f4f6; }
            .bg-gray-900 { background-color: #111827; }
            
            /* Borders */
            .border-b { border-bottom: 1px solid #e2e8f0; }
            .border-b-2 { border-bottom: 2px solid #f97316; }
            .border-l-2 { border-left: 2px solid #fdba74; }
            .border-l-4 { border-left: 4px solid #f97316; }
            .border-orange-500 { border-color: #f97316; }
            .border-orange-300 { border-color: #fdba74; }
            
            /* Spacing */
            .p-4 { padding: 16px; }
            .p-6 { padding: 24px; }
            .p-8 { padding: 32px; }
            .pb-1 { padding-bottom: 4px; }
            .pb-2 { padding-bottom: 8px; }
            .pb-3 { padding-bottom: 12px; }
            .pb-4 { padding-bottom: 16px; }
            .pb-6 { padding-bottom: 24px; }
            
            .mb-1 { margin-bottom: 4px; }
            .mb-2 { margin-bottom: 8px; }
            .mb-3 { margin-bottom: 12px; }
            .mb-4 { margin-bottom: 16px; }
            .mb-6 { margin-bottom: 24px; }
            
            /* Layout */
            .flex { display: flex; }
            .items-center { align-items: center; }
            .justify-between { justify-content: space-between; }
            .justify-center { justify-content: center; }
            .gap-1 { gap: 4px; }
            .gap-4 { gap: 16px; }
            .space-y-1 > * + * { margin-top: 4px; }
            .space-y-2 > * + * { margin-top: 8px; }
            .space-y-3 > * + * { margin-top: 12px; }
            .space-y-4 > * + * { margin-top: 16px; }
            
            /* Text */
            .font-bold { font-weight: bold; }
            .font-semibold { font-weight: 600; }
            .font-medium { font-weight: 500; }
            .text-sm { font-size: 14px; }
            .text-xs { font-size: 12px; }
            .text-lg { font-size: 18px; }
            .text-xl { font-size: 20px; }
            .text-2xl { font-size: 24px; }
            .leading-relaxed { line-height: 1.6; }
            .uppercase { text-transform: uppercase; }
            .tracking-wide { letter-spacing: 0.025em; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .text-justify { text-align: justify; }
            
            /* Grid */
            .grid { display: grid; }
            .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
            .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
            
            /* Width */
            .w-full { width: 100%; }
            .w-1\\/2 { width: 50%; }
            .w-1\\/3 { width: 33.333333%; }
            .w-2\\/3 { width: 66.666667%; }
            
            /* Gradients */
            .bg-gradient-to-b { background-image: linear-gradient(to bottom, var(--tw-gradient-stops)); }
            .from-orange-500 { --tw-gradient-from: #f97316; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(249, 115, 22, 0)); }
            .to-red-500 { --tw-gradient-to: #ef4444; }
            
            @media print {
              body { margin: 0; padding: 0; }
              .resume-container { margin: 0; padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="resume-container">
            ${resumeContent}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 1000);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
    return true;
  } catch (error) {
    console.error("Error triggering browser print:", error);
    throw error;
  }
};

// Legacy functions - now redirect to browser print
export const generateSimplePDF = () => {
  return triggerBrowserPrint();
};

export const openCleanPrintWindow = () => {
  return triggerBrowserPrint();
};
