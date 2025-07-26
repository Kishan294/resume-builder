"use client";

// Ultra-simple mobile print that relies only on native browser capabilities
export const nativeMobilePrint = (elementId: string): boolean => {
  try {
    console.log("Using native mobile print for element:", elementId);

    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    // Get the resume content
    const resumeContent = element.innerHTML;

    // Create a minimal print-friendly page
    const printHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Resume</title>
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
            
            body {
              font-family: Arial, sans-serif;
              line-height: 1.4;
              color: #000;
              background: #fff;
              font-size: 12px;
              padding: 20px;
            }
            
            .mobile-print-header {
              text-align: center;
              margin-bottom: 20px;
              padding: 15px;
              background: #f8f9fa;
              border-radius: 8px;
              border: 1px solid #dee2e6;
            }
            
            .print-button {
              background: #007bff;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 5px;
              font-size: 16px;
              cursor: pointer;
              margin: 5px;
              text-decoration: none;
              display: inline-block;
            }
            
            .print-button:hover {
              background: #0056b3;
            }
            
            .print-button.secondary {
              background: #6c757d;
            }
            
            .print-button.secondary:hover {
              background: #545b62;
            }
            
            .resume-wrapper {
              background: white;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 8px;
              margin-top: 20px;
            }
            
            /* Basic resume styling */
            h1 { font-size: 20px; font-weight: bold; margin-bottom: 8px; color: #000; }
            h2 { font-size: 16px; font-weight: 600; margin-bottom: 6px; color: #007bff; }
            h3 { font-size: 14px; font-weight: 600; margin-bottom: 4px; color: #000; }
            p { margin-bottom: 4px; color: #333; }
            
            .text-orange-500, .text-orange-600 { color: #007bff; }
            .text-gray-900 { color: #000; }
            .text-gray-700 { color: #333; }
            .text-gray-600 { color: #666; }
            
            .mb-1 { margin-bottom: 4px; }
            .mb-2 { margin-bottom: 8px; }
            .mb-3 { margin-bottom: 12px; }
            .mb-4 { margin-bottom: 16px; }
            .mb-6 { margin-bottom: 24px; }
            
            .font-bold { font-weight: bold; }
            .font-semibold { font-weight: 600; }
            .font-medium { font-weight: 500; }
            
            .text-sm { font-size: 11px; }
            .text-xs { font-size: 10px; }
            
            .flex { display: flex; }
            .items-center { align-items: center; }
            .gap-1 { gap: 4px; }
            .gap-4 { gap: 16px; }
            
            .space-y-2 > * + * { margin-top: 8px; }
            .space-y-3 > * + * { margin-top: 12px; }
            .space-y-4 > * + * { margin-top: 16px; }
            
            @media print {
              .mobile-print-header { display: none; }
              .resume-wrapper { 
                border: none; 
                margin: 0; 
                padding: 0; 
                box-shadow: none;
              }
              body { padding: 0; }
            }
            
            @media (max-width: 768px) {
              body { padding: 10px; }
              .print-button { 
                padding: 10px 20px; 
                font-size: 14px; 
                display: block;
                width: 100%;
                margin: 5px 0;
              }
              .resume-wrapper { padding: 15px; }
            }
          </style>
        </head>
        <body>
          <div class="mobile-print-header">
            <h2 style="margin-bottom: 10px; color: #007bff;">Resume - Ready to Print</h2>
            <p style="margin-bottom: 15px; color: #666; font-size: 14px;">
              Click the button below to print or save as PDF
            </p>
            <button class="print-button" onclick="handlePrint()">
              📄 Print / Save as PDF
            </button>
            <button class="print-button secondary" onclick="goBack()">
              ← Back to Editor
            </button>
          </div>
          
          <div class="resume-wrapper">
            ${resumeContent}
          </div>
          
          <script>
            function handlePrint() {
              try {
                window.print();
              } catch (error) {
                console.error('Print failed:', error);
                alert('Print failed. Please try using your browser\\'s print function (Ctrl+P or Cmd+P).');
              }
            }
            
            function goBack() {
              try {
                if (window.history.length > 1) {
                  window.history.back();
                } else {
                  window.close();
                }
              } catch (error) {
                console.error('Navigation failed:', error);
                window.close();
              }
            }
            
            // Auto-focus and setup
            document.addEventListener('DOMContentLoaded', function() {
              console.log('Native mobile print view loaded');
              
              // Add keyboard shortcuts
              document.addEventListener('keydown', function(e) {
                if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                  e.preventDefault();
                  handlePrint();
                }
              });
            });
            
            // Handle page visibility changes
            document.addEventListener('visibilitychange', function() {
              if (document.visibilityState === 'visible') {
                console.log('Print view is visible');
              }
            });
          </script>
        </body>
      </html>
    `;

    // Try different methods to open the print view

    // Method 1: Data URL (most compatible)
    try {
      const dataUrl =
        "data:text/html;charset=utf-8," + encodeURIComponent(printHTML);
      const printWindow = window.open(
        dataUrl,
        "_blank",
        "width=800,height=600,scrollbars=yes"
      );

      if (printWindow && !printWindow.closed) {
        console.log("Opened print view via data URL");
        return true;
      }
    } catch (error) {
      console.warn("Data URL method failed:", error);
    }

    // Method 2: Blob URL
    try {
      const blob = new Blob([printHTML], { type: "text/html" });
      const blobUrl = URL.createObjectURL(blob);
      const printWindow = window.open(
        blobUrl,
        "_blank",
        "width=800,height=600,scrollbars=yes"
      );

      if (printWindow && !printWindow.closed) {
        console.log("Opened print view via blob URL");
        // Clean up after 10 seconds
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
        return true;
      }

      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.warn("Blob URL method failed:", error);
    }

    // Method 3: Direct window write
    try {
      const printWindow = window.open(
        "",
        "_blank",
        "width=800,height=600,scrollbars=yes"
      );
      if (printWindow && !printWindow.closed) {
        printWindow.document.write(printHTML);
        printWindow.document.close();
        console.log("Opened print view via direct write");
        return true;
      }
    } catch (error) {
      console.warn("Direct write method failed:", error);
    }

    // Method 4: Replace current page (last resort)
    try {
      // Store current state
      sessionStorage.setItem("resumeBuilderReturnUrl", window.location.href);

      // Replace current page
      document.open();
      document.write(printHTML);
      document.close();

      console.log("Replaced current page with print view");
      return true;
    } catch (error) {
      console.error("Page replacement failed:", error);
      return false;
    }
  } catch (error) {
    console.error("Native mobile print failed:", error);
    return false;
  }
};

// Simple function to restore the original page
export const restoreFromPrint = (): boolean => {
  try {
    const returnUrl = sessionStorage.getItem("resumeBuilderReturnUrl");
    if (returnUrl) {
      sessionStorage.removeItem("resumeBuilderReturnUrl");
      window.location.href = returnUrl;
      return true;
    }
    return false;
  } catch (error) {
    console.error("Failed to restore from print:", error);
    return false;
  }
};
