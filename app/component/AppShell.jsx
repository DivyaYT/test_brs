"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PUBLIC_ROUTES = ["/login"];

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Uploads",
    children: [
      {
        label: "AP Upload",
        href: "/apupload",
      },
      {
        label: "GL Upload",
        href: "/glupload",
      },
      {
        label: "Bank Upload",
        href: "/bankupload",
      },
    ],
  },
  {
    label: "Records",
    children: [
      {
        label: "AP Records",
        href: "/aprecords",
      },
      {
        label: "GL Records",
        href: "/glrecords",
      },
      {
        label: "Bank Records",
        href: "/bankrecords",
      },
    ],
  },
  {
    label: "Reports",
    children: [
      {
        label: "Reports",
        href: "/report",
      },
      {
        label: "Manual Reconcile",
        href: "/report1",
      },
      {
        label: "APGL Report",
        href: "/apglreport",
      },
      {
        label: "GLBank Report",
        href: "/glbankreport",
      },
      {
        label: "APBank Report",
        href: "/apbankreport",
      },
      {
        label: "Reconciliation Report",
        href: "/reconciliationrep",
      },
      {
        label: "Mismatched Report",
        href: "/mismatchedrep",
      },
    ],
  },
  {
    label: "Administration",
    children: [
      {
        label: "User Report",
        href: "/userreport",
      },
    ],
  },
];

function isRouteActive(pathname, href) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function isActiveParent(pathname, item) {
  if (item.href) {
    return isRouteActive(pathname, item.href);
  }

  return item.children?.some((child) => isRouteActive(pathname, child.href));
}

export default function AppShell({ children }) {
  const pathname = usePathname();

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-slate-900 text-white p-5 hidden md:flex md:flex-col">
        <h2 className="text-2xl font-bold mb-6">BRS System</h2>

        <nav className="flex-1 overflow-y-auto space-y-1 pb-4">
          {NAV_ITEMS.map((item) => {
            const parentActive = isActiveParent(pathname, item);

            if (!item.children) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    parentActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            }

            return (
              <div key={item.label} className="group relative">
                <button
                  type="button"
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    parentActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  <span>{item.label}</span>

                  <svg
                    className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div className="invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 absolute left-0 top-full z-50 mt-1 w-full min-w-56 rounded-xl bg-white shadow-xl border border-gray-200 py-2 transition-all duration-200">
                  {item.children.map((child) => {
                    const childActive = isRouteActive(pathname, child.href);

                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`block px-4 py-2 text-sm transition-colors ${
                          childActive
                            ? "bg-blue-50 text-blue-700 font-semibold"
                            : "text-gray-700 hover:bg-gray-100 hover:text-blue-700"
                        }`}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="pt-5 border-t border-slate-700">
          <Link
            href="/login"
            className="block px-3 py-2 rounded-lg text-sm font-medium text-red-300 hover:bg-red-600 hover:text-white transition-colors"
          >
            Logout
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-800">BRS Dashboard</h1>

          <div className="text-sm text-gray-600">Welcome, User</div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
