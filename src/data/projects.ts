export type Project = {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  live?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    title: "GetFit AI",
    description:
      "Full-stack fitness coaching platform: React web dashboard, Flutter mobile apps for trainers & clients, real-time video calls via Agora RTC, and a shared Supabase backend.",
    tags: ["Flutter", "React", "Node.js", "Supabase", "Agora RTC"],
    github: "https://github.com/AAbdullahRajput/Get-Fit-Ai-Web-Trainer-Website-And-Mobile-Application-",
    featured: true,
  },
  {
    title: "Golazo — FIFA World Cup 2026",
    description:
      "React Native app for predicting World Cup match outcomes with live scores, group stages, knockout brackets, and all 48 squads. Live on Google Play.",
    tags: ["React Native", "Expo", "TypeScript"],
    github: "https://github.com/AAbdullahRajput/Fifa-World-Cup-2026-Prediction",
    featured: true,
  },
  {
    title: "ConnectHub",
    description:
      "Full-stack social media platform with posts, follows, likes, and real-time updates via Socket.io. React 19 frontend with a four-theme system.",
    tags: ["React 19", "Node.js", "Supabase", "Socket.io"],
    github: "https://github.com/AAbdullahRajput/Connect-Hub",
  },
  {
    title: "Station Hub",
    description:
      "Travel and station booking platform with a passenger mobile app (Expo) and a React/Vite admin dashboard, backed by FastAPI and Firebase.",
    tags: ["React Native", "FastAPI", "Firebase"],
    github: "https://github.com/AAbdullahRajput/Station-Hub-Project",
  },
  {
    title: "Project Sync",
    description:
      "Trello-inspired project management app with Kanban boards, real-time collaboration, and task tracking for teams.",
    tags: ["MERN", "Socket.io"],
    github: "https://github.com/AAbdullahRajput/Project-Sync",
  },
  {
    title: "E-Commerce Fullstack",
    description:
      "Full-stack e-commerce app with JWT auth, product search & filtering, shopping cart, and an admin panel. Deployed on Vercel & Railway.",
    tags: ["React", "Node.js", "Supabase"],
    github: "https://github.com/AAbdullahRajput/E-Commerce-Fullstack-Design",
  },
];