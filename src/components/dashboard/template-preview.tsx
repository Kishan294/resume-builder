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
          <div className="p-3 h-full space-y-2">
            <div className="h-3 bg-blue-300 rounded w-3/4"></div>
            <div className="h-0.5 bg-blue-500 rounded w-full"></div>
            <div className="space-y-1">
              <div className="h-1.5 bg-gray-300 rounded w-full"></div>
              <div className="h-1.5 bg-gray-300 rounded w-4/5"></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="h-1.5 bg-blue-200 rounded"></div>
              <div className="h-1.5 bg-blue-200 rounded"></div>
            </div>
          </div>
        );

      case 'professional':
        return (
          <div className="h-full">
            <div className="h-6 bg-gray-800 p-2 flex items-center">
              <div className="h-1.5 bg-white/80 rounded w-1/3"></div>
            </div>
            <div className="p-3 space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 space-y-1">
                  <div className="h-1.5 bg-gray-300 rounded"></div>
                  <div className="h-1.5 bg-gray-300 rounded w-4/5"></div>
                </div>
                <div className="space-y-1">
                  <div className="h-1.5 bg-gray-400 rounded"></div>
                  <div className="h-1.5 bg-gray-400 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'creative':
        return (
          <div className="flex h-full">
            <div className="w-1/3 bg-gradient-to-b from-purple-400 to-pink-500 p-2 space-y-1">
              <div className="w-4 h-4 bg-white/30 rounded-full mx-auto"></div>
              <div className="h-1 bg-white/40 rounded"></div>
              <div className="h-1 bg-white/30 rounded w-3/4"></div>
            </div>
            <div className="flex-1 p-2 space-y-1">
              <div className="h-1.5 bg-purple-200 rounded w-4/5"></div>
              <div className="h-1 bg-gray-300 rounded"></div>
              <div className="h-1 bg-gray-300 rounded w-5/6"></div>
            </div>
          </div>
        );

      case 'minimal':
        return (
          <div className="p-3 h-full space-y-2 text-center">
            <div className="h-2.5 bg-gray-400 rounded w-1/2 mx-auto"></div>
            <div className="space-y-1">
              <div className="h-1 bg-gray-300 rounded w-3/4 mx-auto"></div>
              <div className="h-1 bg-gray-300 rounded w-2/3 mx-auto"></div>
            </div>
            <div className="border-l-2 border-gray-400 pl-2 space-y-1 text-left">
              <div className="h-1.5 bg-gray-400 rounded w-1/3"></div>
              <div className="h-1 bg-gray-300 rounded"></div>
            </div>
          </div>
        );

      case 'compact':
        return (
          <div className="p-2 h-full">
            <div className="flex items-center justify-between mb-2">
              <div className="h-2 bg-green-400 rounded w-1/3"></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <div className="h-1.5 bg-green-300 rounded w-3/4"></div>
                <div className="h-1 bg-gray-300 rounded"></div>
                <div className="h-1 bg-gray-300 rounded w-4/5"></div>
              </div>
              <div className="space-y-1">
                <div className="h-1.5 bg-green-300 rounded w-1/2"></div>
                <div className="h-1 bg-gray-300 rounded"></div>
                <div className="h-1 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        );

      case 'classic':
        return (
          <div className="p-3 h-full space-y-2">
            <div className="text-center border-b border-gray-700 pb-2">
              <div className="h-2.5 bg-gray-700 rounded w-1/2 mx-auto"></div>
            </div>
            <div className="space-y-1">
              <div className="h-1.5 bg-gray-600 rounded w-1/4"></div>
              <div className="h-1 bg-gray-400 rounded w-full"></div>
              <div className="h-1 bg-gray-400 rounded w-5/6"></div>
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
    <div className={`h-32 rounded border overflow-hidden ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
      }`}>
      {renderPreview()}
    </div>
  );
}