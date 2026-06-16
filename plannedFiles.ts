import type { PlannedFile } from "../types/project";

export const plannedFiles: PlannedFile[] = [
  {
    path: "src/App.tsx",
    note: "Entry composition for the assembled app",
    status: "ready",
  },
  {
    path: "src/components/layout/MainLayout.tsx",
    note: "Top level layout wrapper",
    status: "waiting",
  },
  {
    path: "src/components/sections/HeroSection.tsx",
    note: "Hero block from app.txt",
    status: "waiting",
  },
  {
    path: "src/components/sections/FeaturesSection.tsx",
    note: "Feature/content blocks",
    status: "waiting",
  },
  {
    path: "src/components/sections/FooterSection.tsx",
    note: "Footer and final CTA",
    status: "waiting",
  },
  {
    path: "src/data/content.ts",
    note: "Text/constants extracted from app.txt",
    status: "waiting",
  },
  {
    path: "src/types/content.ts",
    note: "Shared types to keep parsing safe",
    status: "waiting",
  },
];
