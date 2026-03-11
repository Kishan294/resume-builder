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
            
            .text-indigo-600, .text-indigo-700 { color: #007bff; }
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

    // For mobile devices, avoid popup windows which are often blocked
    // Instead, use in-page modal or page replacement

    console.log("Attempting mobile-friendly print view...");

    // Method 1: Create an in-page modal overlay (most mobile-friendly)
    try {
      const modalOverlay = document.createElement("div");
      modalOverlay.id = "mobile-print-modal";
      modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        box-sizing: border-box;
      `;

      const modalContent = document.createElement("div");
      modalContent.style.cssText = `
        background: white;
        border-radius: 8px;
        width: 100%;
        max-width: 800px;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      `;

      modalContent.innerHTML = `
        <div style="padding: 20px; border-bottom: 1px solid #ddd; background: #f8f9fa;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h2 style="margin: 0; color: #007bff; font-size: 18px;">Resume - Ready to Print</h2>
            <button onclick="closePrintModal()" style="background: #dc3545; color: white; border: none; border-radius: 4px; padding: 8px 12px; cursor: pointer; font-size: 14px;">✕ Close</button>
          </div>
          <p style="margin: 0 0 15px 0; color: #666; font-size: 14px;">
            Click the button below to print or save as PDF
          </p>
          <button onclick="printFromModal()" style="background: #007bff; color: white; border: none; border-radius: 4px; padding: 12px 24px; cursor: pointer; font-size: 16px; width: 100%; margin-bottom: 10px;">
            📄 Print / Save as PDF
          </button>
        </div>
        <div style="padding: 20px;">
          ${resumeContent}
        </div>
      `;

      modalOverlay.appendChild(modalContent);

      // Add global functions for modal interaction
      (window as unknown as { closePrintModal: () => void }).closePrintModal =
        () => {
          const modal = document.getElementById("mobile-print-modal");
          if (modal) {
            modal.remove();
          }
        };

      (window as unknown as { printFromModal: () => void }).printFromModal =
        () => {
          try {
            // Hide the modal header for printing
            const header = modalContent.querySelector(
              'div[style*="border-bottom"]'
            ) as HTMLElement;
            if (header) header.style.display = "none";

            // Trigger print
            window.print();

            // Show header again after print
            setTimeout(() => {
              if (header) header.style.display = "block";
            }, 1000);
          } catch (error) {
            console.error("Print failed:", error);
            alert(
              "Print failed. Please try using Ctrl+P or Cmd+P to print this page."
            );
          }
        };

      // Add to page
      document.body.appendChild(modalOverlay);

      // Add print styles for the modal
      const printStyle = document.createElement("style");
      printStyle.textContent = `
        @media print {
          #mobile-print-modal {
            position: static !important;
            background: white !important;
            padding: 0 !important;
            z-index: auto !important;
          }
          #mobile-print-modal > div {
            box-shadow: none !important;
            border-radius: 0 !important;
            max-height: none !important;
            overflow: visible !important;
          }
          #mobile-print-modal div[style*="border-bottom"] {
            display: none !important;
          }
        }
      `;
      document.head.appendChild(printStyle);

      console.log("Created in-page print modal");
      return true;
    } catch (error) {
      console.warn("Modal method failed:", error);
    }

    // Method 2: Replace current page content (fallback)
    try {
      // Store current state for restoration
      const currentHTML = document.documentElement.outerHTML;
      const currentUrl = window.location.href;

      sessionStorage.setItem("resumeBuilderOriginalHTML", currentHTML);
      sessionStorage.setItem("resumeBuilderReturnUrl", currentUrl);

      // Replace page content
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
    // First try to restore from HTML backup
    const originalHTML = sessionStorage.getItem("resumeBuilderOriginalHTML");
    if (originalHTML) {
      sessionStorage.removeItem("resumeBuilderOriginalHTML");
      sessionStorage.removeItem("resumeBuilderReturnUrl");

      document.open();
      document.write(originalHTML);
      document.close();
      return true;
    }

    // Fallback to URL navigation
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
