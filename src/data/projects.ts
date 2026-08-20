export type Project = {
  title: string;
  shortDesc: string;
  description: string;
  longDescription: string;
  tags: string[];
  techStack: { category: string; tools: string[] }[];
  github?: string;
  live?: string;
  apk?: string;
  images: string[];
  thumbnail: string;
  featured?: boolean;
  status: "Live" | "In Development" | "Completed";
  year: string;
};

export const projects: Project[] = [
  {
    title: "GetFit AI",
    shortDesc: "Full-stack fitness coaching platform with live video, payments & real-time data.",
    description:
      "Full-stack fitness coaching platform: React web dashboard, Flutter mobile apps for trainers & clients, real-time video calls via Agora RTC, and a shared Supabase backend.",
    longDescription:
      "GetFit AI is a production-grade fitness and wellness platform connecting users with professional trainers. The system comprises two Flutter mobile apps (user-side and trainer-side), a React web dashboard for trainer management, and a Node.js/Express API layer on top of Supabase. Users can browse trainer profiles, book appointments, make Stripe payments, join live video calls via Agora RTC, receive Firebase push notifications even on locked/killed devices via CallKit, and track workout history. Trainers manage their schedules, conduct live sessions, post yoga classes, and issue weekly challenges through their dedicated app.",
    tags: ["Flutter", "React", "Node.js", "Supabase", "Agora RTC"],
    techStack: [
      { category: "Mobile", tools: ["Flutter", "Dart", "Agora RTC", "Firebase FCM", "CallKit", "Stripe"] },
      { category: "Web", tools: ["React", "Next.js", "Tailwind CSS"] },
      { category: "Backend", tools: ["Node.js", "Express", "Supabase", "PostgreSQL"] },
      { category: "DevOps", tools: ["Vercel", "Railway", "EAS Build"] },
    ],
    github: "https://github.com/AAbdullahRajput/Get-Fit-Ai-Web-Trainer-Website-And-Mobile-Application-",
    live: "https://getfitai-ashen.vercel.app/",
    apk: "https://github.com/AAbdullahRajput/Get-Fit-Mobile-Application-User-/releases",
    images: [
      "https://raw.githubusercontent.com/AAbdullahRajput/Get-Fit-Mobile-Application-User-/main/Project%20Design/1.png",
      "https://raw.githubusercontent.com/AAbdullahRajput/Get-Fit-Mobile-Application-User-/main/Project%20Design/2.png",
      "https://raw.githubusercontent.com/AAbdullahRajput/Get-Fit-Mobile-Application-User-/main/Project%20Design/3.png",
    ],
    thumbnail: "https://raw.githubusercontent.com/AAbdullahRajput/Get-Fit-Mobile-Application-User-/main/Project%20Design/1.png",
    featured: true,
    status: "Live",
    year: "2025",
  },
  {
    title: "Golazo — FIFA World Cup 2026",
    shortDesc: "Live World Cup prediction app on Google Play with real-time scores & brackets.",
    description:
      "React Native app for predicting World Cup match outcomes with live scores, group stages, knockout brackets, and all 48 squads. Live on Google Play.",
    longDescription:
      "Golazo is a React Native / Expo app built and shipped to Google Play under Mehdi Technologies. Users predict match outcomes across the full FIFA World Cup 2026 tournament — group stages, round of 32, knockout brackets, all the way to the final. Features include real-time match results, community prediction leaderboards, group point contribution flows, and full squad data for all 48 teams. State managed with Zustand, backend powered by Supabase with custom SQL for match events and player data.",
    tags: ["React Native", "Expo", "TypeScript", "Supabase", "Zustand"],
    techStack: [
      { category: "Mobile", tools: ["React Native", "Expo", "TypeScript", "Zustand"] },
      { category: "Backend", tools: ["Supabase", "PostgreSQL"] },
      { category: "DevOps", tools: ["EAS Build", "Google Play Console"] },
    ],
    github: "https://github.com/AAbdullahRajput/Fifa-World-Cup-2026-Prediction",
    images: [
      "/images/projects/golazo/1.png",
      "/images/projects/golazo/2.png",
    ],
    thumbnail: "/images/projects/golazo/thumb.png",
    featured: true,
    status: "Live",
    year: "2026",
  },
  {
    title: "ConnectHub",
    shortDesc: "Real-time social media platform with posts, follows, and four themes.",
    description:
      "Full-stack social media platform with posts, follows, likes, and real-time updates via Socket.io. React 19 frontend with a four-theme system.",
    longDescription:
      "ConnectHub is a full-stack social platform built with React 19 and Node.js/Express, deployed on Vercel (frontend) and Railway (backend) with Supabase as the database. Features include user auth, post creation, likes/unlikes, follow/unfollow, real-time feed updates via Socket.IO, and a four-theme UI switcher. Fixed like/unlike race condition bugs and resolved Socket.IO CORS issues across dual GitHub remotes during development.",
    tags: ["React 19", "Node.js", "Supabase", "Socket.io"],
    techStack: [
      { category: "Frontend", tools: ["React 19", "Tailwind CSS"] },
      { category: "Backend", tools: ["Node.js", "Express", "Socket.io", "Supabase"] },
      { category: "DevOps", tools: ["Vercel", "Railway"] },
    ],
    github: "https://github.com/AAbdullahRajput/Connect-Hub",
    images: ["/images/projects/connecthub/1.png"],
    thumbnail: "/images/projects/connecthub/thumb.png",
    status: "Completed",
    year: "2025",
  },
  {
    title: "Station Hub",
    shortDesc: "Travel booking platform with a mobile app and React admin dashboard.",
    description:
      "Travel and station booking platform with a passenger mobile app (Expo) and a React/Vite admin dashboard, backed by FastAPI and Firebase.",
    longDescription:
      "Station Hub is a travel platform where passengers discover nearby stations, view services and amenities, and book seats — all from a React Native (Expo) mobile app. A separate React/Vite admin dashboard lets operators manage stations, routes, and bookings. The backend is a FastAPI service with Firebase for auth and real-time data. The project includes a full README, GitHub release materials, and a deployed admin dashboard.",
    tags: ["React Native", "FastAPI", "Firebase", "Expo", "React/Vite"],
    techStack: [
      { category: "Mobile", tools: ["React Native", "Expo", "TypeScript"] },
      { category: "Web", tools: ["React", "Vite", "Tailwind CSS"] },
      { category: "Backend", tools: ["FastAPI", "Firebase", "Python"] },
    ],
    github: "https://github.com/AAbdullahRajput/Station-Hub-Project",
    images: ["/images/projects/stationhub/1.png"],
    thumbnail: "/images/projects/stationhub/thumb.png",
    status: "Completed",
    year: "2025",
  },
  {
    title: "Project Sync",
    shortDesc: "Kanban project management app with real-time collaboration.",
    description:
      "Trello-inspired project management app with Kanban boards, real-time collaboration, and task tracking for teams.",
    longDescription:
      "ProjectSync is a full Kanban-style web app built for the CodeAlpha virtual internship. Scaffolded and coded file-by-file in a single extended session. Features include drag-and-drop task boards, real-time collaboration via Socket.IO, JWT auth, team workspaces, and task assignment. Deployed on AWS. Stack: React/Vite frontend, Node.js/Express backend, MongoDB Atlas database.",
    tags: ["React", "Vite", "Node.js", "MongoDB", "Socket.io", "JWT"],
    techStack: [
      { category: "Frontend", tools: ["React", "Vite"] },
      { category: "Backend", tools: ["Node.js", "Express", "MongoDB Atlas", "Socket.io", "JWT"] },
      { category: "DevOps", tools: ["AWS"] },
    ],
    github: "https://github.com/AAbdullahRajput/Project-Sync",
    images: ["/images/projects/projectsync/1.png"],
    thumbnail: "/images/projects/projectsync/thumb.png",
    status: "Completed",
    year: "2025",
  },
  {
    title: "The Royal Restaurant",
    shortDesc: "Luxury restaurant website with menu, specials, and MongoDB user database.",
    description:
      "Modern responsive restaurant website built with React.js — hero banner, menu display, special dishes, about and contact sections, backed by MongoDB.",
    longDescription:
      "The Royal Restaurant Website is a React.js project presenting a luxury restaurant brand online. Built with reusable component-based architecture, it includes a hero section with an attractive banner, About Us, full Menu display, Special Dishes highlight, and Contact section. The project is fully responsive across all devices and connects to a MongoDB database for user data. Built with React.js, JavaScript ES6+, CSS3, and Vite as the build tool.",
    tags: ["React.js", "JavaScript", "CSS3", "MongoDB", "Vite"],
    techStack: [
      { category: "Frontend", tools: ["React.js", "JavaScript", "CSS3", "HTML5"] },
      { category: "Build", tools: ["Vite", "npm"] },
      { category: "Database", tools: ["MongoDB"] },
    ],
    github: "https://github.com/AAbdullahRajput/-The-Royal-Restaurant-Website-Using-React-",
    images: [
      "https://raw.githubusercontent.com/AAbdullahRajput/-The-Royal-Restaurant-Website-Using-React-/main/The%20Royal%20Website%20Videos/ChatGPT%20Image%20Feb%2024%2C%202026%2C%2010_55_24%20AM.png",
      "https://raw.githubusercontent.com/AAbdullahRajput/-The-Royal-Restaurant-Website-Using-React-/main/The%20Royal%20Website%20Videos/Screenshot%20(1088).png",
      "https://raw.githubusercontent.com/AAbdullahRajput/-The-Royal-Restaurant-Website-Using-React-/main/The%20Royal%20Website%20Videos/The%20Royals%20Video%201.mp4",
      "https://raw.githubusercontent.com/AAbdullahRajput/-The-Royal-Restaurant-Website-Using-React-/main/The%20Royal%20Website%20Videos/The%20Royals%20Video%202%20Teams.mp4",
      "https://raw.githubusercontent.com/AAbdullahRajput/-The-Royal-Restaurant-Website-Using-React-/main/The%20Royal%20Website%20Videos/The%20Royals%20Video%203%20About%20us.mp4",
      "https://raw.githubusercontent.com/AAbdullahRajput/-The-Royal-Restaurant-Website-Using-React-/main/The%20Royal%20Website%20Videos/The%20Royals%20Video%204%20Profile%20%26%20Logout.mp4",
    ],
    thumbnail: "https://raw.githubusercontent.com/AAbdullahRajput/-The-Royal-Restaurant-Website-Using-React-/main/The%20Royal%20Website%20Videos/ChatGPT%20Image%20Feb%2024%2C%202026%2C%2010_55_24%20AM.png",
    status: "Completed",
    year: "2025",
  },
  {
    title: "E-Commerce Fullstack",
    shortDesc: "Full-stack store with JWT auth, cart, admin panel — deployed on Vercel & Railway.",
    description:
      "Full-stack e-commerce app with JWT auth, product search & filtering, shopping cart, and an admin panel. Deployed on Vercel & Railway.",
    longDescription:
      "A complete e-commerce platform with a React/Vite frontend deployed on Vercel and a Node.js/Express backend on Railway, using Supabase as the database. Features include JWT authentication, product search and filtering, shopping cart, order management, and an admin panel for product/category CRUD. Mobile-responsive across all pages with Supabase table and data setup.",
    tags: ["React", "Node.js", "Supabase", "JWT", "Vite"],
    techStack: [
      { category: "Frontend", tools: ["React", "Vite", "Tailwind CSS"] },
      { category: "Backend", tools: ["Node.js", "Express", "Supabase", "JWT"] },
      { category: "DevOps", tools: ["Vercel", "Railway"] },
    ],
    github: "https://github.com/AAbdullahRajput/E-Commerce-Fullstack-Design",
    images: ["/images/projects/ecommerce/1.png"],
    thumbnail: "/images/projects/ecommerce/thumb.png",
    status: "Completed",
    year: "2025",
  },
  {
    title: "FitLife",
    shortDesc: "AI-powered cross-platform fitness app with Gemini Vision food scanning.",
    description:
      "Cross-platform AI-powered fitness app with personalized workout plans, daily nutrition tracking, real-time progress analytics, and Gemini Vision AI food scanning.",
    longDescription:
      "FitLife is a cross-platform Flutter app that delivers personalized workout plans, daily nutrition tracking, and real-time progress analytics. The standout feature is Gemini Vision AI food scanning — point your camera at any meal and get instant calorie and macro breakdowns. Built with Flutter and Dart, backed by a React.js web panel and Node.js/Supabase backend.",
    tags: ["Flutter", "Dart", "Gemini Vision AI", "React.js", "Node.js", "Supabase"],
    techStack: [
      { category: "Mobile", tools: ["Flutter", "Dart"] },
      { category: "AI", tools: ["Gemini Vision AI"] },
      { category: "Backend", tools: ["Node.js", "Supabase"] },
    ],
    github: "https://github.com/AAbdullahRajput/FitLife",
    images: ["/images/projects/fitlife/1.png"],
    thumbnail: "/images/projects/fitlife/thumb.png",
    status: "Completed",
    year: "2024",
  },
  {
    title: "Campus Entry Guide",
    shortDesc: "Smart campus app with AI face recognition attendance and GPS navigation.",
    description:
      "Flutter-based smart campus app with GPS navigation, AI face recognition attendance, class scheduling, a lost & found system, and an integrated chatbot.",
    longDescription:
      "Campus Entry Guide is a Flutter mobile app designed for smart campus management. It uses TFLite + OpenCV for AI-powered face recognition attendance, Google Maps for GPS navigation across campus, a class scheduling module, a lost & found board, and an integrated chatbot for student queries. Built as a university CS project demonstrating on-device ML inference.",
    tags: ["Flutter", "Dart", "TFLite", "OpenCV", "AI"],
    techStack: [
      { category: "Mobile", tools: ["Flutter", "Dart"] },
      { category: "AI/ML", tools: ["TFLite", "OpenCV"] },
      { category: "Maps", tools: ["Google Maps SDK"] },
      { category: "Backend", tools: ["Node.js", "Express.js", "MySQL"] },
      { category: "Integrations", tools: ["Google Maps API", "Dialogflow", "Camera API"] },
    ],
    github: "https://github.com/AAbdullahRajput/Campus_Entry_Guide",
    images: [
      "https://raw.githubusercontent.com/AAbdullahRajput/Campus_Entry_Guide/main/Campus%20Entry%20Guide%20Interface%20Images/WhatsApp%20Image%202026-03-05%20at%2002.26.28%20(1).jpeg",
      "https://raw.githubusercontent.com/AAbdullahRajput/Campus_Entry_Guide/main/Campus%20Entry%20Guide%20Interface%20Images/WhatsApp%20Image%202026-03-05%20at%2002.26.28.jpeg",
      "https://raw.githubusercontent.com/AAbdullahRajput/Campus_Entry_Guide/main/Campus%20Entry%20Guide%20Interface%20Images/WhatsApp%20Image%202026-03-05%20at%2002.26.29%20(1).jpeg",
      "https://raw.githubusercontent.com/AAbdullahRajput/Campus_Entry_Guide/main/Campus%20Entry%20Guide%20Interface%20Images/WhatsApp%20Image%202026-03-05%20at%2002.26.29%20(2).jpeg",
      "https://raw.githubusercontent.com/AAbdullahRajput/Campus_Entry_Guide/main/Campus%20Entry%20Guide%20Interface%20Images/WhatsApp%20Image%202026-03-05%20at%2002.26.29.jpeg",
      "https://raw.githubusercontent.com/AAbdullahRajput/Campus_Entry_Guide/main/Campus%20Entry%20Guide%20Interface%20Images/WhatsApp%20Image%202026-03-05%20at%2002.26.30%20(1).jpeg",
      "https://raw.githubusercontent.com/AAbdullahRajput/Campus_Entry_Guide/main/Campus%20Entry%20Guide%20Interface%20Images/WhatsApp%20Image%202026-03-05%20at%2002.26.30%20(2).jpeg",
      "https://raw.githubusercontent.com/AAbdullahRajput/Campus_Entry_Guide/main/Campus%20Entry%20Guide%20Interface%20Images/WhatsApp%20Image%202026-03-05%20at%2002.26.30.jpeg",
    ],
    thumbnail: "https://raw.githubusercontent.com/AAbdullahRajput/Campus_Entry_Guide/main/Campus%20Entry%20Guide%20Interface%20Images/ChatGPT%20Image%20Feb%2024%2C%202026%2C%2010_25_13%20AM.png",
    status: "Completed",
    year: "2024",
  },
  {
    title: "SabziDukan",
    shortDesc: "Role-based vegetable shop management with credit tracking, vendor consignment & Urdu support.",
    description:
      "Full-stack Flutter + Node.js vegetable shop management system with 5 user roles, credit tracking, vendor consignment, PDF receipts, and bilingual Urdu/English support.",
    longDescription:
      "SabziDukan is a production-grade full-stack mobile app built specifically for Pakistani vegetable shops. It supports 5 roles — Owner, Manager, Employee, Customer, and Vendor — with strict JWT + Firebase Auth and role-based access control enforced at both UI and server level. Features include a multi-item cart with parallel transaction parking, cash/credit sales with automatic outstanding balance carry-forward, due date notifications via FCM, vendor consignment stock tracking with hidden commission deduction, full/partial vendor payouts, PDF receipt generation shareable via WhatsApp, immutable audit logs for every manager action with owner notifications, and a comprehensive daily end-of-day report. Full Urdu (RTL) and English support switchable per user. Backend is Node.js + Express with MySQL. 65 screens across all roles.",
    tags: ["Flutter", "Node.js", "Firebase", "MySQL", "JWT"],
    techStack: [
      { category: "Mobile", tools: ["Flutter", "Dart"] },
      { category: "Backend", tools: ["Node.js", "Express.js", "MySQL"] },
      { category: "Auth", tools: ["Firebase Auth", "JWT", "BCrypt"] },
      { category: "Notifications", tools: ["Firebase FCM"] },
      { category: "Other", tools: ["PDF Generation", "WhatsApp Sharing", "SharedPreferences"] },
    ],
    github: "https://github.com/AAbdullahRajput/SabziDukan",
    images: [
      "https://raw.githubusercontent.com/AAbdullahRajput/SabziDukan/main/SabziDukan%20Design%20Images/Owner%20Dashboard%20Images/WhatsApp%20Image%202026-03-12%20at%2016.18.29.jpeg",
      "https://raw.githubusercontent.com/AAbdullahRajput/SabziDukan/main/SabziDukan%20Design%20Images/Owner%20Dashboard%20Images/WhatsApp%20Image%202026-03-12%20at%2016.18.31%20(1).jpeg",
      "https://raw.githubusercontent.com/AAbdullahRajput/SabziDukan/main/SabziDukan%20Design%20Images/Owner%20Dashboard%20Images/WhatsApp%20Image%202026-03-12%20at%2016.18.31%20(2).jpeg",
      "https://raw.githubusercontent.com/AAbdullahRajput/SabziDukan/main/SabziDukan%20Design%20Images/Owner%20Dashboard%20Images/WhatsApp%20Image%202026-03-12%20at%2016.18.31.jpeg",
      "https://raw.githubusercontent.com/AAbdullahRajput/SabziDukan/main/SabziDukan%20Design%20Images/Owner%20Dashboard%20Images/WhatsApp%20Image%202026-03-12%20at%2016.18.33.jpeg",
      "https://raw.githubusercontent.com/AAbdullahRajput/SabziDukan/main/SabziDukan%20Design%20Images/Owner%20Dashboard%20Images/WhatsApp%20Image%202026-03-12%20at%2016.18.34.jpeg",
      "https://raw.githubusercontent.com/AAbdullahRajput/SabziDukan/main/SabziDukan%20Design%20Images/Manager%20Dashboard%20Images/WhatsApp%20Image%202026-03-12%20at%2016.18.34%20(1).jpeg",
      "https://raw.githubusercontent.com/AAbdullahRajput/SabziDukan/main/SabziDukan%20Design%20Images/Manager%20Dashboard%20Images/WhatsApp%20Image%202026-03-12%20at%2016.18.35%20(1).jpeg",
      "https://raw.githubusercontent.com/AAbdullahRajput/SabziDukan/main/SabziDukan%20Design%20Images/Manager%20Dashboard%20Images/WhatsApp%20Image%202026-03-12%20at%2016.18.35%20(2).jpeg",
      "https://raw.githubusercontent.com/AAbdullahRajput/SabziDukan/main/SabziDukan%20Design%20Images/Manager%20Dashboard%20Images/WhatsApp%20Image%202026-03-12%20at%2016.18.35.jpeg",
      "https://raw.githubusercontent.com/AAbdullahRajput/SabziDukan/main/SabziDukan%20Design%20Images/Customer%20OR%20Customer%20AS%20Vandor%20Dashoard%20Images/WhatsApp%20Image%202026-03-12%20at%2016.18.36%20(1).jpeg",
      "https://raw.githubusercontent.com/AAbdullahRajput/SabziDukan/main/SabziDukan%20Design%20Images/Customer%20OR%20Customer%20AS%20Vandor%20Dashoard%20Images/WhatsApp%20Image%202026-03-12%20at%2016.18.36%20(2).jpeg",
      "https://raw.githubusercontent.com/AAbdullahRajput/SabziDukan/main/SabziDukan%20Design%20Images/Customer%20OR%20Customer%20AS%20Vandor%20Dashoard%20Images/WhatsApp%20Image%202026-03-12%20at%2016.18.36.jpeg",
      "https://raw.githubusercontent.com/AAbdullahRajput/SabziDukan/main/SabziDukan%20Design%20Images/Customer%20OR%20Customer%20AS%20Vandor%20Dashoard%20Images/WhatsApp%20Image%202026-03-12%20at%2016.18.37%20(1).jpeg",
      "https://raw.githubusercontent.com/AAbdullahRajput/SabziDukan/main/SabziDukan%20Design%20Images/Customer%20OR%20Customer%20AS%20Vandor%20Dashoard%20Images/WhatsApp%20Image%202026-03-12%20at%2016.18.37.jpeg",
      "https://raw.githubusercontent.com/AAbdullahRajput/SabziDukan/main/SabziDukan%20Design%20Images/Customer%20OR%20Customer%20AS%20Vandor%20Dashoard%20Images/WhatsApp%20Image%202026-03-12%20at%2016.18.38.jpeg",
      "https://raw.githubusercontent.com/AAbdullahRajput/SabziDukan/main/SabziDukan%20Design%20Images/WhatsApp%20Image%202026-03-12%20at%2016.18.29%20(1).jpeg",
      "https://raw.githubusercontent.com/AAbdullahRajput/SabziDukan/main/SabziDukan%20Design%20Images/WhatsApp%20Image%202026-03-12%20at%2016.18.29%20(2).jpeg",
    ],
    thumbnail: "https://raw.githubusercontent.com/AAbdullahRajput/SabziDukan/main/SabziDukan%20Design%20Images/sabzi_dukan_thumbnail.png",
    status: "Completed",
    year: "2024",
  },
  {
    title: "Mighty Meals",
    shortDesc: "Java restaurant management system with menu browsing, orders, and payments.",
    description: "Java-based restaurant management system for browsing menus, placing orders, and making online payments, built with Java and MySQL (JDBC).",
    longDescription: "MightyMeals is a Java-based restaurant management and food ordering system with both customer and admin modules. Customers can register, browse menus by category, add to cart, place orders, make payments, and view order history. Admins manage menu items, process orders, manage user accounts, and generate revenue reports. Order tracking flows from Pending → Preparing → Delivered with receipt generation. Built with Java Swing/JavaFX for the GUI, Core Java OOP for business logic, MySQL for the database, and JDBC for connectivity. Follows MVC design pattern.",
    tags: ["Java", "MySQL", "JDBC", "Java Swing", "JavaFX"],
    techStack: [
      { category: "GUI", tools: ["Java Swing", "JavaFX"] },
      { category: "Backend", tools: ["Core Java", "OOP", "MVC Pattern"] },
      { category: "Database", tools: ["MySQL", "JDBC"] },
    ],
    github: "https://github.com/AAbdullahRajput/Mighty-Meals",
    images: [
      "https://raw.githubusercontent.com/AAbdullahRajput/Mighty-Meals/main/Mighty%20Meals%20Interface%20Images/WhatsApp%20Image%202026-03-05%20at%2002.26.23.jpeg",
      "https://raw.githubusercontent.com/AAbdullahRajput/Mighty-Meals/main/Mighty%20Meals%20Interface%20Images/WhatsApp%20Image%202026-03-05%20at%2002.26.24%20(1).jpeg",
      "https://raw.githubusercontent.com/AAbdullahRajput/Mighty-Meals/main/Mighty%20Meals%20Interface%20Images/WhatsApp%20Image%202026-03-05%20at%2002.26.24.jpeg",
      "https://raw.githubusercontent.com/AAbdullahRajput/Mighty-Meals/main/Mighty%20Meals%20Interface%20Images/WhatsApp%20Image%202026-03-05%20at%2002.26.26.jpeg",
      "https://raw.githubusercontent.com/AAbdullahRajput/Mighty-Meals/main/Mighty%20Meals%20Interface%20Images/WhatsApp%20Image%202026-03-05%20at%2002.26.27%20(1).jpeg",
      "https://raw.githubusercontent.com/AAbdullahRajput/Mighty-Meals/main/Mighty%20Meals%20Interface%20Images/WhatsApp%20Image%202026-03-05%20at%2002.26.27.jpeg",
    ],
    thumbnail: "https://raw.githubusercontent.com/AAbdullahRajput/Mighty-Meals/main/Mighty%20Meals%20Interface%20Images/ChatGPT%20Image%20Feb%2024%2C%202026%2C%2011_59_54%20AM.png",
    status: "Completed",
    year: "2025",
  },
  {
    title: "LexiParse Tools",
    shortDesc: "Python lexical analyzer — tokenize C/C++ code, symbol tables & parse trees.",
    description:
      "A Python/Tkinter lexical analyzer that tokenizes C/C++ code, displays a symbol table, checks syntax errors, generates a mock parse tree, and supports file loading.",
    longDescription:
      "LexiParse Tools is a Python-based Lexical Analyzer GUI built with Tkinter for Compiler Construction coursework. Paste or load any C/C++ file and the tool tokenizes it into Keywords, Identifiers, Numbers, Operators, Special Characters, Strings, and Functions. The Symbol Table panel lists all identifiers with name, type, and line number. The Syntax Checker catches missing semicolons, unclosed braces, and suspicious if/else blocks. A mock Parse Tree is generated from the tokenized output using anytree. Token list can be copied to clipboard in one click. Built entirely in Python 3 with a clean colorful Tkinter/ttk interface.",
    tags: ["Python", "Tkinter", "Compiler", "Lexer", "Parser"],
    techStack: [
      { category: "Language", tools: ["Python 3"] },
      { category: "GUI", tools: ["Tkinter", "ttk"] },
      { category: "Libraries", tools: ["anytree", "pyperclip"] },
    ],
    github: "https://github.com/AAbdullahRajput/LexiParse-Tools",
    images: [
      "https://raw.githubusercontent.com/AAbdullahRajput/LexiParse-Tools/main/LexiParse%20Tools%20Images/Screenshot%202026-03-06%20191534.png",
      "https://raw.githubusercontent.com/AAbdullahRajput/LexiParse-Tools/main/LexiParse%20Tools%20Images/Screenshot%202026-03-06%20191609.png",
    ],
    thumbnail: "https://raw.githubusercontent.com/AAbdullahRajput/LexiParse-Tools/main/LexiParse%20Tools%20Images/Screenshot%202026-03-06%20191534.png",
    status: "Completed",
    year: "2025",
  },
  {
    title: "Musicfy",
    shortDesc: "Android music player with playlists, album art, and real-time seekbar controls.",
    description:
      "A modern Android music player built with Java — browse local songs, control playback, manage playlists, and view album artwork with a clean Material UI.",
    longDescription:
      "Musicfy is a sleek Android music player app built with Android Studio and Java. Users can browse all local songs from device storage, play/pause with smooth controls, skip tracks, and track progress with a real-time SeekBar. The app displays song title, artist, and album artwork, supports custom playlists, and shows a recently played section. Built with MediaPlayer API for audio playback, RecyclerView for song listing, and Room/SQLite for local database storage of playlists and history. Follows clean Material Design UI principles.",
    tags: ["Java", "Android", "MediaPlayer", "Room", "Material UI"],
    techStack: [
      { category: "Mobile", tools: ["Java", "Android Studio"] },
      { category: "Playback", tools: ["MediaPlayer API"] },
      { category: "UI", tools: ["RecyclerView", "Material Design"] },
      { category: "Database", tools: ["Room", "SQLite"] },
    ],
    github: "https://github.com/AAbdullahRajput/Musicfy",
    images: [
      "https://raw.githubusercontent.com/AAbdullahRajput/Musicfy/main/Musify%20Images/WhatsApp%20Image%202026-03-06%20at%2019.04.48%20(1).jpeg",
      "https://raw.githubusercontent.com/AAbdullahRajput/Musicfy/main/Musify%20Images/WhatsApp%20Image%202026-03-06%20at%2019.04.48.jpeg",
      "https://raw.githubusercontent.com/AAbdullahRajput/Musicfy/main/Musify%20Images/WhatsApp%20Image%202026-03-06%20at%2019.04.49.jpeg",
    ],
    thumbnail: "https://raw.githubusercontent.com/AAbdullahRajput/Musicfy/main/Musify%20Images/ChatGPT%20Image%20Feb%2024%2C%202026%2C%2012_32_14%20PM.png",
    status: "Completed",
    year: "2025",
  },
  {
    title: "Maze Game",
    shortDesc: "OpenGL maze game with coins, enemies, lives, and a scoring system.",
    description:
      "Maze navigation game built with OpenGL/GLUT — move through a grid maze collecting coins for points while avoiding enemies, with a lives and scoring system.",
    longDescription:
      "A 3D maze navigation game built from scratch using Python and OpenGL/GLUT. The player navigates a procedurally generated grid maze, collects coins for points, avoids enemies that move along set paths, and manages a lives system. Features a real-time scoring overlay, multiple difficulty levels, and smooth frame-rate-independent movement. Built as a computer graphics course project.",
    tags: ["Python", "OpenGL", "GLUT"],
    techStack: [
      { category: "Graphics", tools: ["OpenGL", "GLUT", "Python"] },
    ],
    github: "https://github.com/AAbdullahRajput/Maze-Game",
    images: [
      "https://raw.githubusercontent.com/AAbdullahRajput/Maze-Game/main/Maze%20Game%20Images/Screenshot%202026-03-06%20155603.png",
      "https://raw.githubusercontent.com/AAbdullahRajput/Maze-Game/main/Maze%20Game%20Images/Screenshot%202026-03-06%20155658.png",
      "https://raw.githubusercontent.com/AAbdullahRajput/Maze-Game/main/Maze%20Game%20Images/Screenshot%202026-03-06%20155810.png",
    ],
    thumbnail: "https://raw.githubusercontent.com/AAbdullahRajput/Maze-Game/main/Maze%20Game%20Images/Screenshot%202026-03-06%20155603.png",
    status: "Completed",
    year: "2024",
  },
];