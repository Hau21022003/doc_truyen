"use client";
import { Orbitron } from "next/font/google";

const EDUCATION_DATA = [
  {
    degree: "Technology of Information",
    school: "Ho Chi Minh City University of Technology and Education (HCMUTE)",
    period: "2021 – 2025",
    score: "3.56 / 4",
  },
];

function MortarboardIcon() {
  return (
    <svg
      className="w-6 h-6 text-cyan-400"
      viewBox="0 0 16 16"
      fill="currentColor"
    >
      <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917z" />
      <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466z" />
    </svg>
  );
}

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function Education() {
  return (
    <section id="education" className="py-20 relative">
      {/* Section header */}
      <div className="mb-12">
        <h2
          className={`text-3xl md:text-4xl font-bold gradient-text mb-3 ${orbitron.className}`}
        >
          Education
        </h2>
        <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-transparent rounded-full" />
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-6">
        {EDUCATION_DATA.map((edu) => (
          <div key={edu.degree} className="glass-card rounded-xl p-6 relative">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
                <MortarboardIcon />
              </div>
              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start gap-2 justify-between">
                  <h3 className="text-xl font-semibold text-cyan-400">
                    {edu.degree}
                  </h3>
                  <div className={`rounded-lg shrink-0 ${orbitron.className}`}>
                    {edu.score}
                  </div>
                </div>
                <p className="text-gray-300">{edu.school}</p>
                <p className="text-gray-400 text-sm mt-1">{edu.period}</p>
              </div>

              {/* Score */}
              {/* <div
                className={`rounded-lg absolute right-6 top-6 ${orbitron.className}`}
              >
                {edu.score}
              </div> */}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
