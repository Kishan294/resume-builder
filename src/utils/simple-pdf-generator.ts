import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Color handling for PDF generation - OKLCH colors are replaced with safe alternatives

// Clean up element styles to remove problematic CSS
const cleanElementStyles = (element: HTMLElement): HTMLElement => {
  const clone = element.cloneNode(true) as HTMLElement;

  // Remove all existing stylesheets and style elements
  const styles = clone.querySelectorAll('style, link[rel="stylesheet"]');
  styles.forEach((style) => style.remove());

  // Process all elements to fix colors and styles
  const walker = document.createTreeWalker(
    clone,
    NodeFilter.SHOW_ELEMENT,
    null
  );

  let node;
  while ((node = walker.nextNode())) {
    const el = node as HTMLElement;

    // Remove any inline styles that might contain problematic colors
    if (el.hasAttribute("style")) {
      let styleAttr = el.getAttribute("style") || "";

      // Replace OKLCH/LAB/LCH colors with safe alternatives
      styleAttr = styleAttr.replace(/oklch\([^)]+\)/g, "#000000");
      styleAttr = styleAttr.replace(/lab\([^)]+\)/g, "#000000");
      styleAttr = styleAttr.replace(/lch\([^)]+\)/g, "#000000");

      // Replace CSS custom properties with actual values
      styleAttr = styleAttr.replace(/var\(--[^)]+\)/g, "#000000");

      el.setAttribute("style", styleAttr);
    }

    // Apply safe classes based on existing classes
    let classNameStr = "";
    if (el.className) {
      if (typeof el.className === "string") {
        classNameStr = el.className;
      } else if (
        typeof el.className === "object" &&
        "baseVal" in el.className
      ) {
        // Handle SVGAnimatedString
        classNameStr = (el.className as { baseVal: string }).baseVal;
      }
    }

    if (classNameStr) {
      const classes = classNameStr.split(" ");
      let safeStyles = "";

      // Map common Tailwind classes to safe inline styles
      classes.forEach((cls) => {
        switch (cls) {
          case "text-indigo-600":
          case "text-indigo-700":
            safeStyles += "color: #4f46e5; ";
            break;
          case "text-red-500":
          case "text-red-600":
            safeStyles += "color: #ef4444; ";
            break;
          case "text-gray-900":
            safeStyles += "color: #111827; ";
            break;
          case "text-gray-700":
            safeStyles += "color: #374151; ";
            break;
          case "text-gray-600":
            safeStyles += "color: #4b5563; ";
            break;
          case "text-white":
            safeStyles += "color: #ffffff; ";
            break;
          case "bg-white":
            safeStyles += "background-color: #ffffff; ";
            break;
          case "bg-indigo-600":
            safeStyles += "background-color: #4f46e5; ";
            break;
          case "bg-red-500":
            safeStyles += "background-color: #ef4444; ";
            break;
          case "border-indigo-600":
            safeStyles += "border-color: #4f46e5; ";
            break;
          case "border-indigo-200":
            safeStyles += "border-color: #a5b4fc; ";
            break;
          case "font-bold":
            safeStyles += "font-weight: 700; ";
            break;
          case "font-semibold":
            safeStyles += "font-weight: 600; ";
            break;
          case "font-medium":
            safeStyles += "font-weight: 500; ";
            break;
          case "text-sm":
            safeStyles += "font-size: 0.875rem; line-height: 1.25rem; ";
            break;
          case "text-xs":
            safeStyles += "font-size: 0.75rem; line-height: 1rem; ";
            break;
          case "text-lg":
            safeStyles += "font-size: 1.125rem; line-height: 1.75rem; ";
            break;
          case "text-xl":
            safeStyles += "font-size: 1.25rem; line-height: 1.75rem; ";
            break;
          case "text-2xl":
            safeStyles += "font-size: 1.5rem; line-height: 2rem; ";
            break;
          case "mb-1":
            safeStyles += "margin-bottom: 0.25rem; ";
            break;
          case "mb-2":
            safeStyles += "margin-bottom: 0.5rem; ";
            break;
          case "mb-3":
            safeStyles += "margin-bottom: 0.75rem; ";
            break;
          case "mb-4":
            safeStyles += "margin-bottom: 1rem; ";
            break;
          case "mb-6":
            safeStyles += "margin-bottom: 1.5rem; ";
            break;
          case "p-4":
            safeStyles += "padding: 1rem; ";
            break;
          case "p-6":
            safeStyles += "padding: 1.5rem; ";
            break;
          case "pb-1":
            safeStyles += "padding-bottom: 0.25rem; ";
            break;
          case "pb-4":
            safeStyles += "padding-bottom: 1rem; ";
            break;
          case "border-b":
            safeStyles +=
              "border-bottom-width: 1px; border-bottom-style: solid; ";
            break;
          case "border-b-2":
            safeStyles +=
              "border-bottom-width: 2px; border-bottom-style: solid; ";
            break;
          case "border-l-2":
            safeStyles += "border-left-width: 2px; border-left-style: solid; ";
            break;
          case "border-l-4":
            safeStyles += "border-left-width: 4px; border-left-style: solid; ";
            break;
          case "uppercase":
            safeStyles += "text-transform: uppercase; ";
            break;
          case "tracking-wide":
            safeStyles += "letter-spacing: 0.025em; ";
            break;
          case "leading-relaxed":
            safeStyles += "line-height: 1.625; ";
            break;
          case "text-center":
            safeStyles += "text-align: center; ";
            break;
          case "text-right":
            safeStyles += "text-align: right; ";
            break;
          case "flex":
            safeStyles += "display: flex; ";
            break;
          case "items-center":
            safeStyles += "align-items: center; ";
            break;
          case "justify-between":
            safeStyles += "justify-content: space-between; ";
            break;
          case "gap-1":
            safeStyles += "gap: 0.25rem; ";
            break;
          case "gap-4":
            safeStyles += "gap: 1rem; ";
            break;
        }
      });

      if (safeStyles) {
        const existingStyle = el.getAttribute("style") || "";
        el.setAttribute("style", existingStyle + safeStyles);
      }
    }
  }

  return clone;
};

// Add comprehensive CSS reset and base styles
const addBaseStyles = (doc: Document) => {
  const style = doc.createElement("style");
  style.textContent = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: #ffffff;
      color: #000000;
      line-height: 1.4;
      font-size: 14px;
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-weight: 600;
      margin: 0;
      color: #000000;
    }
    
    h1 { font-size: 24px; line-height: 32px; }
    h2 { font-size: 18px; line-height: 28px; }
    h3 { font-size: 16px; line-height: 24px; }
    
    p { margin: 0; color: #374151; }
    
    .text-indigo-600, .text-indigo-700 { color: #4f46e5 !important; }
    .text-red-500, .text-red-600 { color: #ef4444 !important; }
    .text-gray-900 { color: #111827 !important; }
    .text-gray-700 { color: #374151 !important; }
    .text-gray-600 { color: #4b5563 !important; }
    .text-white { color: #ffffff !important; }
    
    .bg-white { background-color: #ffffff !important; }
    .bg-indigo-600 { background-color: #4f46e5 !important; }
    .bg-red-500 { background-color: #ef4444 !important; }
    
    .border-indigo-600 { border-color: #4f46e5 !important; }
    .border-indigo-200 { border-color: #a5b4fc !important; }
    
    .font-bold { font-weight: 700 !important; }
    .font-semibold { font-weight: 600 !important; }
    .font-medium { font-weight: 500 !important; }
    
    .text-sm { font-size: 14px !important; line-height: 20px !important; }
    .text-xs { font-size: 12px !important; line-height: 16px !important; }
    .text-lg { font-size: 18px !important; line-height: 28px !important; }
    .text-xl { font-size: 20px !important; line-height: 28px !important; }
    .text-2xl { font-size: 24px !important; line-height: 32px !important; }
    
    .mb-1 { margin-bottom: 4px !important; }
    .mb-2 { margin-bottom: 8px !important; }
    .mb-3 { margin-bottom: 12px !important; }
    .mb-4 { margin-bottom: 16px !important; }
    .mb-6 { margin-bottom: 24px !important; }
    
    .p-4 { padding: 16px !important; }
    .p-6 { padding: 24px !important; }
    .pb-1 { padding-bottom: 4px !important; }
    .pb-4 { padding-bottom: 16px !important; }
    
    .border-b { border-bottom: 1px solid #e2e8f0 !important; }
    .border-b-2 { border-bottom: 2px solid #4f46e5 !important; }
    .border-l-2 { border-left: 2px solid #a5b4fc !important; }
    .border-l-4 { border-left: 4px solid #4f46e5 !important; }
    
    .uppercase { text-transform: uppercase !important; }
    .tracking-wide { letter-spacing: 0.025em !important; }
    .leading-relaxed { line-height: 1.625 !important; }
    
    .text-center { text-align: center !important; }
    .text-right { text-align: right !important; }
    
    .flex { display: flex !important; }
    .items-center { align-items: center !important; }
    .justify-between { justify-content: space-between !important; }
    
    .gap-1 { gap: 4px !important; }
    .gap-4 { gap: 16px !important; }
    
    .space-y-1 > * + * { margin-top: 4px !important; }
    .space-y-2 > * + * { margin-top: 8px !important; }
    .space-y-3 > * + * { margin-top: 12px !important; }
    .space-y-4 > * + * { margin-top: 16px !important; }
  `;
  doc.head.appendChild(style);
};

export const generateSimplePDF = async (
  elementId: string,
  filename: string = "resume.pdf"
): Promise<boolean> => {
  try {
    console.log("Starting PDF generation for element:", elementId);

    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    console.log("Element found, dimensions:", {
      width: element.scrollWidth,
      height: element.scrollHeight,
      offsetWidth: element.offsetWidth,
      offsetHeight: element.offsetHeight,
    });

    // Detect mobile device
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile =
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent
      );
    const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent);
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const isMobileDevice =
      isMobile || isTablet || (isTouchDevice && window.innerWidth <= 1024);

    console.log("Device detection:", {
      isMobile,
      isTablet,
      isTouchDevice,
      isMobileDevice,
      userAgent,
    });

    // Wait for any images or fonts to load - longer on mobile
    console.log("Waiting for resources to load...");
    await new Promise((resolve) =>
      setTimeout(resolve, isMobileDevice ? 3000 : 1500)
    );

    // Create canvas with mobile-optimized settings
    console.log("Starting html2canvas conversion...");
    const canvas = await html2canvas(element, {
      scale: isMobileDevice ? 1.0 : 1.5, // Even lower scale on mobile for better performance
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
      logging: isMobileDevice, // Enable logging on mobile for debugging
      width: element.scrollWidth,
      height: element.scrollHeight,
      // Mobile-specific optimizations
      ...(isMobileDevice && {
        foreignObjectRendering: false, // Disable for better mobile compatibility
        imageTimeout: 20000, // Longer timeout on mobile
        removeContainer: true,
        scrollX: 0,
        scrollY: 0,
      }),
      onclone: (clonedDoc) => {
        console.log("Cloning document for canvas...");
        // Add base styles to cloned document
        addBaseStyles(clonedDoc);

        // Clean up the cloned element
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          const cleanElement = cleanElementStyles(clonedElement);
          clonedElement.parentNode?.replaceChild(cleanElement, clonedElement);
        }
      },
    });

    console.log("Canvas created successfully:", {
      width: canvas.width,
      height: canvas.height,
    });

    const imgData = canvas.toDataURL("image/png", 1.0);

    // Create PDF with A4 dimensions
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Calculate dimensions with margins
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

    console.log("PDF created, attempting to save...");

    // Save the PDF with mobile-specific handling
    if (isMobileDevice) {
      // On mobile, try multiple approaches
      try {
        console.log("Attempting mobile PDF save...");

        // First try: Direct save
        pdf.save(filename);
        console.log("Direct save attempted");

        return true;
      } catch (error) {
        console.error("Direct mobile PDF save failed:", error);

        try {
          // Second try: Create blob and trigger download
          console.log("Trying blob download fallback...");
          const blob = pdf.output("blob");
          const url = URL.createObjectURL(blob);

          // Create download link
          const a = document.createElement("a");
          a.href = url;
          a.download = filename;
          a.style.display = "none";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);

          // Clean up
          setTimeout(() => URL.revokeObjectURL(url), 1000);

          console.log("Blob download attempted");
          return true;
        } catch (blobError) {
          console.error("Blob download failed:", blobError);

          // Third try: Open in new window
          try {
            console.log("Trying new window fallback...");
            const blob = pdf.output("blob");
            const url = URL.createObjectURL(blob);
            const newWindow = window.open(url, "_blank");

            if (newWindow) {
              console.log("New window opened successfully");
              return true;
            } else {
              throw new Error("Failed to open new window");
            }
          } catch (windowError) {
            console.error("New window fallback failed:", windowError);
            throw windowError;
          }
        }
      }
    } else {
      // Desktop handling
      console.log("Desktop PDF save...");
      pdf.save(filename);
      return true;
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error(
      `Failed to generate PDF: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const generatePDFBlob = async (elementId: string): Promise<Blob> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    // Wait for any images or fonts to load
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const canvas = await html2canvas(element, {
      scale: 1.5,
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
      logging: false,
      onclone: (clonedDoc) => {
        addBaseStyles(clonedDoc);
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          const cleanElement = cleanElementStyles(clonedElement);
          clonedElement.parentNode?.replaceChild(cleanElement, clonedElement);
        }
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
  } catch (error) {
    console.error("Error generating PDF blob:", error);
    throw new Error(
      `Failed to generate PDF blob: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const openPrintWindow = (elementId: string): boolean => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    const printWindow = window.open("", "_blank", "width=800,height=1000");
    if (!printWindow) {
      throw new Error("Failed to open print window. Please allow popups.");
    }

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
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: white;
              color: #000;
              line-height: 1.4;
              font-size: 14px;
            }
            
            .resume-container {
              width: 100%;
              max-width: none;
              padding: 0;
              background: white;
            }
            
            h1 { font-size: 24px; font-weight: bold; margin-bottom: 8px; color: #111827; }
            h2 { font-size: 18px; font-weight: 600; margin-bottom: 6px; color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 4px; }
            h3 { font-size: 16px; font-weight: 600; margin-bottom: 4px; color: #111827; }
            p { margin-bottom: 4px; color: #374151; }
            
            .text-indigo-600, .text-indigo-700 { color: #4f46e5; }
            .text-gray-900 { color: #111827; }
            .text-gray-700 { color: #374151; }
            .text-gray-600 { color: #4b5563; }
            .border-b-2 { border-bottom: 2px solid; }
            .border-indigo-600 { border-color: #4f46e5; }
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
            .border-l-2 { border-left: 2px solid #a5b4fc; }
            .border-l-4 { border-left: 4px solid #4f46e5; }
            
            @media print {
              body { margin: 0; padding: 0; }
              .resume-container { margin: 0; padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="resume-container">
            ${element.innerHTML}
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
    console.error("Error opening print window:", error);
    throw error;
  }
};
