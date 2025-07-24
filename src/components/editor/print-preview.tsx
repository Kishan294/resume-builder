"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff } from "lucide-react";
import { Resume } from "@/types/resume";
import { ResumePreview } from "./resume-preview";

interface PrintPreviewProps {
  resume: Resume;
}

export function PrintPreview({ resume }: PrintPreviewProps) {
  const [isPrintPreview, setIsPrintPreview] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">Preview</h3>
          {isPrintPreview && (
            <Badge variant="secondary" className="text-xs">
              Print Mode
            </Badge>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsPrintPreview(!isPrintPreview)}
        >
          {isPrintPreview ? (
            <>
              <EyeOff className="h-4 w-4 mr-2" />
              Exit Print Preview
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Print Preview
            </>
          )}
        </Button>
      </div>

      <div
        className={`transition-all duration-300 ${isPrintPreview
          ? 'bg-gray-100 p-4 rounded-lg'
          : ''
          }`}
      >
        <div
          className={`${isPrintPreview
            ? 'transform scale-75 origin-top shadow-2xl'
            : ''
            }`}
          style={isPrintPreview ? {
            width: '210mm',
            minHeight: '297mm',
            maxWidth: '210mm',
            backgroundColor: 'white',
            margin: '0 auto',
            padding: '12.7mm', // 0.5 inch margins
            boxSizing: 'border-box'
          } : {}}
        >
          <ResumePreview resume={resume} exportMode={isPrintPreview} />
        </div>
      </div>

      {isPrintPreview && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Print Preview Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              This shows exactly how your resume will look when exported to PDF or printed.
              The layout, spacing, and font sizes match the exported version.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}