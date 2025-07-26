"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

interface UseMobilePrintOptions {
  elementId: string;
  filename?: string;
}

interface UseMobilePrintReturn {
  isDownloading: boolean;
  isMobile: boolean;
  handlePrint: () => Promise<boolean>;
  handleDownload: () => Promise<boolean>;
}

export function useMobilePrint({
  elementId,
  filename = "resume.pdf",
}: UseMobilePrintOptions): UseMobilePrintReturn {
  const [isDownloading, setIsDownloading] = useState(false);

  // Detect mobile device
  const isMobile = useCallback(() => {
    if (typeof window === "undefined") return false;

    const userAgent = navigator.userAgent.toLowerCase();
    const mobile =
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent
      );
    const tablet = /ipad|android(?!.*mobile)/i.test(userAgent);
    const touch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    return mobile || tablet || (touch && window.innerWidth <= 1024);
  }, []);

  const handleDownload = useCallback(async (): Promise<boolean> => {
    setIsDownloading(true);
    const isOnMobile = isMobile();

    console.log("Starting download process...", {
      isOnMobile,
      elementId,
      filename,
    });

    try {
      // Check if element exists
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Element with ID "${elementId}" not found`);
      }

      if (isOnMobile) {
        console.log("Using mobile-first approach...");

        // For mobile, use native browser capabilities (most reliable)
        toast.info("Opening print view...", {
          description: "Preparing mobile-friendly print interface.",
        });

        try {
          // Primary method: Direct mobile print (most reliable - no popups)
          const { directMobilePrint } = await import(
            "@/utils/direct-mobile-print"
          );
          const directSuccess = directMobilePrint(elementId);

          if (directSuccess) {
            toast.success("Print view ready!", {
              description:
                "Your resume is now ready to print. Use the 'Print / Save as PDF' button.",
            });
            return true;
          }

          throw new Error("Direct mobile print failed");
        } catch (directError) {
          console.warn(
            "Direct print failed, trying native method:",
            directError
          );

          try {
            // Fallback method: Native mobile print with modal
            const { nativeMobilePrint } = await import(
              "@/utils/native-mobile-print"
            );
            const nativeSuccess = nativeMobilePrint(elementId);

            if (nativeSuccess) {
              toast.success("Print view opened!", {
                description:
                  "Use the 'Print / Save as PDF' button to download your resume.",
              });
              return true;
            }

            throw new Error("Native mobile print failed");
          } catch (nativeError) {
            console.warn(
              "All advanced methods failed, trying browser print:",
              nativeError
            );

            // Last resort: Direct browser print
            try {
              window.print();
              toast.success("Print dialog opened!", {
                description: "Choose 'Save as PDF' to download your resume.",
              });
              return true;
            } catch {
              throw new Error("All mobile print methods failed");
            }
          }
        }
      } else {
        console.log("Using desktop print dialog...");
        // Desktop PDF generation
        const { triggerBrowserPrint } = await import("@/utils/pdf-generator");
        const success = await triggerBrowserPrint();

        if (success) {
          toast.success(
            'Print dialog opened! Choose "Save as PDF" to download.'
          );
          return true;
        } else {
          throw new Error("Print dialog failed");
        }
      }
    } catch (error) {
      console.error("Download failed:", error);

      if (isOnMobile) {
        toast.error("Download failed. Please try again.", {
          description: `Error: ${
            error instanceof Error ? error.message : "Unknown error"
          }. Try refreshing the page or using a different browser.`,
        });
      } else {
        toast.error("Failed to open print dialog.", {
          description:
            'Try using Ctrl+P (Cmd+P on Mac) and select "Save as PDF".',
        });
      }

      return false;
    } finally {
      setIsDownloading(false);
    }
  }, [elementId, filename, isMobile]);

  const handlePrint = useCallback(async (): Promise<boolean> => {
    if (isMobile()) {
      // On mobile, "print" is essentially download
      return handleDownload();
    } else {
      // On desktop, open print dialog
      try {
        window.print();
        return true;
      } catch (error) {
        console.error("Print failed:", error);
        toast.error("Failed to open print dialog.");
        return false;
      }
    }
  }, [isMobile, handleDownload]);

  return {
    isDownloading,
    isMobile: isMobile(),
    handlePrint,
    handleDownload,
  };
}

// Utility function to check if device supports Web Share API
export function supportsWebShare(): boolean {
  if (typeof window === "undefined") return false;
  return "share" in navigator && "canShare" in navigator;
}

// Utility function to share a file if supported
export async function shareFile(
  file: File,
  title: string = "My Resume"
): Promise<boolean> {
  if (!supportsWebShare()) return false;

  try {
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title,
        text: "Here is my resume",
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error("Share failed:", error);
    return false;
  }
}
