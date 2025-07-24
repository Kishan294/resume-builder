"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Download, Eye, Bug } from "lucide-react";

interface PDFDebugProps {
  elementId: string;
  filename?: string;
}

export function PDFDebug({ elementId, filename = "debug.pdf" }: PDFDebugProps) {
  const [isDebugging, setIsDebugging] = useState(false);

  const debugElement = () => {
    setIsDebugging(true);

    try {
      const element = document.getElementById(elementId);
      if (!element) {
        toast.error(`Element with ID "${elementId}" not found`);
        return;
      }

      console.log("Element found:", element);
      console.log("Element dimensions:", {
        width: element.offsetWidth,
        height: element.offsetHeight,
        scrollWidth: element.scrollWidth,
        scrollHeight: element.scrollHeight,
      });
      console.log("Element styles:", window.getComputedStyle(element));

      toast.success("Debug info logged to console");
    } catch (error) {
      console.error("Debug error:", error);
      toast.error("Debug failed");
    } finally {
      setIsDebugging(false);
    }
  };

  const testCanvasGeneration = async () => {
    setIsDebugging(true);

    try {
      const element = document.getElementById(elementId);
      if (!element) {
        toast.error(`Element with ID "${elementId}" not found`);
        return;
      }

      // Import html2canvas dynamically
      const html2canvas = (await import("html2canvas")).default;

      const canvas = await html2canvas(element, {
        scale: 1,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: true,
      });

      console.log("Canvas generated:", {
        width: canvas.width,
        height: canvas.height,
      });

      // Create a temporary link to download the canvas as image
      const link = document.createElement('a');
      link.download = 'debug-canvas.png';
      link.href = canvas.toDataURL();
      link.click();

      toast.success("Canvas generated and downloaded as PNG");
    } catch (error) {
      console.error("Canvas generation error:", error);
      toast.error(`Canvas generation failed: ${error.message}`);
    } finally {
      setIsDebugging(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="h-5 w-5" />
          PDF Debug Tools
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          variant="outline"
          onClick={debugElement}
          disabled={isDebugging}
          className="w-full"
        >
          <Eye className="h-4 w-4 mr-2" />
          Debug Element
        </Button>

        <Button
          variant="outline"
          onClick={testCanvasGeneration}
          disabled={isDebugging}
          className="w-full"
        >
          <Download className="h-4 w-4 mr-2" />
          Test Canvas Generation
        </Button>

        <p className="text-xs text-muted-foreground">
          Target element: #{elementId}
        </p>
      </CardContent>
    </Card>
  );
}