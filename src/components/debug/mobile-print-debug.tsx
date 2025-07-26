"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMobilePrint } from "@/hooks/use-mobile-print";

interface MobilePrintDebugProps {
  elementId: string;
}

export function MobilePrintDebug({ elementId }: MobilePrintDebugProps) {
  const [debugInfo, setDebugInfo] = useState<Record<string, unknown>>({});
  const { isDownloading, isMobile, handleDownload } = useMobilePrint({
    elementId,
    filename: "debug-resume.pdf"
  });

  const runDiagnostics = () => {
    const element = document.getElementById(elementId);
    const userAgent = navigator.userAgent;

    const info = {
      timestamp: new Date().toISOString(),
      elementFound: !!element,
      elementDimensions: element ? {
        width: element.scrollWidth,
        height: element.scrollHeight,
        offsetWidth: element.offsetWidth,
        offsetHeight: element.offsetHeight
      } : null,
      userAgent,
      isMobile,
      windowDimensions: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      touchSupport: 'ontouchstart' in window,
      maxTouchPoints: navigator.maxTouchPoints,
      webShareSupport: 'share' in navigator && 'canShare' in navigator,
      canvasSupport: !!window.HTMLCanvasElement,
      blobSupport: !!window.Blob,
      urlCreateObjectURL: !!window.URL?.createObjectURL
    };

    setDebugInfo(info);
    console.log("Mobile Print Debug Info:", info);
  };

  const testNativePrint = async () => {
    try {
      const { nativeMobilePrint } = await import("@/utils/native-mobile-print");
      const success = nativeMobilePrint(elementId);
      console.log("Native print test result:", success);
    } catch (error) {
      console.error("Native print test failed:", error);
    }
  };

  const testPrintFallback = async () => {
    try {
      const { mobilePrintFallback } = await import("@/utils/mobile-pdf-fallback");
      const success = mobilePrintFallback(elementId);
      console.log("Print fallback test result:", success);
    } catch (error) {
      console.error("Print fallback test failed:", error);
    }
  };

  const testPDFGeneration = async () => {
    try {
      const { generateSimplePDF } = await import("@/utils/simple-pdf-generator");
      const success = await generateSimplePDF(elementId, "test-resume.pdf");
      console.log("PDF generation test result:", success);
    } catch (error) {
      console.error("PDF generation test failed:", error);
    }
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Card className="mt-4 border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          🐛 Mobile Print Debug
          {isMobile && <Badge variant="secondary">Mobile Device</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={runDiagnostics}>
            Run Diagnostics
          </Button>
          <Button size="sm" onClick={testNativePrint} variant="outline">
            Test Native Print
          </Button>
          <Button size="sm" onClick={testPrintFallback} variant="outline">
            Test Print Fallback
          </Button>
          <Button size="sm" onClick={testPDFGeneration} variant="outline">
            Test PDF Generation
          </Button>
          <Button
            size="sm"
            onClick={handleDownload}
            disabled={isDownloading}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {isDownloading ? "Downloading..." : "Test Full Flow"}
          </Button>
        </div>

        {Object.keys(debugInfo).length > 0 && (
          <div className="mt-3">
            <h4 className="text-xs font-semibold mb-2">Debug Information:</h4>
            <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-40">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}

        <div className="text-xs text-yellow-700">
          <p><strong>Instructions:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Run diagnostics to check device capabilities</li>
            <li>Test native print to verify the primary mobile method</li>
            <li>Test print fallback to verify the backup method works</li>
            <li>Test PDF generation to isolate PDF-specific issues</li>
            <li>Test full flow to see the complete user experience</li>
            <li>Check browser console for detailed logs</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}