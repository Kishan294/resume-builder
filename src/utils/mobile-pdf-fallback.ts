"use client";

// Simple mobile PDF fallback that opens a print-friendly page
export const mobilePrintFallback = (elementId: string): boolean => {
  try {
    console.log("Using mobile print fallback for element:", elementId);

    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    // Get the resume content
    const resumeContent = element.innerHTML;

    // Create a new page with print-optimized styles
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Resume - Print View</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.4;
              color: #000;
              background: #fff;
              padding: 20px;
            }
            
            .print-header {
              text-align: center;
              margin-bottom: 20px;
              padding-bottom: 15px;
              border-bottom: 2px solid #f97316;
            }
            
            .print-buttons {
              display: flex;
              gap: 10px;
              justify-content: center;
              flex-wrap: wrap;
            }
            
            .print-btn {
              background: #f97316;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 6px;
              font-size: 16px;
              cursor: pointer;
              text-decoration: none;
              display: inline-block;
            }
            
            .print-btn.secondary {
              background: #6b7280;
            }
            
            .print-btn:hover {
              opacity: 0.9;
            }
            
            .resume-content {
              background: white;
              margin-top: 20px;
              padding: 20px;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
            }
            
            /* Resume styles */
            .resume-content h1 { font-size: 24px; font-weight: bold; margin-bottom: 8px; color: #111827; }
            .resume-content h2 { font-size: 18px; font-weight: 600; margin-bottom: 6px; color: #f97316; border-bottom: 2px solid #f97316; padding-bottom: 4px; }
            .resume-content h3 { font-size: 16px; font-weight: 600; margin-bottom: 4px; color: #111827; }
            .resume-content p { margin-bottom: 4px; color: #374151; }
            
            .text-orange-500, .text-orange-600 { color: #f97316; }
            .text-gray-900 { color: #111827; }
            .text-gray-700 { color: #374151; }
            .text-gray-600 { color: #4b5563; }
            .border-b-2 { border-bottom: 2px solid; }
            .border-orange-500 { border-color: #f97316; }
            .pb-6 { padding-bottom: 24px; }
            .mb-6 { margin-bottom: 24px; }
            .mb-3 { margin-bottom: 12px; }
            .mb-2 { margin-bottom: 8px; }
            .mb-1 { margin-bottom: 4px; }
            .flex { display: flex; }
            .items-center { align-items: center; }
            .gap-1 { gap: 4px; }
            .gap-4 { gap: 16px; }
            .space-y-4 > * + * { margin-top: 16px; }
            .space-y-3 > * + * { margin-top: 12px; }
            .space-y-2 > * + * { margin-top: 8px; }
            .font-bold { font-weight: bold; }
            .font-semibold { font-weight: 600; }
            .font-medium { font-weight: 500; }
            .text-sm { font-size: 14px; }
            .text-xs { font-size: 12px; }
            .leading-relaxed { line-height: 1.6; }
            .uppercase { text-transform: uppercase; }
            .tracking-wide { letter-spacing: 0.025em; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .border-l-2 { border-left: 2px solid #fdba74; }
            .border-l-4 { border-left: 4px solid #f97316; }
            
            @media print {
              .print-header { display: none; }
              .resume-content { 
                border: none; 
                margin: 0; 
                padding: 0; 
                box-shadow: none;
              }
              body { padding: 0; }
            }
            
            @media (max-width: 768px) {
              body { padding: 10px; }
              .print-btn { padding: 10px 20px; font-size: 14px; }
              .resume-content { padding: 15px; }
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h1 style="margin-bottom: 10px; color: #f97316;">Resume - Print View</h1>
            <p style="margin-bottom: 15px; color: #6b7280;">Use the buttons below to print or save your resume</p>
            <div class="print-buttons">
              <button class="print-btn" onclick="window.print()">Print Resume</button>
              <button class="print-btn secondary" onclick="history.back()">Back to Editor</button>
              <button class="print-btn secondary" onclick="window.close()">Close</button>
            </div>
          </div>
          
          <div class="resume-content">
            ${resumeContent}
          </div>
          
          <script>
            // Auto-focus for better mobile experience
            document.addEventListener('DOMContentLoaded', function() {
              console.log('Print view loaded successfully');
            });
            
            // Handle back button
            window.addEventListener('beforeunload', function() {
              // Clean up if needed
            });
          </script>
        </body>
      </html>
    `;

    // For mobile, try multiple approaches in order of preference

    // Method 1: Try to open in new window (best UX)
    try {
      const newWindow = window.open(
        "",
        "_blank",
        "width=800,height=1000,scrollbars=yes,resizable=yes"
      );
      if (newWindow && !newWindow.closed) {
        newWindow.document.write(printContent);
        newWindow.document.close();
        console.log("Opened print view in new window");
        return true;
      }
    } catch (error) {
      console.warn("Failed to open new window:", error);
    }

    // Method 2: Try to open in same tab (fallback)
    try {
      // Create a blob URL for the content
      const blob = new Blob([printContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);

      // Try to open the blob URL
      const newWindow = window.open(url, "_blank");
      if (newWindow && !newWindow.closed) {
        console.log("Opened print view via blob URL");
        // Clean up the blob URL after a delay
        setTimeout(() => URL.revokeObjectURL(url), 5000);
        return true;
      }

      // Clean up if window didn't open
      URL.revokeObjectURL(url);
    } catch (error) {
      console.warn("Failed to open blob URL:", error);
    }

    // Method 3: Replace current page content (last resort)
    try {
      // Store current URL for back navigation
      const currentUrl = window.location.href;
      sessionStorage.setItem("originalUrl", currentUrl);

      // Replace page content
      document.open();
      document.write(printContent);
      document.close();

      console.log("Replaced current page with print view");
      return true;
    } catch (error) {
      console.error("Failed to replace page content:", error);

      // Method 4: Final fallback - trigger browser print directly
      try {
        window.print();
        console.log("Triggered browser print as final fallback");
        return true;
      } catch (printError) {
        console.error("All fallback methods failed:", printError);
        return false;
      }
    }
  } catch (error) {
    console.error("Mobile print fallback failed:", error);
    return false;
  }
};

// Restore original content (if replaced)
export const restoreOriginalContent = (): boolean => {
  try {
    const originalContent = sessionStorage.getItem("originalContent");
    if (originalContent) {
      document.open();
      document.write(originalContent);
      document.close();
      sessionStorage.removeItem("originalContent");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Failed to restore original content:", error);
    return false;
  }
};
