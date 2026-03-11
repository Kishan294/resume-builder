import { AppHeader } from "@/components/layout/app-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader variant="landing" />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}
