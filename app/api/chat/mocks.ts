const MOCK_ANSWERS: Record<string, string> = {
  "what is your main frontend stack?":
    "My primary stack includes React (supporting v18 & v19), Next.js (App Router), TypeScript, and Tailwind CSS. I also work with modern build tooling like Turbopack, Vite, and Webpack to build high-performance user interfaces.",

  "what kind of projects have you built?":
    "I have successfully delivered several complex frontend projects, including:\n\n1. **E-Commerce Platform Redesign:** A complete Next.js rewrite achieving sub-second loads and reducing bounce rates by 22%.\n2. **Custom UI Design System:** A reusable component library built with React, TypeScript, and Storybook.\n3. **Real-Time Collaboration Board:** A multi-user interactive canvas using Socket.io and React.",

  "what are your strongest skills?":
    "My strongest area is advanced frontend engineering: building responsive and high-performance Web Apps using React & Next.js, implementing custom component design systems, optimizing Lighthouse scores (often reaching 95+), and writing type-safe code with TypeScript.",

  "how would you summarize your experience?":
    "I'm a Frontend Developer with several years of experience. I currently work as a Senior Frontend Engineer at TechSolutions Inc., leading frontend architecture. Previously, I built robust client portals at CreativeWeb Studios and AppForge.",
};

export const DEFAULT_WELCOME_MESSAGE = {
  id: "welcome-msg",
  role: "assistant" as const,
  content:
    "Hi, I'm Łukasz's AI portfolio assistant! I speak in the first person on behalf of the developer. You can ask me questions about skills, work experience, projects, or interests.\n\nWhat would you like to know?",
};

const normalizeQuery = (query: string) =>
  query.toLowerCase().replace(/[?.]/g, "");

export const getMockAnswer = (input: string): string => {
  const query = normalizeQuery(input);

  const matchedAnswer = Object.keys(MOCK_ANSWERS).find(
    (key) =>
      query.includes(normalizeQuery(key)) ||
      key.includes(query)
  );

  if (matchedAnswer) {
    return MOCK_ANSWERS[matchedAnswer];
  }

  if (
    ["salary", "contract", "available", "earning", "rate"].some((word) =>
      query.includes(word)
    )
  ) {
    return "I prefer to discuss availability, expectations, and contract details directly during a meeting or call. Please feel free to reach out to schedule a conversation!";
  }

  if (
    ["how to", "write a", "explain"].some((phrase) =>
      query.includes(phrase)
    )
  ) {
    return "I can answer questions about how I have used these technologies in my own projects, but I am not intended to serve as a general programming tutor.";
  }

  return "I don't have that information in my portfolio materials. I can answer questions about my skills, experience, interests, and projects.";
};