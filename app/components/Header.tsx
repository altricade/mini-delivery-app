"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Mini Delivery
          </Link>
          <nav className="flex gap-4">
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              Новая заявка
            </Link>
            <Link
              href="/orders"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith("/orders")
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              История заявок
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
