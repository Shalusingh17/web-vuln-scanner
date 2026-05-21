"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Menu, X, ChevronDown, Zap } from "lucide-react";
import { TOOLS_DROPDOWN } from "@/lib/constants";

/**
 * Public navbar items (SaaS-style)
 * - Must use proper route navigation (no same-page scrolling anchors).
 */
const navItems = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
];

interface NavDropdown {
  label: string;
  items: Array<{ label: string; href: string }>;
}

const dropdownItems: NavDropdown[] = [{ label: "Tools", items: TOOLS_DROPDOWN }];

function isActiveRoute(pathname: string, href: string): boolean {
  // Only highlight the current page. No anchor / scrolling behavior.
  if (href === "/") return pathname === "/";
  return pathname === href;
}

function NavDropdownMenu({
  label,
  items,
}: {
  label: string;
  items: Array<{ label: string; href: string }>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className="relative z-[100]"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <motion.button
        type="button"
        whileHover={{ color: "hsl(var(--primary))" }}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-1.5 rounded-lg py-2 pl-3 pr-2 text-sm text-muted-foreground transition-colors hover:bg-cyan-500/10 hover:text-primary"
      >
        {label}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 opacity-80" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-[100] min-w-[13rem] pt-2"
            role="menu"
          >
            <div className="max-h-[min(70vh,22rem)] overflow-y-auto overscroll-contain rounded-xl border border-cyan-500/20 bg-slate-900/95 py-1 shadow-xl shadow-cyan-500/10 backdrop-blur-xl">
              {items.map((item, i) => (
                <motion.div
                  key={`${item.href}-${item.label}`}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link
                    href={item.href}
                    role="menuitem"
                    className={`block px-4 py-2.5 text-sm transition-colors hover:bg-cyan-500/10 hover:text-cyan-300 ${
                      // Dropdown items should also follow pathname-based active behavior.
                      isActiveRoute(pathname, item.href)
                        ? "bg-cyan-500/15 text-cyan-300"
                        : "text-gray-300"
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();





  useEffect(() => {

    if (!mobileOpen) return;
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [mobileOpen]);

  return (
    <nav className="sticky top-0 z-50 w-full">
      <div className="pointer-events-none absolute inset-0 z-0 border-b border-cyan-500/10 bg-slate-950/85 backdrop-blur-xl" />

      <div className="relative z-10 container mx-auto">
        <div className="flex h-16 items-center justify-between px-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/25 ring-1 ring-cyan-400/20">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                Vuln<span className="text-cyan-400">Scanner</span>
              </span>
            </Link>
          </motion.div>

          <div className="hidden items-center gap-0.5 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-cyan-500/10 hover:text-cyan-300 hover:shadow-[0_0_20px_-5px_rgba(0,229,255,0.4)] ${
                  isActiveRoute(pathname, item.href)
                    ? "bg-cyan-500/15 text-cyan-300"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Dropdowns kept for now (will be refined in next iteration). */}
            {dropdownItems.map((d) => (
              <NavDropdownMenu
                key={d.label}
                label={d.label}
                items={d.items}
              />
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/auth/login">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-cyan-400 transition-all hover:bg-cyan-500/10 hover:text-white hover:shadow-[0_0_18px_-6px_rgba(0,229,255,0.45)]"
              >
                Log in
              </motion.span>
            </Link>
            <Link href="/auth/register">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition-all hover:shadow-cyan-500/50"
              >
                <Zap className="h-4 w-4" />
                Start scanning
              </motion.span>
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-foreground transition-colors hover:bg-cyan-500/10 lg:hidden"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <motion.div animate={{ rotate: mobileOpen ? 90 : 0 }}>
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </motion.div>
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-cyan-500/10 bg-slate-900/90 backdrop-blur-xl lg:hidden"
            >
              <div className="max-h-[min(70vh,calc(100dvh-4rem))] space-y-1 overflow-y-auto px-3 py-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-cyan-500/10 ${
                      isActiveRoute(pathname, item.href)
                        ? "bg-cyan-500/15 text-cyan-300"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}

                {dropdownItems.map((group) => (
                  <div key={group.label} className="border-t border-cyan-500/10 pt-3">
                    <p className="px-4 pb-2 text-xs font-semibold uppercase tracking-wider text-cyan-500/80">
                      {group.label}
                    </p>
                    <div className="space-y-0.5 pl-2">
                      {group.items.map((item) => (
                        <Link
                          key={`${group.label}-${item.href}`}
                          href={item.href}
                          className="block rounded-lg px-4 py-2 text-sm text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-300"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="space-y-2 border-t border-cyan-500/10 pt-4">
                  <Link
                    href="/auth/login"
                    className="block w-full rounded-lg px-4 py-3 text-center text-sm font-semibold text-cyan-400 hover:bg-cyan-500/10"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-cyan-500/20"
                  >
                    Start scanning
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
