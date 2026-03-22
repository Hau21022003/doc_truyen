import ConstellationCanvas from "@/components/portfolio/constellation-canvas";
import Contact from "@/components/portfolio/contact";
import Education from "@/components/portfolio/education";
import HeroSection from "@/components/portfolio/hero-section";
import PortfolioHeader from "@/components/portfolio/portfolio-header";
import SelectedProjects from "@/components/portfolio/selected-projects";
import Skills from "@/components/portfolio/skills";
import WorkExperience from "@/components/portfolio/work-experience";
import { Metadata } from "next";
import "./portfolio.css";

export const metadata: Metadata = {
  title: {
    default: "Lê Phúc Hậu - Software Developer",
    template: "Đọc Truyện",
  },
  icons: [
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/portfolio/h.svg",
    },
  ],
};
export default function PortfolioPage() {
  return (
    <div
      style={{ position: "relative", height: "100vh", background: "#0a0e1a" }}
    >
      <ConstellationCanvas />

      <div
        className="h-full flex-col flex items-center overflow-auto smooth-scroll"
        style={{
          position: "relative",
          zIndex: 1,
          color: "white" /* your content */,
        }}
      >
        <PortfolioHeader />
        <div className="w-full max-w-6xl">
          <HeroSection />
        </div>
        <div className="max-w-6xl mx-auto px-6 py-20 w-full">
          <Skills />

          <WorkExperience />

          <SelectedProjects />

          <Education />

          <Contact />
        </div>
      </div>
    </div>
  );
}
