import { FileText } from "lucide-react";

export function MarketingFooter() {
  return (
    <footer className="border-t border-slate-100 bg-slate-50/50">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-bold text-slate-900">
              Profil<span className="text-indigo-600">Craft</span>
            </span>
          </div>
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} ProfilCraft. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
