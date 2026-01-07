"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  ScanLine,
  LogOut,
} from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Event Management",
      href: "/admin/events",
      icon: CalendarDays,
    },
    {
      label: "User Management",
      href: "/admin/users",
      icon: Users,
    },
    {
      label: "Ticket Validation",
      href: "/admin/validate",
      icon: ScanLine,
    },
  ]

  return (
    <div className="flex min-h-screen text-white bg-[#0b0f1a]">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#324F5E] flex flex-col shadow-2xl">
        {/* LOGO */}
        <div className="h-20 flex items-center justify-center border-b border-white/20">
          <Image
            src="/logo.png"
            alt="CCNB Media"
            width={130}
            height={60}
            priority
          />
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${
                    active
                      ? "bg-white/25 text-white shadow"
                      : "text-white/80 hover:bg-white/15 hover:text-white"
                  }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t border-white/20">
          <button
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg
                       text-white/80 hover:text-white hover:bg-white/15 transition"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-[#0b0f1a] to-[#111827]">
        {children}
      </main>
    </div>
  )
}
