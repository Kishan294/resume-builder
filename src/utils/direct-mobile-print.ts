"use client";

// Direct in-page mobile print - no popups, no modals, just direct page manipulation
export const directMobilePrint = (elementId: string): boolean => {
  try {
    console.log("Starting direct mobile print for element:", elementId);

    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    // Get the resume content
    const resumeContent = element.innerHTML;

    // Store current page state
    const originalTitle = document.title;
    const originalBody = document.body.innerHTML;
    const originalBodyClass = document.body.className;
    const originalBodyStyle = document.body.getAttribute("style") || "";

    // Store in sessionStorage for restoration
    sessionStorage.setItem("resumeBuilderOriginalTitle", originalTitle);
    sessionStorage.setItem("resumeBuilderOriginalBody", originalBody);
    sessionStorage.setItem("resumeBuilderOriginalBodyClass", originalBodyClass);
    sessionStorage.setItem("resumeBuilderOriginalBodyStyle", originalBodyStyle);

    // Create print-ready content
    const printContent = `
      <div id="print-container" style="
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.4;
        color: #000;
        background: #fff;
        margin: 0;
        padding: 0;
      ">
        <!-- Print Header (hidden when printing) -->
        <div id="print-header" style="
          background: #f8f9fa;
          border-bottom: 2px solid #007bff;
          padding: 20px;
          text-align: center;
          margin-bottom: 20px;
        ">
          <h1 style="margin: 0 0 10px 0; color: #007bff; font-size: 24px;">
            Resume - Ready to Print
          </h1>
          <p style="margin: 0 0 20px 0; color: #666; font-size: 16px;">
            Your resume is ready. Use the button below or press Ctrl+P (Cmd+P on Mac) to print or save as PDF.
          </p>
          
          <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
            <button onclick="triggerPrint()" style="
              background: #007bff;
              color: white;
              border: none;
              border-radius: 6px;
              padding: 15px 30px;
              font-size: 18px;
              cursor: pointer;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              transition: background 0.2s;
            " onmouseover="this.style.background='#0056b3'" onmouseout="this.style.background='#007bff'">
              📄 Print / Save as PDF
            </button>
            
            <button onclick="goBackToEditor()" style="
              background: #6c757d;
              color: white;
              border: none;
              border-radius: 6px;
              padding: 15px 30px;
              font-size: 18px;
              cursor: pointer;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              transition: background 0.2s;
            " onmouseover="this.style.background='#545b62'" onmouseout="this.style.background='#6c757d'">
              ← Back to Editor
            </button>
          </div>
          
          <div style="margin-top: 15px; padding: 10px; background: #e3f2fd; border-radius: 4px; font-size: 14px; color: #1976d2;">
            <strong>💡 Tip:</strong> In the print dialog, choose "Save as PDF" to download, or select a printer to print directly.
          </div>
        </div>
        
        <!-- Resume Content -->
        <div id="resume-content" style="
          max-width: 8.5in;
          margin: 0 auto;
          padding: 20px;
          background: white;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          border-radius: 8px;
        ">
          ${resumeContent}
        </div>
      </div>
      
      <style>
        /* Print-specific styles */
        @media print {
          #print-header {
            display: none !important;
          }
          
          #print-container {
            margin: 0 !important;
            padding: 0 !important;
          }
          
          #resume-content {
            box-shadow: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
            padding: 0.5in !important;
            max-width: none !important;
          }
          
          body {
            margin: 0 !important;
            padding: 0 !important;
          }
          
          @page {
            size: A4;
            margin: 0.5in;
          }
        }
        
        /* Mobile responsive styles */
        @media (max-width: 768px) {
          #print-header {
            padding: 15px !important;
          }
          
          #print-header h1 {
            font-size: 20px !important;
          }
          
          #print-header p {
            font-size: 14px !important;
          }
          
          #print-header button {
            width: 100% !important;
            margin: 5px 0 !important;
            padding: 12px 20px !important;
            font-size: 16px !important;
          }
          
          #resume-content {
            padding: 15px !important;
            margin: 10px !important;
          }
        }
        
        /* Resume content styling */
        #resume-content h1 { font-size: 24px; font-weight: bold; margin-bottom: 8px; color: #111827; }
        #resume-content h2 { font-size: 18px; font-weight: 600; margin-bottom: 6px; color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 4px; }
        #resume-content h3 { font-size: 16px; font-weight: 600; margin-bottom: 4px; color: #111827; }
        #resume-content p { margin-bottom: 4px; color: #374151; }
        
        #resume-content .text-indigo-600, 
        #resume-content .text-indigo-700 { color: #4f46e5; }
        #resume-content .text-gray-900 { color: #111827; }
        #resume-content .text-gray-700 { color: #374151; }
        #resume-content .text-gray-600 { color: #4b5563; }
        
        #resume-content .mb-1 { margin-bottom: 4px; }
        #resume-content .mb-2 { margin-bottom: 8px; }
        #resume-content .mb-3 { margin-bottom: 12px; }
        #resume-content .mb-4 { margin-bottom: 16px; }
        #resume-content .mb-6 { margin-bottom: 24px; }
        
        #resume-content .font-bold { font-weight: bold; }
        #resume-content .font-semibold { font-weight: 600; }
        #resume-content .font-medium { font-weight: 500; }
        
        #resume-content .text-sm { font-size: 14px; }
        #resume-content .text-xs { font-size: 12px; }
        
        #resume-content .flex { display: flex; }
        #resume-content .items-center { align-items: center; }
        #resume-content .gap-1 { gap: 4px; }
        #resume-content .gap-4 { gap: 16px; }
        
        #resume-content .space-y-2 > * + * { margin-top: 8px; }
        #resume-content .space-y-3 > * + * { margin-top: 12px; }
        #resume-content .space-y-4 > * + * { margin-top: 16px; }
      </style>
      
      <script>
        function triggerPrint() {
          try {
            console.log('Triggering print...');
            window.print();
          } catch (error) {
            console.error('Print failed:', error);
            alert('Print failed. Please try using Ctrl+P (Cmd+P on Mac) to print this page.');
          }
        }
        
        function goBackToEditor() {
          try {
            console.log('Restoring original page...');
            
            // Restore original page content
            const originalTitle = sessionStorage.getItem('resumeBuilderOriginalTitle');
            const originalBody = sessionStorage.getItem('resumeBuilderOriginalBody');
            const originalBodyClass = sessionStorage.getItem('resumeBuilderOriginalBodyClass');
            const originalBodyStyle = sessionStorage.getItem('resumeBuilderOriginalBodyStyle');
            
            if (originalTitle) document.title = originalTitle;
            if (originalBody) document.body.innerHTML = originalBody;
            if (originalBodyClass) document.body.className = originalBodyClass;
            if (originalBodyStyle) document.body.setAttribute('style', originalBodyStyle);
            
            // Clean up session storage
            sessionStorage.removeItem('resumeBuilderOriginalTitle');
            sessionStorage.removeItem('resumeBuilderOriginalBody');
            sessionStorage.removeItem('resumeBuilderOriginalBodyClass');
            sessionStorage.removeItem('resumeBuilderOriginalBodyStyle');
            
            console.log('Page restored successfully');
          } catch (error) {
            console.error('Failed to restore page:', error);
            // Fallback: reload the page
            window.location.reload();
          }
        }
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', function(e) {
          if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            triggerPrint();
          }
          
          if (e.key === 'Escape') {
            goBackToEditor();
          }
        });
        
        // Auto-focus for better UX
        document.addEventListener('DOMContentLoaded', function() {
          console.log('Direct mobile print view loaded');
          
          // Focus on the print button for keyboard users
          const printButton = document.querySelector('button[onclick="triggerPrint()"]');
          if (printButton) {
            printButton.focus();
          }
        });
        
        // Handle page visibility changes
        document.addEventListener('visibilitychange', function() {
          if (document.visibilityState === 'visible') {
            console.log('Print view is visible and ready');
          }
        });
      </script>
    `;

    // Update page title
    document.title = "Resume - Print View";

    // Replace body content
    document.body.innerHTML = printContent;
    document.body.className = "";
    document.body.setAttribute(
      "style",
      "margin: 0; padding: 0; background: #f5f5f5;"
    );

    console.log("Direct mobile print view created successfully");
    return true;
  } catch (error) {
    console.error("Direct mobile print failed:", error);
    return false;
  }
};

// Function to restore the original page
export const restoreOriginalPage = (): boolean => {
  try {
    const originalTitle = sessionStorage.getItem("resumeBuilderOriginalTitle");
    const originalBody = sessionStorage.getItem("resumeBuilderOriginalBody");
    const originalBodyClass = sessionStorage.getItem(
      "resumeBuilderOriginalBodyClass"
    );
    const originalBodyStyle = sessionStorage.getItem(
      "resumeBuilderOriginalBodyStyle"
    );

    if (originalTitle) document.title = originalTitle;
    if (originalBody) document.body.innerHTML = originalBody;
    if (originalBodyClass) document.body.className = originalBodyClass;
    if (originalBodyStyle)
      document.body.setAttribute("style", originalBodyStyle);

    // Clean up session storage
    sessionStorage.removeItem("resumeBuilderOriginalTitle");
    sessionStorage.removeItem("resumeBuilderOriginalBody");
    sessionStorage.removeItem("resumeBuilderOriginalBodyClass");
    sessionStorage.removeItem("resumeBuilderOriginalBodyStyle");

    return true;
  } catch (error) {
    console.error("Failed to restore original page:", error);
    return false;
  }
};
