"use client";

import { Orbitron } from "next/font/google";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

const SITE_CONFIG = {
  initial: "H",
  name: "Le Phuc",
  highlight: "Hau",
};

function MenuIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 16 16" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 16 16" fill="currentColor">
      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
    </svg>
  );
}

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function PortfolioHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className={`sticky top-0 z-50 w-full glass-card border-b border-white/10 ${orbitron.className}`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400/50
                          flex items-center justify-center
                          shadow-[0_0_12px_rgba(34,211,238,0.4)]"
            >
              <span className="text-cyan-400 text-lg font-bold">
                {SITE_CONFIG.initial}
              </span>
            </div>
            <span className={`text-xl font-bold ${orbitron.className}`}>
              <span className="text-white">{SITE_CONFIG.name} </span>
              <span className="gradient-text">{SITE_CONFIG.highlight}</span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-gray-300 hover:text-cyan-400 transition-colors text-sm font-medium"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            className="lg:hidden text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="lg:hidden mt-4 pb-2 flex flex-col gap-4 border-t border-white/10 pt-4">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="text-gray-300 hover:text-cyan-400 transition-colors text-sm font-medium"
              >
                {label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
