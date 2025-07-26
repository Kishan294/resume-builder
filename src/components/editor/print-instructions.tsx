"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Info, Printer, Settings } from "lucide-react";

interface PrintInstructionsProps {
  onPrint: () => void;
  onDownload: () => void; // Keep for compatibility but both do the same thing now
}

export function PrintInstructions({ onPrint }: PrintInstructionsProps) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const tablet = /ipad|android(?!.*mobile)/i.test(userAgent);
      const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      setIsMobile(mobile || tablet || (touch && window.innerWidth <= 1024));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Info className="h-4 w-4 mr-2" />
          {isMobile ? "Download Help" : "Print Help"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isMobile ? "How to Download Your Resume" : "How to Print/Save Your Resume"}
          </DialogTitle>
          <DialogDescription>
            {isMobile
              ? "Get your resume as a PDF file on your mobile device"
              : "Follow these steps to get a clean, single-page PDF of your resume"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="flex gap-3">
            <Button onClick={onPrint} className="flex-1">
              <Printer className="h-4 w-4 mr-2" />
              {isMobile ? "Download PDF" : "Print / Save as PDF"}
            </Button>
          </div>

          {/* Mobile-specific instructions */}
          {isMobile && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-base text-blue-700 flex items-center gap-2">
                  📱 Mobile Instructions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-blue-600">
                  <p className="font-medium mb-2">On mobile devices, the app will:</p>
                  <ul className="space-y-1 ml-4">
                    <li>• Try to share the PDF directly if your device supports it</li>
                    <li>• Download the PDF to your device&apos;s Downloads folder</li>
                    <li>• Open a mobile-friendly print view as a fallback</li>
                  </ul>
                </div>
                <div className="text-xs text-blue-500 bg-blue-100 p-2 rounded">
                  <strong>Tip:</strong> If the PDF doesn&apos;t download automatically, look for a download notification in your browser or check your Downloads folder.
                </div>
              </CardContent>
            </Card>
          )}

          {/* Manual Instructions - Desktop only */}
          {!isMobile && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Manual Print Settings
                </CardTitle>
                <CardDescription>
                  If auto-download fails, use these browser print settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-0.5">1</Badge>
                    <div>
                      <p className="font-medium">Open Print Dialog</p>
                      <p className="text-sm text-muted-foreground">
                        Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+P</kbd> (Windows) or <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Cmd+P</kbd> (Mac)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-0.5">2</Badge>
                    <div>
                      <p className="font-medium">Choose &quot;Save as PDF&quot;</p>
                      <p className="text-sm text-muted-foreground">
                        Select &quot;Save as PDF&quot; or &quot;Microsoft Print to PDF&quot; as destination
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-0.5">3</Badge>
                    <div>
                      <p className="font-medium">Set Paper Size</p>
                      <p className="text-sm text-muted-foreground">
                        Choose &quot;A4&quot; or &quot;Letter&quot; size
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Badge variant="destructive" className="mt-0.5">4</Badge>
                    <div>
                      <p className="font-medium text-red-600">⚠️ IMPORTANT: Remove Headers & Footers</p>
                      <p className="text-sm text-muted-foreground">
                        In &quot;More settings&quot;, <strong>uncheck &quot;Headers and footers&quot;</strong> to remove date, time, and filename
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-0.5">5</Badge>
                    <div>
                      <p className="font-medium">Set Margins</p>
                      <p className="text-sm text-muted-foreground">
                        Choose &quot;Minimum&quot; or &quot;Custom&quot; margins (0.5 inch recommended)
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Important Warning - Desktop only */}
          {!isMobile && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-base text-red-700">🚨 To Remove Date/Time/Filename</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-600 font-medium mb-2">
                  The browser automatically adds headers and footers with date, time, and filename.
                </p>
                <p className="text-sm text-red-600">
                  <strong>You MUST uncheck &quot;Headers and footers&quot; in print settings</strong> to get a clean resume without this information.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">💡 Pro Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• The resume is designed to fit on a single A4/Letter page</li>
                {isMobile ? (
                  <>
                    <li>• PDF will be saved to your Downloads folder</li>
                    <li>• You can share the PDF directly from the download notification</li>
                    <li>• For best results, use Chrome or Safari browser</li>
                    <li>• If download fails, try refreshing the page and trying again</li>
                  </>
                ) : (
                  <>
                    <li>• Make sure &quot;Background graphics&quot; is enabled for colors</li>
                    <li>• If content is cut off, try reducing margins or font size</li>
                    <li>• For best results, use Chrome or Edge browser</li>
                    <li>• <strong>Always check &quot;More settings&quot; to disable headers/footers</strong></li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
