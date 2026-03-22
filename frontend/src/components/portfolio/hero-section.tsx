"use client";

import { cn } from "@/lib/utils";
import { Orbitron } from "next/font/google";
import { useEffect, useState } from "react";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const HERO_CONFIG = {
  name: "Le Phuc Hau",
  titles: [
    "Backend Developer (NestJS / Node.js)",
    "Frontend Developer (Next.js / React)",
  ],
  description:
    "Passionate about building web applications with clean code and modern technologies. Always learning and improving through real-world projects.",

  contact: [
    {
      type: "location",
      value: "Vietnam · Ho Chi Minh",
      icon: <GeoIcon />,
    },
    {
      type: "availability",
      value: "Open to Fresher / Junior roles",
      icon: <ClockIcon />,
    },
    {
      type: "email",
      value: "lephuchau21022003@gmail.com",
      href: "mailto:lephuchau21022003@gmail.com",
      icon: <EnvelopeIcon />,
    },
    {
      type: "phone",
      value: "0385016917",
      icon: <PhoneIcon />,
    },
  ],

  stats: [
    { value: "15+", label: "Repositories" },
    { value: "300+", label: "Commits" },
    { value: "5+", label: "Completed Projects" },
    { value: "3+", label: "Tech Stacks Explored" },
  ],

  socials: [
    { href: "#", label: "LinkedIn", icon: <LinkedInIcon /> },
    {
      href: "https://github.com/Hau21022003",
      label: "GitHub",
      icon: <GitHubIcon />,
    },
    {
      href: "https://www.facebook.com/hau.phuc.675454/",
      label: "Twitter/X",
      icon: <TwitterXIcon />,
    },
  ],
};

export default function HeroSection() {
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const target = HERO_CONFIG.titles[titleIndex];
    let timeout: any;

    if (!deleting && displayed.length < target.length) {
      timeout = setTimeout(
        () => setDisplayed(target.slice(0, displayed.length + 1)),
        80,
      );
    } else if (!deleting && displayed.length === target.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setTitleIndex((i) => (i + 1) % HERO_CONFIG.titles.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, titleIndex]);

  return (
    <section id="hero" className="min-h-screen text-white flex items-center">
      <div className="max-w-6xl mx-auto px-6 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* ── Left column: image + stats ── */}
          <div className="space-y-8">
            {/* Portrait */}
            <div className="relative">
              <div className="w-full aspect-video rounded-xl overflow-hidden glow-border animate-float">
                <img
                  src="/portfolio/hero.png"
                  alt={HERO_CONFIG.name}
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Available badge */}
              <div className="absolute -bottom-4 right-6 md:-right-4 glass-card rounded-lg px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse block" />
                  <span className="text-sm font-medium">
                    Available for Work
                  </span>
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {HERO_CONFIG.stats.map(({ value, label }) => (
                <div
                  key={label}
                  className="glass-card rounded-xl p-6 text-center"
                >
                  <div
                    className={`text-3xl font-bold gradient-text tracking-wide ${orbitron.className}`}
                  >
                    {value}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right column: bio ── */}
          <div className="space-y-6">
            {/* Name + role */}
            <div>
              <h1
                className={cn(
                  "text-5xl lg:text-6xl font-bold gradient-text mb-4 tracking-tight",
                  orbitron.className,
                )}
              >
                {HERO_CONFIG.name}
              </h1>
              <h2 className="text-2xl text-cyan-400 font-medium mb-6 h-9">
                <span>{displayed}</span>
                <span className="typing-cursor">|</span>
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                {HERO_CONFIG.description}
              </p>
            </div>

            {/* Meta info */}
            <ul className="space-y-3 text-gray-300">
              {HERO_CONFIG.contact.map(({ type, value, href, icon }) => (
                <li key={type} className="flex items-center gap-3">
                  {icon}
                  {href ? (
                    <a
                      href={href}
                      className="hover:text-cyan-400 transition-colors"
                    >
                      {value}
                    </a>
                  ) : (
                    <span>{value}</span>
                  )}
                </li>
              ))}
            </ul>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 font-semibold px-8 py-3 rounded-lg
                           bg-gradient-to-b from-cyan-600 to-blue-600
                           hover:shadow-lg hover:shadow-cyan-500/50
                           hover:-translate-y-1 transition-all max-sm:w-full justify-center"
              >
                <BriefcaseIcon />
                Hire Me
              </a>
              <a
                href="#projects"
                className="inline-flex items-center gap-2 font-semibold px-8 py-3 rounded-lg
                           glass-card hover:border-cyan-400
                           hover:-translate-y-1 transition-all max-sm:w-full justify-center"
              >
                <FolderIcon />
                View Projects
              </a>
            </div>

            {/* Social icons */}
            <div className="flex gap-3 pt-2">
              {HERO_CONFIG.socials.map(({ href, label, icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="glass-card px-4 py-2 rounded-lg hover:border-cyan-400 transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Inline SVG icons (same paths as original) ─────────────────────────── */

function GeoIcon() {
  return (
    <svg
      className="w-4 h-4 text-cyan-400 shrink-0"
      viewBox="0 0 16 16"
      fill="currentColor"
    >
      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6a3 3 0 0 1 0 6" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      className="w-4 h-4 text-cyan-400 shrink-0"
      viewBox="0 0 16 16"
      fill="currentColor"
    >
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
    </svg>
  );
}

function EnvelopeIcon() {
  return (
    <svg
      className="w-4 h-4 text-cyan-400 shrink-0"
      viewBox="0 0 16 16"
      fill="currentColor"
    >
      <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      className="w-4 h-4 text-cyan-400 shrink-0"
      viewBox="0 0 16 16"
      fill="currentColor"
    >
      <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539a7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539a7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
      <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v1.384l7.614 2.03a1.5 1.5 0 0 0 .772 0L16 5.884V4.5A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5" />
      <path d="M0 12.5A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5V6.85L8.129 8.947a.5.5 0 0 1-.258 0L0 6.85z" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
      <path d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.825a2 2 0 0 1-1.991-1.819l-.637-7a2 2 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3m-8.322.12q.322-.119.684-.12h5.396l-.707-.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248c-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586c.173-.431.568-.878 1.232-.878c.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252c-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59c.4.07.55-.17.55-.38c0-.19-.01-.82-.01-1.49c-2.01.37-2.53-.49-2.69-.94c-.09-.23-.48-.94-.82-1.13c-.28-.15-.68-.52-.01-.53c.63-.01 1.08.58 1.23.82c.72 1.21 1.87.87 2.33.66c.07-.52.28-.87.51-1.07c-1.78-.2-3.64-.89-3.64-3.95c0-.87.31-1.59.82-2.15c-.08-.2-.36-1.02.08-2.12c0 0 .67-.21 2.2.82c.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82c.44 1.1.16 1.92.08 2.12c.51.56.82 1.27.82 2.15c0 3.07-1.87 3.75-3.65 3.95c.29.25.54.73.54 1.48c0 1.07-.01 1.93-.01 2.2c0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
    </svg>
  );
}

function TwitterXIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
      <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07l-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className="w-4 h-4 text-cyan-400 shrink-0"
    >
      <path
        fill="currentColor"
        d="m21 15.46l-5.27-.61l-2.52 2.52a15.05 15.05 0 0 1-6.59-6.59l2.53-2.53L8.54 3H3.03C2.45 13.18 10.82 21.55 21 20.97z"
      />
    </svg>
  );
}
