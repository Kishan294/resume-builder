"use client";

import { useState } from "react";
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
import { Info, Printer, Download, Settings } from "lucide-react";

interface PrintInstructionsProps {
  onPrint: () => void;
  onDownload: () => void;
}

export function PrintInstructions({ onPrint, onDownload }: PrintInstructionsProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Info className="h-4 w-4 mr-2" />
          Print Help
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>How to Print/Save Your Resume</DialogTitle>
          <DialogDescription>
            Follow these steps to get a clean, single-page PDF of your resume
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="flex gap-3">
            <Button onClick={onDownload} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Auto Download PDF
            </Button>
            <Button onClick={onPrint} variant="outline" className="flex-1">
              <Printer className="h-4 w-4 mr-2" />
              Open Print Dialog
            </Button>
          </div>

          {/* Manual Instructions */}
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
                    <p className="font-medium">Choose "Save as PDF"</p>
                    <p className="text-sm text-muted-foreground">
                      Select "Save as PDF" or "Microsoft Print to PDF" as destination
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5">3</Badge>
                  <div>
                    <p className="font-medium">Set Paper Size</p>
                    <p className="text-sm text-muted-foreground">
                      Choose "A4" or "Letter" size
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge variant="destructive" className="mt-0.5">4</Badge>
                  <div>
                    <p className="font-medium text-red-600">⚠️ IMPORTANT: Remove Headers & Footers</p>
                    <p className="text-sm text-muted-foreground">
                      In "More settings", <strong>uncheck "Headers and footers"</strong> to remove date, time, and filename
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5">5</Badge>
                  <div>
                    <p className="font-medium">Set Margins</p>
                    <p className="text-sm text-muted-foreground">
                      Choose "Minimum" or "Custom" margins (0.5 inch recommended)
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Warning */}
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-base text-red-700">🚨 To Remove Date/Time/Filename</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-600 font-medium mb-2">
                The browser automatically adds headers and footers with date, time, and filename.
              </p>
              <p className="text-sm text-red-600">
                <strong>You MUST uncheck "Headers and footers" in print settings</strong> to get a clean resume without this information.
              </p>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">💡 Pro Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• The resume is designed to fit on a single A4/Letter page</li>
                <li>• Make sure "Background graphics" is enabled for colors</li>
                <li>• If content is cut off, try reducing margins or font size</li>
                <li>• For best results, use Chrome or Edge browser</li>
                <li>• <strong>Always check "More settings" to disable headers/footers</strong></li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}