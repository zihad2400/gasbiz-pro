import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/ToastProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GasBiz Pro - Business Management",
  description: "Advanced Gas Business Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body 
        className={`${inter.className} antialiased bg-surface-900 text-slate-200`}
        suppressHydrationWarning={true}
      >
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
