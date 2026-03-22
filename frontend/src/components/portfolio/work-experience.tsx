"use client";

import { Orbitron } from "next/font/google";

const EXPERIENCE_DATA = [
  {
    title: "Frontend Developer Intern",
    company: "Accesstrade",
    location: "Ho Chi Minh - Go Vap",
    period: "10/2025 – Present",
    achievements: [
      "Developed core frontend features using Next.js",
      "Managed application state using Redux",
      "Built and validated forms with React Hook Form",
      "Maintained and enhanced legacy modules using Angular",
      "Leveraged AI-assisted tools (e.g., GitHub Copilot) to accelerate development and improve code quality",
      "Collaborated with cross-functional teams to deliver user-facing features",
    ],
    tech: ["Next.js", "Redux", "React Hook Form", "Angular", "Jest"],
  },
  {
    title: "Full-Stack Developer Intern",
    company: "VNA Company",
    location: "Ho Chi Minh - Thu Duc",
    period: "10/2024 – 4/2025",
    achievements: [
      "Developed and maintained full-stack web features using Next.js and NestJS",
      "Built responsive UI with Tailwind CSS and MUI",
      "Managed server state and API integration using TanStack Query",
      "Implemented form handling and validation with React Hook Form",
      "Collaborated with backend to design and integrate RESTful APIs",
    ],
    tech: [
      "Next.js",
      "NestJS",
      "PostgreSQL",
      "Tailwind CSS",
      "MUI",
      "TanStack Query",
      "React Hook Form",
    ],
  },
];

function ChevronRightIcon() {
  return (
    <svg
      className="w-4 h-4 text-cyan-400 mr-2 mt-1 shrink-0"
      viewBox="0 0 16 16"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
      />
    </svg>
  );
}

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function WorkExperience() {
  return (
    <section id="experience" className="py-20 relative">
      {/* Section header */}
      <div className="mb-12">
        <h2
          className={`text-3xl md:text-4xl font-bold gradient-text mb-3 ${orbitron.className}`}
        >
          Work Experience
        </h2>
        <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-transparent rounded-full" />
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        {EXPERIENCE_DATA.map((exp, index) => (
          <div key={index} className="flex gap-6">
            {/* Timeline indicator */}
            <div className="relative flex flex-col items-center">
              {/* Dot */}
              <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] shrink-0 mt-1" />
              <div className="w-px flex-1 mt-2 bg-cyan-400/40" />
            </div>

            {/* Card */}
            <div className="glass-card rounded-xl p-6 flex-1 mb-6">
              {/* Header */}
              <div className="flex flex-wrap justify-between items-start mb-4 gap-2">
                <div>
                  <h3 className="text-xl font-semibold text-cyan-400">
                    {exp.title}
                  </h3>
                  <p className="text-gray-300">
                    {exp.company} — {exp.location}
                  </p>
                </div>
                <span className="text-gray-400 text-sm font-medium">
                  {exp.period}
                </span>
              </div>

              {/* Achievements */}
              <ul className="space-y-2 mb-4">
                {exp.achievements.map((item, i) => (
                  <li key={i} className="flex items-start">
                    <ChevronRightIcon />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>

              {/* Tech badges */}
              <div className="flex flex-wrap gap-2">
                {exp.tech.map((tech) => (
                  <span
                    key={tech}
                    className="glass-card px-3 py-1 rounded-full text-sm text-cyan-300 border-cyan-400/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
