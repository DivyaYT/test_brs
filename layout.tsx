import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BRS Dashboard",
  description: "Bank Reconciliation System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex bg-gray-100">
        {/* ✅ Sidebar */}
        <aside className="w-64 bg-slate-900 text-white p-5 hidden md:block">
          <h2 className="text-2xl font-bold mb-6">BRS System</h2>

          <nav className="space-y-3">
            {/* <Link href="/test" className="block p-2 rounded hover:bg-slate-700">
              Test
            </Link>
            <Link href="/org" className="block p-2 rounded hover:bg-slate-700">
              Org
            </Link>
            <Link
              href="/customer"
              className="block p-2 rounded hover:bg-slate-700"
            >
              Customer
            </Link>
            <Link
              href="/cusreport"
              className="block p-2 rounded hover:bg-slate-700"
            >
              Customer Report
            </Link> 
            <Link href="/ocr" className="block p-2 rounded hover:bg-slate-700">
              OCR
            </Link> 
            <Link
              href="/bankextract"
              className="block p-2 rounded hover:bg-slate-700"
            >
              Bank Extract
            </Link> */}
            <Link
              href="/dashboard"
              className="block p-2 rounded hover:bg-slate-700"
            >
              Dashboard
            </Link>
            <Link href="/ap" className="block p-2 rounded hover:bg-slate-700">
              AP Upload
            </Link>
            <Link href="/gl" className="block p-2 rounded hover:bg-slate-700">
              GL Upload
            </Link>
            <Link href="/bank" className="block p-2 rounded hover:bg-slate-700">
              Bank Upload
            </Link>

            <Link
              href="/report"
              className="block p-2 rounded hover:bg-slate-700"
            >
              Reports
            </Link>
            <Link
              href="/report1"
              className="block p-2 rounded hover:bg-slate-700"
            >
              Manual Reconcile
            </Link>
            <Link
              href="/apglreport"
              className="block p-2 rounded hover:bg-slate-700"
            >
              APGL Report
            </Link>
            <Link
              href="/glbankreport"
              className="block p-2 rounded hover:bg-slate-700"
            >
              GLBank Report
            </Link>
            <Link
              href="/apbankreport"
              className="block p-2 rounded hover:bg-slate-700"
            >
              APBank Report
            </Link>
            <Link
              href="/reconciliationrep"
              className="block p-2 rounded hover:bg-slate-700"
            >
              Reconciliation Report
            </Link>
            <Link
              href="/mismatchedrep"
              className="block p-2 rounded hover:bg-slate-700"
            >
              Mismatched Report
            </Link>
          </nav>
        </aside>

        {/* ✅ Main Section */}
        <div className="flex-1 flex flex-col">
          {/* Navbar */}
          <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
            <h1 className="text-lg font-semibold">Dashboard</h1>
            <div className="text-sm text-gray-600">Welcome, User</div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body suppressHydrationWarning className="min-h-screen flex bg-gray-100">
//         {children}
//       </body>
//     </html>
//   );
// }
