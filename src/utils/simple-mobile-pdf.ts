"use client";

// Simple mobile PDF generation without html2canvas
export const generateMobilePDF = async (
  elementId: string,
  filename: string = "resume.pdf"
): Promise<boolean> => {
  try {
    console.log("Starting simple mobile PDF generation...");

    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    // Get text content and basic structure
    const textContent = extractTextContent(element);

    // Create a simple PDF using jsPDF with text only
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF("p", "mm", "a4");

    // Set up basic styling
    pdf.setFont("helvetica");
    pdf.setFontSize(12);

    // Add content line by line
    let yPosition = 20;
    const lineHeight = 6;
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;

    textContent.forEach((line) => {
      // Check if we need a new page
      if (yPosition > pageHeight - margin) {
        pdf.addPage();
        yPosition = 20;
      }

      // Handle different text styles
      if (line.type === "heading1") {
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
      } else if (line.type === "heading2") {
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
      } else if (line.type === "heading3") {
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
      } else {
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
      }

      // Split long lines
      const splitText = pdf.splitTextToSize(line.text, 170);
      pdf.text(splitText, margin, yPosition);
      yPosition += splitText.length * lineHeight + 2;
    });

    // Save the PDF
    try {
      pdf.save(filename);
      console.log("Simple mobile PDF saved successfully");
      return true;
    } catch (saveError) {
      console.error("Failed to save PDF:", saveError);

      // Fallback: create blob and download
      const blob = pdf.output("blob");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log("PDF downloaded via blob fallback");
      return true;
    }
  } catch (error) {
    console.error("Simple mobile PDF generation failed:", error);
    return false;
  }
};

// Extract text content with basic structure
function extractTextContent(
  element: HTMLElement
): Array<{ type: string; text: string }> {
  const content: Array<{ type: string; text: string }> = [];

  function processNode(node: Node, level: number = 0) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) {
        content.push({ type: "text", text });
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const tagName = element.tagName.toLowerCase();

      // Handle headings
      if (tagName === "h1") {
        const text = element.textContent?.trim();
        if (text) content.push({ type: "heading1", text });
      } else if (tagName === "h2") {
        const text = element.textContent?.trim();
        if (text) content.push({ type: "heading2", text });
      } else if (tagName === "h3") {
        const text = element.textContent?.trim();
        if (text) content.push({ type: "heading3", text });
      } else if (tagName === "p") {
        const text = element.textContent?.trim();
        if (text) content.push({ type: "paragraph", text });
      } else if (tagName === "li") {
        const text = element.textContent?.trim();
        if (text) content.push({ type: "listitem", text: `• ${text}` });
      } else if (tagName === "br") {
        content.push({ type: "break", text: "" });
      } else {
        // Process child nodes
        for (let i = 0; i < node.childNodes.length; i++) {
          processNode(node.childNodes[i], level + 1);
        }
      }
    }
  }

  processNode(element);
  return content;
}

// Alternative: Create a print-friendly HTML version
export const createPrintableHTML = (elementId: string): string => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with ID "${elementId}" not found`);
  }

  const content = element.innerHTML;

  return `
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
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.4;
            color: #000;
            background: #fff;
            font-size: 12px;
          }
          
          h1 { font-size: 18px; font-weight: bold; margin-bottom: 8px; color: #000; }
          h2 { font-size: 16px; font-weight: 600; margin-bottom: 6px; color: #4f46e5; border-bottom: 1px solid #4f46e5; padding-bottom: 2px; }
          h3 { font-size: 14px; font-weight: 600; margin-bottom: 4px; color: #000; }
          p { margin-bottom: 4px; color: #333; }
          
          .text-indigo-600, .text-indigo-700 { color: #4f46e5 !important; }
          .text-gray-900 { color: #000 !important; }
          .text-gray-700 { color: #333 !important; }
          .text-gray-600 { color: #666 !important; }
          
          .mb-1 { margin-bottom: 2px !important; }
          .mb-2 { margin-bottom: 4px !important; }
          .mb-3 { margin-bottom: 6px !important; }
          .mb-4 { margin-bottom: 8px !important; }
          .mb-6 { margin-bottom: 12px !important; }
          
          .font-bold { font-weight: bold !important; }
          .font-semibold { font-weight: 600 !important; }
          .font-medium { font-weight: 500 !important; }
          
          .text-sm { font-size: 11px !important; }
          .text-xs { font-size: 10px !important; }
          
          .flex { display: flex !important; }
          .items-center { align-items: center !important; }
          .gap-1 { gap: 2px !important; }
          .gap-4 { gap: 8px !important; }
          
          .space-y-2 > * + * { margin-top: 4px !important; }
          .space-y-3 > * + * { margin-top: 6px !important; }
          .space-y-4 > * + * { margin-top: 8px !important; }
          
          @media print {
            body { margin: 0; padding: 0; }
          }
        </style>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `;
};
