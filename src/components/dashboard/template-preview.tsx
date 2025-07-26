"use client";

interface TemplatePreviewProps {
  templateId: string;
  isSelected: boolean;
  bgColor?: string;
}

export function TemplatePreview({ templateId, isSelected }: TemplatePreviewProps) {
  const renderPreview = () => {
    switch (templateId) {
      case 'modern':
        return (
          <div className="p-3 h-full space-y-2 bg-white">
            {/* Header with orange accent */}
            <div className="border-b-2 border-orange-500 pb-1">
              <div className="h-2.5 bg-gray-800 rounded w-2/3 mb-1"></div>
              <div className="flex gap-1">
                <div className="h-1 bg-gray-500 rounded w-1/4"></div>
                <div className="h-1 bg-gray-500 rounded w-1/4"></div>
              </div>
            </div>
            {/* Content sections */}
            <div className="space-y-1.5">
              <div className="h-1 bg-orange-500 rounded w-1/3"></div>
              <div className="h-1 bg-gray-300 rounded w-full"></div>
              <div className="h-1 bg-gray-300 rounded w-4/5"></div>
            </div>
            <div className="space-y-1">
              <div className="h-1 bg-orange-500 rounded w-1/4"></div>
              <div className="h-1 bg-gray-300 rounded w-full"></div>
            </div>
          </div>
        );

      case 'professional':
        return (
          <div className="h-full bg-white">
            {/* Dark header */}
            <div className="h-8 bg-gray-900 p-1.5 flex items-center">
              <div className="h-1.5 bg-white rounded w-1/2"></div>
            </div>
            {/* Two column layout */}
            <div className="p-2 flex gap-2">
              <div className="flex-1 space-y-1">
                <div className="h-1 bg-gray-800 rounded w-1/2"></div>
                <div className="border-l-2 border-gray-300 pl-1 space-y-0.5">
                  <div className="h-1 bg-gray-400 rounded w-full"></div>
                  <div className="h-1 bg-gray-400 rounded w-3/4"></div>
                </div>
              </div>
              <div className="w-1/3 space-y-1">
                <div className="bg-gray-100 p-1 rounded">
                  <div className="h-1 bg-gray-600 rounded w-full"></div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'creative':
        return (
          <div className="flex h-full">
            {/* Orange sidebar */}
            <div className="w-1/3 bg-gradient-to-b from-orange-500 to-red-500 p-2 space-y-1">
              <div className="w-4 h-4 bg-white/30 rounded-full mx-auto"></div>
              <div className="h-0.5 bg-white/40 rounded"></div>
              <div className="h-0.5 bg-white/30 rounded w-3/4"></div>
              <div className="space-y-0.5 mt-2">
                <div className="bg-white/20 rounded px-1 py-0.5">
                  <div className="h-0.5 bg-white/60 rounded"></div>
                </div>
              </div>
            </div>
            {/* Main content */}
            <div className="flex-1 p-2 bg-white space-y-1">
              <div className="bg-gray-50 p-1 rounded border-l-2 border-orange-500">
                <div className="h-1 bg-gray-400 rounded w-4/5"></div>
              </div>
              <div className="space-y-0.5">
                <div className="h-1 bg-gray-300 rounded"></div>
                <div className="h-1 bg-gray-300 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        );

      case 'minimal':
        return (
          <div className="p-3 h-full space-y-2 text-center bg-white">
            {/* Centered header */}
            <div className="h-2 bg-gray-800 rounded w-1/2 mx-auto"></div>
            <div className="space-y-0.5">
              <div className="h-0.5 bg-gray-400 rounded w-3/4 mx-auto"></div>
              <div className="h-0.5 bg-gray-400 rounded w-2/3 mx-auto"></div>
            </div>
            {/* Left-aligned sections with border */}
            <div className="text-left space-y-1.5 mt-2">
              <div className="border-l-2 border-gray-300 pl-2 space-y-0.5">
                <div className="h-1 bg-gray-600 rounded w-1/3 uppercase text-xs"></div>
                <div className="h-0.5 bg-gray-400 rounded"></div>
                <div className="h-0.5 bg-gray-400 rounded w-4/5"></div>
              </div>
              <div className="border-l-2 border-gray-300 pl-2 space-y-0.5">
                <div className="h-1 bg-gray-600 rounded w-1/4"></div>
                <div className="h-0.5 bg-gray-400 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        );

      case 'compact':
        return (
          <div className="p-2 h-full bg-white">
            {/* Compact header */}
            <div className="mb-1.5">
              <div className="h-2 bg-gray-800 rounded w-1/2 mb-0.5"></div>
              <div className="h-0.5 bg-gray-500 rounded w-full"></div>
            </div>
            {/* Two column layout */}
            <div className="grid grid-cols-2 gap-1.5">
              <div className="space-y-1">
                <div className="border-b border-gray-300 pb-0.5">
                  <div className="h-0.5 bg-gray-700 rounded w-3/4 uppercase"></div>
                </div>
                <div className="h-0.5 bg-gray-400 rounded"></div>
                <div className="h-0.5 bg-gray-400 rounded w-4/5"></div>
              </div>
              <div className="space-y-1">
                <div className="border-b border-gray-300 pb-0.5">
                  <div className="h-0.5 bg-gray-700 rounded w-1/2 uppercase"></div>
                </div>
                <div className="h-0.5 bg-gray-400 rounded"></div>
                <div className="h-0.5 bg-gray-400 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        );

      case 'classic':
        return (
          <div className="p-3 h-full space-y-2 bg-white font-serif">
            {/* Centered header with border */}
            <div className="text-center border-b-2 border-orange-500 pb-1">
              <div className="h-2 bg-gray-900 rounded w-1/2 mx-auto mb-0.5"></div>
              <div className="h-0.5 bg-gray-600 rounded w-2/3 mx-auto"></div>
            </div>
            {/* Traditional sections */}
            <div className="space-y-1">
              <div className="border-b border-orange-500 pb-0.5">
                <div className="h-1 bg-orange-600 rounded w-1/3 uppercase"></div>
              </div>
              <div className="h-0.5 bg-gray-600 rounded w-full"></div>
              <div className="h-0.5 bg-gray-600 rounded w-5/6"></div>
            </div>
            <div className="space-y-0.5">
              <div className="border-b border-orange-500 pb-0.5">
                <div className="h-1 bg-orange-600 rounded w-1/4 uppercase"></div>
              </div>
              <div className="h-0.5 bg-gray-600 rounded w-4/5"></div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-6 h-6 bg-gray-300 rounded-full mx-auto mb-1"></div>
              <p className="text-xs text-gray-500">Preview</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`h-40 rounded-lg border overflow-hidden transition-all ${isSelected ? 'border-orange-500 bg-orange-50 shadow-md' : 'border-gray-200 bg-white hover:border-gray-300'
      }`}>
      {renderPreview()}
    </div>
  );
}
