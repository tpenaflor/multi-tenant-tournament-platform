import "./globals.css";

export const metadata = {
  title: "Bracket Sports Platform",
  description: "Multi-tenant bracket sports website builder & tournament engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <div className="flex-1 flex flex-col">
          {children}
        </div>
        <footer className="py-6 text-center text-slate-500 text-sm border-t border-slate-800/50 mt-auto">
          <div className="space-x-4">
            <a href="/privacy-policy" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <span>&middot;</span>
            <a href="/terms-of-service" className="hover:text-slate-300 transition-colors">Terms of Service</a>
          </div>
          <div className="mt-2 text-xs opacity-60">
            &copy; {new Date().getFullYear()} Bracket Sports Platform. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
