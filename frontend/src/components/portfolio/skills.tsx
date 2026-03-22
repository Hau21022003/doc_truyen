"use client";

import { Orbitron } from "next/font/google";
import { useEffect, useRef, useState } from "react";

const SKILLS_DATA = [
  {
    category: "Frontend",
    icon: <PaletteIcon />,
    skills: [
      { name: "React & Next.js", level: 95 },
      { name: "HTML5 & CSS3", level: 98 },
      { name: "Tailwind CSS", level: 92 },
      { name: "JavaScript/TypeScript", level: 90 },
    ],
  },
  {
    category: "Backend",
    icon: <ServerIcon />,
    skills: [
      { name: "NestJS", level: 92 },
      { name: "Node.js", level: 93 },
      { name: "REST APIs / GraphQL", level: 90 },
      { name: "Authentication (JWT, OAuth)", level: 88 },
    ],
  },
  {
    category: "DevOps & Tools",
    icon: <CloudIcon />,
    skills: [
      { name: "Docker", level: 85 },
      { name: "VPS (Ubuntu, DigitalOcean)", level: 90 },
      { name: "Nginx (Reverse Proxy, SSL)", level: 88 },
      { name: "GitHub Actions / CI-CD", level: 90 },
    ],
  },
];

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

/* ── Icons ──────────────────────────────────────────────────────────────── */

function PaletteIcon() {
  return (
    <svg
      className="w-6 h-6 text-cyan-400 mr-3 shrink-0"
      viewBox="0 0 16 16"
      fill="currentColor"
    >
      <path d="M12.433 10.07C14.133 10.585 16 11.15 16 8a8 8 0 1 0-8 8c1.996 0 1.826-1.504 1.649-3.08-.124-1.101-.252-2.237.351-2.92.465-.527 1.42-.237 2.433.07M8 5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m4.5 3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3M5 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
    </svg>
  );
}

function ServerIcon() {
  return (
    <svg
      className="w-6 h-6 text-cyan-400 mr-3 shrink-0"
      viewBox="0 0 16 16"
      fill="currentColor"
    >
      <path d="M1.333 2.667C1.333 1.194 4.318 0 8 0s6.667 1.194 6.667 2.667V4c0 1.473-2.985 2.667-6.667 2.667S1.333 5.473 1.333 4z" />
      <path d="M1.333 6.334v3C1.333 10.806 4.318 12 8 12s6.667-1.194 6.667-2.667V6.334a6.5 6.5 0 0 1-1.458.79C11.81 7.684 9.967 8 8 8s-3.809-.317-5.208-.876a6.5 6.5 0 0 1-1.458-.79z" />
      <path d="M14.667 11.668a6.5 6.5 0 0 1-1.458.789C11.81 13.016 9.966 13.333 8 13.333c-1.967 0-3.81-.317-5.208-.876a6.5 6.5 0 0 1-1.458-.79v1.666C1.333 14.806 4.318 16 8 16s6.667-1.194 6.667-2.667z" />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg
      className="w-6 h-6 text-cyan-400 mr-3 shrink-0"
      viewBox="0 0 16 16"
      fill="currentColor"
    >
      <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383" />
    </svg>
  );
}

/* ── Animated progress bar ──────────────────────────────────────────────── */

function SkillBar({ name, level }: { name: string; level: number }) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Small delay so the animation is visible
          setTimeout(() => setWidth(level), 150);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [level]);

  return (
    <div ref={ref}>
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-300">{name}</span>
        <span className="text-sm text-cyan-400">{level}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

/* ── Section ─────────────────────────────────────────────────────────────── */

export default function Skills() {
  return (
    <section id="skills" className="py-20 relative">
      {/* Section header */}
      <div className="mb-12">
        <h2
          className={`text-3xl md:text-4xl font-bold gradient-text mb-3 ${orbitron.className}`}
        >
          Skills &amp; Tech Stack
        </h2>
        <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-transparent rounded-full" />
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {SKILLS_DATA.map(({ category, icon, skills }) => (
          <div key={category} className="glass-card rounded-xl p-6">
            {/* Card header */}
            <div className="flex items-center mb-6">
              {icon}
              <h3 className="text-xl font-semibold">{category}</h3>
            </div>
            {/* Skill bars */}
            <div className="space-y-4">
              {skills.map((skill) => (
                <SkillBar key={skill.name} {...skill} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
