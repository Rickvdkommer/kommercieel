'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Pipeline' },
  { href: '/calls', label: 'Sales Calls' },
  { href: '/todos', label: 'To-Dos' },
]

export default function Nav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center gap-6 px-6 py-3 border-b border-gray-800 bg-gray-950">
      <Link href="/" className="text-lg font-bold text-white mr-4">
        Kommercieel CRM
      </Link>
      {links.map((link) => {
        const isActive = link.href === '/'
          ? pathname === '/'
          : pathname.startsWith(link.href)
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-medium transition-colors ${
              isActive
                ? 'text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
