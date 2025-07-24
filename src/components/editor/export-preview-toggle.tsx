"use client";

import { useState } from "react";
import { Eye, FileDown } from "lucide-react";

interface ExportPreviewToggleProps {
  onModeChange: (mode: 'preview' | 'export') => void;
  currentMode: 'preview' | 'export';
}

export function ExportPreviewToggle({ onModeChange, currentMode }: ExportPreviewToggleProps) {
  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => onModeChange('preview')}
        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentMode === 'preview'
          ? 'bg-white text-gray-900 shadow-sm'
          : 'text-gray-600 hover:text-gray-900'
          }`}
      >
        <Eye className="h-4 w-4" />
        Screen Preview
      </button>
      <button
        onClick={() => onModeChange('export')}
        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentMode === 'export'
          ? 'bg-white text-gray-900 shadow-sm'
          : 'text-gray-600 hover:text-gray-900'
          }`}
      >
        <FileDown className="h-4 w-4" />
        Export Preview
      </button>
    </div>
  );
}