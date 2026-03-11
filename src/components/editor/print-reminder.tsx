"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, AlertTriangle } from "lucide-react";

export function PrintReminder() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show reminder when user presses Ctrl+P or Cmd+P
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        setIsVisible(true);
        // Hide after 10 seconds
        setTimeout(() => setIsVisible(false), 10000);
      }
    };

    // Show reminder when print dialog is opened
    const handleBeforePrint = () => {
      setIsVisible(true);
    };

    const handleAfterPrint = () => {
      setTimeout(() => setIsVisible(false), 2000);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-up">
      <Card className="border-orange-200 bg-indigo-50 shadow-lg max-w-sm">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-indigo-700 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-orange-800 mb-1">
                Print Reminder
              </h4>
              <p className="text-sm text-orange-700 mb-3">
                To remove date, time, and filename from your PDF:
              </p>
              <ol className="text-xs text-indigo-700 space-y-1 mb-3">
                <li>1. Click &quot;More settings&quot; in print dialog</li>
                <li>2. Uncheck &quot;Headers and footers&quot;</li>
                <li>3. Set margins to &quot;Minimum&quot;</li>
              </ol>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="h-6 w-6 p-0 text-indigo-700 hover:text-orange-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
