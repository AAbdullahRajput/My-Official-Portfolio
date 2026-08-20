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
  {
    title: "Station Hub App",
    description:
      "React Native (Expo) mobile app for discovering nearby travel stations and booking seats, with station details, services, and amenities based on location.",
    tags: ["React Native", "Expo", "TypeScript"],
    github: "https://github.com/AAbdullahRajput/Station-Hub",
  },
  {
    title: "FitLife",
    description:
      "Cross-platform AI-powered fitness app with personalized workout plans, daily nutrition tracking, real-time progress analytics, and Gemini Vision AI food scanning.",
    tags: ["Flutter", "Dart", "Gemini Vision AI"],
    github: "https://github.com/AAbdullahRajput/FitLife",
  },
  {
    title: "The Royals",
    description:
      "An exclusive lifestyle community website — showcase your identity, share moments, and connect with a members-only community.",
    tags: ["React"],
    github: "https://github.com/AAbdullahRajput/-The-Royal-Restaurant-Website-Using-React-",
  },
  {
    title: "SabziDukan",
    description:
      "Smart vegetable shop management system for sales, credit tracking, vendor management, and daily reporting, with multiple user roles (owner, manager, employee, customer).",
    tags: ["Flutter", "Dart"],
    github: "https://github.com/AAbdullahRajput/SabziDukan",
  },
  {
    title: "LexiParse Tools",
    description:
      "Python-based lexical analyzer GUI (Tkinter) that tokenizes C/C++ code, displays a symbol table, checks syntax errors, generates a mock parse tree, and supports file loading.",
    tags: ["Python", "Tkinter"],
    github: "https://github.com/AAbdullahRajput/LexiParse-Tools",
  },
  {
    title: "Campus Entry Guide",
    description:
      "Flutter-based smart campus app with GPS navigation, AI face recognition attendance, class scheduling, a lost & found system, and an integrated chatbot.",
    tags: ["Flutter", "Dart", "AI"],
    github: "https://github.com/AAbdullahRajput/Campus_Entry_Guide",
  },
  {
    title: "Mighty Meals",
    description:
      "Java-based restaurant management system for browsing menus, placing orders, and making online payments, built with Java and MySQL (JDBC).",
    tags: ["Java", "MySQL", "JDBC"],
    github: "https://github.com/AAbdullahRajput/Mighty-Meals",
  },
  {
    title: "Musicfy",
    description:
      "Android music player app built with Java. Browse and play songs from the device with play, pause, next, and previous controls.",
    tags: ["Java", "Android"],
    github: "https://github.com/AAbdullahRajput/Musicfy",
  },
  {
    title: "Mini Market Management System",
    description:
      "C# WinForms desktop application for managing a mini market: secure login, product and category management, seller management, and a selling/billing module.",
    tags: ["C#", "WinForms", ".NET"],
    github: "https://github.com/AAbdullahRajput/Mini-Market-Management-System",
  },
  {
    title: "Maze Game",
    description:
      "Maze navigation game built with OpenGL/GLUT — move through a grid maze collecting coins for points while avoiding enemies, with a lives and scoring system.",
    tags: ["Python", "OpenGL"],
    github: "https://github.com/AAbdullahRajput/Maze-Game",
  },
  {
    title: "Calculator App",
    description:
      "A calculator app built in Flutter.",
    tags: ["Flutter", "Dart"],
    github: "https://github.com/AAbdullahRajput/Calculator-App-In-Flutter",
  },
];