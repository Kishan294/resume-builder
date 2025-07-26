"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, Share2, Printer, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface MobilePrintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload: () => Promise<boolean>;
}

export function MobilePrintDialog({ open, onOpenChange, onDownload }: MobilePrintDialogProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'success' | 'error'>('idle');
  const [supportsShare, setSupportsShare] = useState(false);

  useEffect(() => {
    // Check if Web Share API is supported
    setSupportsShare('share' in navigator && 'canShare' in navigator);
  }, []);

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadStatus('downloading');

    try {
      const success = await onDownload();
      if (success) {
        setDownloadStatus('success');
        toast.success("Resume downloaded successfully!");
      } else {
        setDownloadStatus('error');
        toast.error("Download failed. Please try again.");
      }
    } catch (error) {
      console.error("Download error:", error);
      setDownloadStatus('error');
      toast.error("Download failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    // Trigger browser print as fallback
    window.print();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Download Resume
          </DialogTitle>
          <DialogDescription>
            Choose how you&apos;d like to get your resume
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Download as PDF */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download PDF
                {downloadStatus === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                {downloadStatus === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
              </CardTitle>
              <CardDescription className="text-sm">
                Save your resume as a PDF file to your device
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full"
                variant={downloadStatus === 'success' ? 'outline' : 'default'}
              >
                {isDownloading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating PDF...
                  </>
                ) : downloadStatus === 'success' ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Downloaded!
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Share (if supported) */}
          {supportsShare && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share PDF
                </CardTitle>
                <CardDescription className="text-sm">
                  Generate and share your resume directly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  variant="outline"
                  className="w-full"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Generate & Share
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Print as fallback */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Printer className="h-4 w-4" />
                Print
              </CardTitle>
              <CardDescription className="text-sm">
                Open browser print dialog (fallback option)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handlePrint}
                variant="outline"
                className="w-full"
              >
                <Printer className="h-4 w-4 mr-2" />
                Open Print Dialog
              </Button>
            </CardContent>
          </Card>

          {/* Status messages */}
          {downloadStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Download Complete!</span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                Check your Downloads folder or notification bar for the PDF file.
              </p>
            </div>
          )}

          {downloadStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Download Failed</span>
              </div>
              <p className="text-xs text-red-600 mt-1">
                Please try again or use the print option as a fallback.
              </p>
            </div>
          )}

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="text-sm font-medium text-blue-700 mb-1">💡 Tips</h4>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• PDF files are saved to your Downloads folder</li>
              <li>• You can share the PDF from your file manager</li>
              <li>• For best results, use Chrome or Safari browser</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}