import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Debug function to find problematic color functions
const debugColorFunctions = (element: HTMLElement) => {
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_ELEMENT,
    null
  );

  const problematicElements: { element: HTMLElement; styles: string[] }[] = [];
  let node;

  while ((node = walker.nextNode())) {
    const el = node as HTMLElement;
    const computedStyle = window.getComputedStyle(el);
    const problematicStyles: string[] = [];

    // Check all style properties for modern color functions
    for (let i = 0; i < computedStyle.length; i++) {
      const prop = computedStyle[i];
      const value = computedStyle.getPropertyValue(prop);

      if (
        value &&
        (value.includes("oklch") ||
          value.includes("lab") ||
          value.includes("lch"))
      ) {
        problematicStyles.push(`${prop}: ${value}`);
      }
    }

    if (problematicStyles.length > 0) {
      problematicElements.push({ element: el, styles: problematicStyles });
    }
  }

  if (problematicElements.length > 0) {
    console.warn(
      "Found elements with problematic color functions:",
      problematicElements
    );
  }

  return problematicElements;
};

// Helper function to completely replace problematic CSS with compatible colors
const fixColorCompatibility = (clonedDoc: Document) => {
  // Remove all existing stylesheets that might contain oklch/lab colors
  const existingStyles = clonedDoc.querySelectorAll(
    'style, link[rel="stylesheet"]'
  );
  existingStyles.forEach((style) => style.remove());

  // Also remove any inline styles that might contain modern color functions
  const allElements = clonedDoc.querySelectorAll("*");
  allElements.forEach((element) => {
    if (element.getAttribute("style")) {
      let styleAttr = element.getAttribute("style") || "";
      // Remove any oklch, lab, lch color functions
      styleAttr = styleAttr.replace(/oklch\([^)]+\)/g, "#000000");
      styleAttr = styleAttr.replace(/lab\([^)]+\)/g, "#000000");
      styleAttr = styleAttr.replace(/lch\([^)]+\)/g, "#000000");
      element.setAttribute("style", styleAttr);
    }
  });

  // Add a comprehensive replacement stylesheet
  const style = clonedDoc.createElement("style");
  style.textContent = `
    /* Reset and base styles */
    * {
      box-sizing: border-box;
    }
    
    /* CSS Custom Properties - RGB only */
    :root {
      --background: #ffffff;
      --foreground: #0f172a;
      --card: #ffffff;
      --card-foreground: #0f172a;
      --popover: #ffffff;
      --popover-foreground: #0f172a;
      --primary: #3b82f6;
      --primary-foreground: #ffffff;
      --secondary: #f1f5f9;
      --secondary-foreground: #0f172a;
      --muted: #f1f5f9;
      --muted-foreground: #64748b;
      --accent: #f1f5f9;
      --accent-foreground: #0f172a;
      --destructive: #ef4444;
      --border: #e2e8f0;
      --input: #e2e8f0;
      --ring: #94a3b8;
    }
    
    /* Base elements */
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #ffffff;
      color: #0f172a;
      margin: 0;
      padding: 0;
    }
    
    /* Typography */
    h1, h2, h3, h4, h5, h6 { font-weight: 600; margin: 0; }
    h1 { font-size: 1.875rem; line-height: 2.25rem; }
    h2 { font-size: 1.5rem; line-height: 2rem; }
    h3 { font-size: 1.25rem; line-height: 1.75rem; }
    p { margin: 0; }
    
    /* Common utility classes */
    .text-xs { font-size: 0.75rem; line-height: 1rem; }
    .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
    .text-base { font-size: 1rem; line-height: 1.5rem; }
    .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
    .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
    .text-2xl { font-size: 1.5rem; line-height: 2rem; }
    .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
    
    .font-medium { font-weight: 500; }
    .font-semibold { font-weight: 600; }
    .font-bold { font-weight: 700; }
    
    /* Colors */
    .text-primary { color: #3b82f6; }
    .text-secondary { color: #64748b; }
    .text-muted-foreground { color: #64748b; }
    .text-gray-900 { color: #111827; }
    .text-gray-800 { color: #1f2937; }
    .text-gray-700 { color: #374151; }
    .text-gray-600 { color: #4b5563; }
    .text-gray-500 { color: #6b7280; }
    .text-black { color: #000000; }
    .text-white { color: #ffffff; }
    
    .bg-white { background-color: #ffffff; }
    .bg-primary { background-color: #3b82f6; }
    .bg-gray-50 { background-color: #f9fafb; }
    .bg-gray-100 { background-color: #f3f4f6; }
    
    /* Borders */
    .border { border-width: 1px; border-style: solid; border-color: #e2e8f0; }
    .border-b { border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: #e2e8f0; }
    .border-b-2 { border-bottom-width: 2px; border-bottom-style: solid; }
    .border-primary { border-color: #3b82f6; }
    .border-gray-200 { border-color: #e5e7eb; }
    .border-black { border-color: #000000; }
    
    /* Spacing */
    .p-0 { padding: 0; }
    .p-1 { padding: 0.25rem; }
    .p-2 { padding: 0.5rem; }
    .p-3 { padding: 0.75rem; }
    .p-4 { padding: 1rem; }
    .p-6 { padding: 1.5rem; }
    .p-8 { padding: 2rem; }
    
    .pb-1 { padding-bottom: 0.25rem; }
    .pb-2 { padding-bottom: 0.5rem; }
    .pb-3 { padding-bottom: 0.75rem; }
    .pb-4 { padding-bottom: 1rem; }
    .pb-6 { padding-bottom: 1.5rem; }
    
    .m-0 { margin: 0; }
    .mb-1 { margin-bottom: 0.25rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-3 { margin-bottom: 0.75rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mb-6 { margin-bottom: 1.5rem; }
    
    /* Layout */
    .flex { display: flex; }
    .items-center { align-items: center; }
    .justify-between { justify-content: space-between; }
    .space-y-1 > * + * { margin-top: 0.25rem; }
    .space-y-2 > * + * { margin-top: 0.5rem; }
    .space-y-3 > * + * { margin-top: 0.75rem; }
    .space-y-4 > * + * { margin-top: 1rem; }
    .gap-1 { gap: 0.25rem; }
    .gap-2 { gap: 0.5rem; }
    .gap-4 { gap: 1rem; }
    
    /* Width/Height */
    .w-full { width: 100%; }
    .h-full { height: 100%; }
    .h-4 { height: 1rem; }
    .w-4 { width: 1rem; }
    
    /* Text alignment */
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    
    /* Leading */
    .leading-relaxed { line-height: 1.625; }
    
    /* Tracking */
    .tracking-wide { letter-spacing: 0.025em; }
    
    /* Uppercase */
    .uppercase { text-transform: uppercase; }
  `;
  clonedDoc.head.appendChild(style);
};

export const generatePDF = async (
  elementId: string,
  filename: string = "resume.pdf"
) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    // Wait for any images or fonts to load
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Debug: Check for problematic color functions
    console.log("Debugging color functions before PDF generation...");
    debugColorFunctions(element);

    // Temporarily remove aspect ratio constraint for better PDF generation
    const originalStyle = element.style.cssText;
    element.style.height = "auto";
    element.style.aspectRatio = "unset";

    // Create canvas from the element with better options
    const canvas = await html2canvas(element, {
      scale: 1.5, // Reduced scale to avoid memory issues
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
      logging: true, // Enable logging to see what's happening
      ignoreElements: (element) => {
        // Skip elements that might cause issues
        return element.tagName === "SCRIPT" || element.tagName === "NOSCRIPT";
      },
      width: element.scrollWidth,
      height: element.scrollHeight,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc) => {
        try {
          // Fix color compatibility issues
          fixColorCompatibility(clonedDoc);

          // Ensure all styles are applied to the cloned document
          const clonedElement = clonedDoc.getElementById(elementId);
          if (clonedElement) {
            clonedElement.style.height = "auto";
            clonedElement.style.aspectRatio = "unset";
            clonedElement.style.maxHeight = "none";
            clonedElement.style.overflow = "visible";
          }
        } catch (cloneError) {
          console.warn("Error in onclone:", cloneError);
        }
      },
    });

    // Restore original styles
    element.style.cssText = originalStyle;

    const imgData = canvas.toDataURL("image/png", 1.0);

    // Calculate dimensions for A4 page (210 x 297 mm)
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Add some margin
    const margin = 10;
    const contentWidth = pdfWidth - margin * 2;
    const contentHeight = pdfHeight - margin * 2;

    // Calculate image dimensions to fit within content area
    const imgAspectRatio = canvas.width / canvas.height;
    let imgWidth = contentWidth;
    let imgHeight = contentWidth / imgAspectRatio;

    // If image is too tall, scale it down
    if (imgHeight > contentHeight) {
      imgHeight = contentHeight;
      imgWidth = contentHeight * imgAspectRatio;
    }

    // Center the image
    const xOffset = margin + (contentWidth - imgWidth) / 2;
    const yOffset = margin;

    // Add image to PDF
    pdf.addImage(imgData, "PNG", xOffset, yOffset, imgWidth, imgHeight);

    // Save the PDF
    pdf.save(filename);
    return true;
  } catch (error: any) {
    console.error("Error generating PDF:", error);

    // Provide more specific error messages
    if (error.message && error.message.includes("color function")) {
      throw new Error(
        "PDF generation failed due to unsupported CSS colors. Please try the print method instead."
      );
    } else if (error.message && error.message.includes("canvas")) {
      throw new Error(
        "PDF generation failed during canvas creation. Please try the print method instead."
      );
    } else {
      throw new Error(
        `Failed to generate PDF: ${error.message || "Unknown error"}`
      );
    }
  }
};

export const generatePDFBlob = async (elementId: string): Promise<Blob> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    // Wait for any images or fonts to load
    await new Promise((resolve) => setTimeout(resolve, 500));

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
      logging: false,
      onclone: (clonedDoc) => {
        // Fix color compatibility issues
        fixColorCompatibility(clonedDoc);
      },
    });

    const imgData = canvas.toDataURL("image/png", 1.0);

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const margin = 10;
    const contentWidth = pdfWidth - margin * 2;
    const contentHeight = pdfHeight - margin * 2;

    const imgAspectRatio = canvas.width / canvas.height;
    let imgWidth = contentWidth;
    let imgHeight = contentWidth / imgAspectRatio;

    if (imgHeight > contentHeight) {
      imgHeight = contentHeight;
      imgWidth = contentHeight * imgAspectRatio;
    }

    const xOffset = margin + (contentWidth - imgWidth) / 2;
    const yOffset = margin;

    pdf.addImage(imgData, "PNG", xOffset, yOffset, imgWidth, imgHeight);

    return pdf.output("blob");
  } catch (error: any) {
    console.error("Error generating PDF blob:", error);

    // Provide more specific error messages
    if (error.message && error.message.includes("color function")) {
      throw new Error(
        "PDF generation failed due to unsupported CSS colors. Please try the print method instead."
      );
    } else if (error.message && error.message.includes("canvas")) {
      throw new Error(
        "PDF generation failed during canvas creation. Please try the print method instead."
      );
    } else {
      throw new Error(
        `Failed to generate PDF blob: ${error.message || "Unknown error"}`
      );
    }
  }
};

// Alternative PDF generation using browser's print functionality
export const generatePDFViaPrint = (
  elementId: string,
  filename: string = "resume.pdf"
) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    // Create a new window with just the resume content
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      throw new Error("Failed to open print window. Please allow popups.");
    }

    // Get all stylesheets from the current document
    const stylesheets = Array.from(document.styleSheets)
      .map((sheet) => {
        try {
          return Array.from(sheet.cssRules)
            .map((rule) => rule.cssText)
            .join("\n");
        } catch (e) {
          // Handle cross-origin stylesheets
          return "";
        }
      })
      .join("\n");

    // Create the print document with clean print styles
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${filename}</title>
          <meta charset="utf-8">
          <style>
            ${stylesheets}
            
            @page {
              size: A4;
              margin: 0.5in;
              @top-left { content: none; }
              @top-center { content: none; }
              @top-right { content: none; }
              @bottom-left { content: none; }
              @bottom-center { content: none; }
              @bottom-right { content: none; }
            }
            
            @media print {
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              
              html, body {
                width: 210mm;
                height: 297mm;
                margin: 0 !important;
                padding: 0 !important;
                overflow: hidden !important;
              }
              
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                background: white !important;
              }
              
              #resume-preview { 
                width: 100% !important; 
                height: auto !important; 
                max-height: 100vh !important;
                aspect-ratio: unset !important;
                box-shadow: none !important;
                border-radius: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                transform: scale(0.95) !important;
                transform-origin: top left !important;
                overflow: hidden !important;
              }
              
              .no-print { display: none !important; }
              .shadow-lg { box-shadow: none !important; }
              .rounded-lg { border-radius: 0 !important; }
              
              /* Hide any potential page breaks */
              * {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }
            }
          </style>
        </head>
        <body>
          ${element.outerHTML}
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
    console.error("Error generating PDF via print:", error);
    throw error;
  }
};

// Simple download trigger for browser's built-in PDF generation
export const triggerBrowserPrint = () => {
  try {
    // Show instructions to user about disabling headers/footers
    const shouldContinue = window.confirm(
      "For best results:\n\n" +
        "1. In the print dialog, click 'More settings'\n" +
        "2. Uncheck 'Headers and footers'\n" +
        "3. Set margins to 'Minimum' or 'Custom'\n" +
        "4. Choose 'Save as PDF'\n\n" +
        "Click OK to open print dialog"
    );

    if (!shouldContinue) {
      return false;
    }

    // Add print-specific styles temporarily
    const printStyles = document.createElement("style");
    printStyles.id = "resume-print-styles";
    printStyles.textContent = `
      @page {
        size: A4;
        margin: 0.5in;
        @top-left { content: none !important; }
        @top-center { content: none !important; }
        @top-right { content: none !important; }
        @bottom-left { content: none !important; }
        @bottom-center { content: none !important; }
        @bottom-right { content: none !important; }
      }
      
      @media print {
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        body * { 
          visibility: hidden !important; 
        }
        
        #resume-preview, 
        #resume-preview * { 
          visibility: visible !important; 
        }
        
        #resume-preview { 
          position: absolute !important; 
          left: 0 !important; 
          top: 0 !important; 
          width: 100% !important;
          height: auto !important;
          max-height: 100vh !important;
          aspect-ratio: unset !important;
          box-shadow: none !important;
          border-radius: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          transform: scale(0.95) !important;
          transform-origin: top left !important;
          overflow: hidden !important;
          background: white !important;
        }
        
        .no-print { display: none !important; }
        .shadow-lg { box-shadow: none !important; }
        .rounded-lg { border-radius: 0 !important; }
        
        /* Ensure single page */
        * {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        
        /* Hide browser headers/footers */
        html {
          margin: 0 !important;
          padding: 0 !important;
        }
        
        body {
          margin: 0 !important;
          padding: 0 !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }
      }
    `;
    document.head.appendChild(printStyles);

    // Trigger print
    window.print();

    // Remove print styles after printing
    setTimeout(() => {
      const existingStyles = document.getElementById("resume-print-styles");
      if (existingStyles) {
        document.head.removeChild(existingStyles);
      }
    }, 2000);

    return true;
  } catch (error) {
    console.error("Error triggering browser print:", error);
    throw error;
  }
};

// Create a clean print window with no headers/footers
// Simple CSS-only PDF generation (most reliable)
export const generateSimplePDF = (
  elementId: string,
  filename: string = "resume.pdf"
) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    // Create a simple print window with inline styles only
    const printWindow = window.open("", "_blank", "width=800,height=1000");
    if (!printWindow) {
      throw new Error("Failed to open print window. Please allow popups.");
    }

    // Get the element's HTML and inline all styles
    const elementClone = element.cloneNode(true) as HTMLElement;

    // Simple HTML document with minimal styling
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title></title>
          <meta charset="utf-8">
          <style>
            @page {
              size: A4;
              margin: 0.5in;
              @top-left { content: none; }
              @top-center { content: none; }
              @top-right { content: none; }
              @bottom-left { content: none; }
              @bottom-center { content: none; }
              @bottom-right { content: none; }
            }
            
            * { 
              margin: 0; 
              padding: 0; 
              box-sizing: border-box; 
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: white;
              color: #000;
              line-height: 1.4;
            }
            
            .resume-content {
              width: 100%;
              max-width: none;
              padding: 0;
              background: white;
            }
            
            h1 { font-size: 24px; font-weight: bold; margin-bottom: 8px; color: #000; }
            h2 { font-size: 18px; font-weight: 600; margin-bottom: 6px; color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 4px; }
            h3 { font-size: 16px; font-weight: 600; margin-bottom: 4px; color: #000; }
            p { margin-bottom: 4px; color: #374151; }
            
            .text-primary { color: #3b82f6; }
            .text-gray-900 { color: #111827; }
            .text-gray-700 { color: #374151; }
            .text-gray-600 { color: #4b5563; }
            .border-b-2 { border-bottom: 2px solid; }
            .border-primary { border-color: #3b82f6; }
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
            
            @media print {
              body { margin: 0; padding: 0; }
              .resume-content { margin: 0; padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="resume-content">
            ${elementClone.innerHTML}
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
    console.error("Error generating simple PDF:", error);
    throw error;
  }
};

export const openCleanPrintWindow = (
  elementId: string,
  filename: string = "resume.pdf"
) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    // Create a new window with specific features to minimize browser chrome
    const printWindow = window.open(
      "",
      "_blank",
      "width=800,height=1000,scrollbars=yes,resizable=yes"
    );
    if (!printWindow) {
      throw new Error("Failed to open print window. Please allow popups.");
    }

    // Get computed styles for the element
    const computedStyle = window.getComputedStyle(element);

    // Create a minimal HTML document
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
              @top-left { content: none !important; }
              @top-center { content: none !important; }
              @top-right { content: none !important; }
              @bottom-left { content: none !important; }
              @bottom-center { content: none !important; }
              @bottom-right { content: none !important; }
            }
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            html, body {
              width: 100%;
              height: 100%;
              background: white;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            .resume-container {
              width: 210mm;
              min-height: 297mm;
              margin: 0 auto;
              background: white;
              padding: 12.7mm;
              box-sizing: border-box;
            }
            
            @media print {
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              
              html, body {
                margin: 0 !important;
                padding: 0 !important;
              }
              
              .resume-container {
                margin: 0 !important;
                padding: 12.7mm !important;
                width: 100% !important;
                height: 100% !important;
                min-height: auto !important;
              }
              
              /* Hide instruction box when printing */
              div[style*="position: fixed"] {
                display: none !important;
              }
              
              * {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }
            }
            
            @media screen {
              body {
                padding: 20px;
                background: #f0f0f0;
              }
            }
          </style>
        </head>
        <body>
          <div class="resume-container">
            ${element.innerHTML}
          </div>
          <div style="position: fixed; top: 10px; right: 10px; background: #fff3cd; border: 2px solid #ffc107; padding: 15px; border-radius: 8px; font-size: 14px; max-width: 350px; z-index: 1000; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="font-weight: bold; color: #856404; margin-bottom: 8px;">⚠️ IMPORTANT: Remove Headers & Footers</div>
            <div style="color: #856404; line-height: 1.4;">
              1. Click "More settings" in print dialog<br>
              2. <strong>Uncheck "Headers and footers"</strong><br>
              3. Set margins to "Minimum"<br>
              4. Choose "Save as PDF"
            </div>
          </div>
          
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 1000);
            };
            
            window.onafterprint = function() {
              setTimeout(function() {
                window.close();
              }, 1000);
            };
            
            // Auto-close if user cancels print
            window.onfocus = function() {
              setTimeout(function() {
                if (!window.closed) {
                  window.close();
                }
              }, 2000);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
    return true;
  } catch (error) {
    console.error("Error opening clean print window:", error);
    throw error;
  }
};
