"use client";

import { Orbitron } from "next/font/google";

const PROJECTS_DATA = [
  {
    image: "/portfolio/project.png",
    title: "Online Manga/Novel Reading Platform",
    description:
      "SEO-optimized multilingual reading platform with modern UI/UX and performance optimization.",
    role: "Full-Stack Developer",
    team: "Solo Project",
    duration: "3 months",
    stack: "Next.js, NestJS, PostgreSQL",
    impact: "Improved user engagement with fast loading and responsive design",
    deploy: "Docker • Nginx • VPS",
    highlights: [
      "Built SSR/SEO-friendly frontend using Next.js",
      "Implemented i18n for multi-language support",
      "Managed server state with TanStack Query",
      "Used Zustand for lightweight client state management",
      "Designed dark/light mode and fully responsive UI",
      "Optimized backend with NestJS & TypeORM",
    ],
    tech: [
      "Next.js",
      "NestJS",
      "TypeORM",
      "PostgreSQL",
      "TanStack Query",
      "Zustand",
      "Zod",
      "React Hook Form",
      "Tailwind CSS",
      "ShadcnUI",
      "Docker",
      "Nginx",
    ],
    demoHref: "https://youtu.be/zB-_0pQDtjU",
    sourceHref: "https://github.com/Hau21022003/doc_truyen",
    websiteHref: "https://lephuchau.online",
    adminAccount: { username: "admin@example.com", password: "Abcd123!" },
  },
  {
    image: "/portfolio/project.png",
    title: "Online Clothing Store & Realtime Chat System",
    description:
      "Full-stack e-commerce platform with real-time customer chat and authentication system.",
    role: "Full-Stack Developer",
    team: "Solo Project",
    duration: "3 months",
    stack: "NestJS, Next.js, MongoDB",
    impact:
      "Enabled real-time customer interaction and seamless shopping experience",
    deploy: "Docker",
    highlights: [
      "Built RESTful APIs with JWT & Google OAuth authentication",
      "Implemented real-time chat using WebSocket",
      "Designed product, order, and user management system",
      "Integrated task scheduling for background jobs",
      "Developed responsive UI using Tailwind CSS & ShadcnUI",
    ],
    tech: [
      "NestJS",
      "Mongoose",
      "WebSocket",
      "JWT",
      "Google OAuth",
      "Next.js",
      "Tailwind CSS",
      "ShadcnUI",
      "Zod",
    ],
    demoHref: "https://www.youtube.com/watch?v=5RoDWKMq_R4",
    sourceHref: "https://github.com/Hau21022003/PHShop",
    websiteHref: "https://ph-shop-psi.vercel.app",
    adminAccount: { username: "admin@example.com", password: "Abcd123!" },
  },
  {
    image: "/portfolio/project.png",
    title: "AI Chatbot & Payment Integration Platform",
    description:
      "Chatbot platform with secure authentication and online payment integration.",
    role: "Full-Stack Developer",
    team: "Solo Project",
    duration: "2 months",
    stack: "NestJS, Next.js, PostgreSQL",
    impact:
      "Streamlined user interaction and enabled secure online transactions",
    deploy: "Docker",
    highlights: [
      "Built scalable backend using NestJS and TypeORM",
      "Implemented JWT & Google OAuth authentication",
      "Integrated VNPAY payment gateway",
      "Handled form validation using React Hook Form & Zod",
      "Designed responsive UI with Tailwind CSS & ShadcnUI",
    ],
    tech: [
      "NestJS",
      "TypeORM",
      "PostgreSQL",
      "JWT",
      "Google OAuth",
      "VNPAY",
      "Next.js",
      "Tailwind CSS",
      "React Hook Form",
      "Zod",
    ],
    demoHref: "https://youtu.be/xAmHQzhxzX8",
    sourceHref: "https://github.com/Hau21022003/chatbot",
  },
];

/* ── Icons ──────────────────────────────────────────────────────────────── */

function PersonBadgeIcon() {
  return (
    <svg
      className="w-4 h-4 text-cyan-400 mr-2 mt-0.5 shrink-0"
      viewBox="0 0 16 16"
      fill="currentColor"
    >
      <path d="M6.5 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
      <path d="M4.5 0A2.5 2.5 0 0 0 2 2.5V14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2.5A2.5 2.5 0 0 0 11.5 0zM3 2.5A1.5 1.5 0 0 1 4.5 1h7A1.5 1.5 0 0 1 13 2.5v10.795a4.2 4.2 0 0 0-.776-.492C11.392 12.387 10.063 12 8 12s-3.392.387-4.224.803a4.2 4.2 0 0 0-.776.492z" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg
      className="w-4 h-4 text-cyan-400 mr-2 mt-0.5 shrink-0"
      viewBox="0 0 16 16"
      fill="currentColor"
    >
      <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
    </svg>
  );
}

function WebsiteIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 48 48"
      className="w-4 h-4 shrink-0 text-white"
    >
      <g fill="none" stroke="currentColor" stroke-width="3">
        <path
          strokeLinejoin="round"
          d="M3 24a21 21 0 1 0 42 0a21 21 0 1 0-42 0"
        />
        <path
          strokeLinejoin="round"
          d="M15 24a9 21 0 1 1 18 0a9 21 0 1 1-18 0"
        />
        <path strokeLinecap="round" d="M4.5 31h39m-39-14h39" />
      </g>
    </svg>
  );
}

function ClockHistoryIcon() {
  return (
    <svg
      className="w-4 h-4 text-cyan-400 mr-2 mt-0.5 shrink-0"
      viewBox="0 0 16 16"
      fill="currentColor"
    >
      <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976q.576.129 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .979.654l-.615.789a7 7 0 0 0-.418-.302zm1.834 1.79a7 7 0 0 0-.653-.796l.724-.69q.406.429.747.91zm.744 1.352a7 7 0 0 0-.214-.468l.893-.45a8 8 0 0 1 .45 1.088l-.95.313a7 7 0 0 0-.179-.483m.53 2.507a7 7 0 0 0-.1-1.025l.985-.17q.1.58.116 1.17zm-.131 1.538q.05-.254.081-.51l.993.123a8 8 0 0 1-.23 1.155l-.964-.267q.069-.247.12-.501m-.952 2.379q.276-.436.486-.908l.914.405q-.24.54-.555 1.038zm-.964 1.205q.183-.183.35-.378l.758.653a8 8 0 0 1-.401.432z" />
      <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z" />
      <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5" />
    </svg>
  );
}

function StackIcon() {
  return (
    <svg
      className="w-4 h-4 text-cyan-400 mr-2 mt-0.5 shrink-0"
      viewBox="0 0 16 16"
      fill="currentColor"
    >
      <path d="m14.12 10.163 1.715.858c.22.11.22.424 0 .534L8.267 15.34a.6.6 0 0 1-.534 0L.165 11.555a.299.299 0 0 1 0-.534l1.716-.858 5.317 2.659c.505.252 1.1.252 1.604 0zM7.733.063a.6.6 0 0 1 .534 0l7.568 3.784a.3.3 0 0 1 0 .535L8.267 8.165a.6.6 0 0 1-.534 0L.165 4.382a.299.299 0 0 1 0-.535z" />
      <path d="m14.12 6.576 1.715.858c.22.11.22.424 0 .534l-7.568 3.784a.6.6 0 0 1-.534 0L.165 7.968a.299.299 0 0 1 0-.534l1.716-.858 5.317 2.659c.505.252 1.1.252 1.604 0z" />
    </svg>
  );
}

function GraphUpIcon() {
  return (
    <svg
      className="w-4 h-4 text-cyan-400 mr-2 mt-0.5 shrink-0"
      viewBox="0 0 16 16"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M0 0h1v15h15v1H0zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5"
      />
    </svg>
  );
}

function CloudCheckIcon() {
  return (
    <svg
      className="w-4 h-4 text-cyan-400 mr-2 mt-0.5 shrink-0"
      viewBox="0 0 16 16"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10.354 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708 0"
      />
      <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383m.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
    </svg>
  );
}

/* ── Project Card ────────────────────────────────────────────────────────── */

function ProjectCard({
  image,
  title,
  description,
  role,
  team,
  duration,
  stack,
  impact,
  deploy,
  highlights,
  tech,
  demoHref,
  sourceHref,
  websiteHref,
  adminAccount,
}: (typeof PROJECTS_DATA)[0]) {
  return (
    <div className="glass-card rounded-xl overflow-hidden group transition hover:shadow-[0_0_40px_rgba(34,211,238,0.15)]">
      {/* Thumbnail */}
      <div className="aspect-video overflow-hidden relative p-4 pb-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-contain rounded-lg group-hover:scale-[1.02] transition duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-cyan-400">{title}</h3>
        <p className="text-gray-400 mb-4 text-sm">{description}</p>

        {/* Meta info */}
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-start">
            <PersonBadgeIcon />
            <span className="text-gray-300">Role: {role}</span>
          </div>
          <div className="flex items-start">
            <PeopleIcon />
            <span className="text-gray-300">Team: {team}</span>
          </div>
          <div className="flex items-start">
            <ClockHistoryIcon />
            <span className="text-gray-300">Duration: {duration}</span>
          </div>
          <div className="flex items-start">
            <StackIcon />
            <span className="text-gray-300">Stack: {stack}</span>
          </div>
          <div className="flex items-start">
            <GraphUpIcon />
            <span className="text-gray-300">Impact: {impact}</span>
          </div>
          <div className="flex items-start">
            <CloudCheckIcon />
            <span className="text-gray-300">{deploy}</span>
          </div>
        </div>

        {/* Highlights */}
        <ul className="mb-4 text-sm text-gray-400 list-disc list-inside space-y-1">
          {highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>

        {/* Tech badges */}
        <div className="flex flex-wrap gap-2 mb-5">
          {tech.map((t) => (
            <span
              key={t}
              className="glass-card px-3 py-1 rounded-full text-xs text-cyan-300"
            >
              {t}
            </span>
          ))}
        </div>

        {websiteHref && (
          <div className="flex gap-2 items-center mb-4 flex-wrap">
            <WebsiteIcon />
            <a href={websiteHref} className="text-cyan-300 transition text-sm">
              {websiteHref}
            </a>
            <p className="text-sm">
              Admin Account: {adminAccount.username}, Password:{" "}
              {adminAccount.password}
            </p>
          </div>
        )}

        {/* CTA buttons */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href={demoHref}
            className="flex-1 inline-flex items-center gap-2 justify-center px-4 py-2 rounded-lg
                       bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition text-sm"
          >
            Live Demo
          </a>
          <a
            href={sourceHref}
            className="flex-1 inline-flex items-center gap-2 justify-center px-4 py-2 rounded-lg
                       border border-cyan-500/30 text-gray-300 hover:border-cyan-400 transition text-sm"
          >
            Source <GitHubIcon />
          </a>
        </div>
      </div>
    </div>
  );
}

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

/* ── Section ─────────────────────────────────────────────────────────────── */

export default function SelectedProjects() {
  return (
    <section id="projects" className="py-20 relative">
      {/* Section header */}
      <div className="mb-12">
        <h2
          className={`text-3xl md:text-4xl font-bold gradient-text mb-3 ${orbitron.className}`}
        >
          Selected Projects
        </h2>
        <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-transparent rounded-full" />
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {PROJECTS_DATA.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </section>
  );
}
