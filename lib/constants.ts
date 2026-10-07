// Przechowuje statyczne dane interfejsu portfolio, w tym linki, technologie, treści chatu i projekty.
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';


export const LINKS = [
  { icon: faGithub, href: 'https://github.com', title: 'GitHub Profile' },
  { icon: faLinkedin, href: 'https://linkedin.com', title: 'LinkedIn Profile' },
];


export const TECHNOLOGIES = [
  { name: 'TypeScript', src: '/icons/typescript.png' },
  { name: 'React', src: '/icons/react.png' },
  { name: 'Next.js', src: '/icons/next.png' },
  { name: 'TailwindCSS', src: '/icons/tailwind.png' },
  { name: 'Animations', src: '/icons/motion.png' },
  { name: 'Node.js', src: '/icons/node.png' },
  { name: 'Python', src: '/icons/python.png' },
  { name: 'Docker', src: '/icons/docker.png' },
  { name: 'MySQL', src: '/icons/mysql.png' },
  { name: 'MongoDB', src: '/icons/mongo.png' },
  { name: 'AI Web Dev', src: '/icons/aiweb.png' },
];


export const SUGGESTED_QUESTIONS = [
  'What is your main frontend stack?',
  'What kind of projects have you built?',
  'What are your strongest skills?',
  'How would you summarize your experience?',
];


export const DEFAULT_WELCOME_MESSAGE = {
  id: "welcome-msg",
  role: "assistant" as const,
  content:
    "Hi, I'm Łukasz's AI portfolio assistant! I speak in the first person on behalf of the developer. You can ask me questions about skills, work experience, projects, or interests.\n\nWhat would you like to know?",
};


export const LANDING_TEXT = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letrasets Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged.'


export const CHAT_TEXT = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letrasets Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged. <b>!opis projektu tutaj, inf. o vibe coding użytym przy chacie! + Info: 10req / IP / 1hour</b>'


export const PROJECTS = [
  {
    name: 'Project 1',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letrasets Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged.',
    codeLink: 'https://github-link-1',
    liveLink: 'https://page-link-1',
    screenSrc: '/images/placeholder.png',
  },
  {
    name: 'Project 2',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letrasets Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged.',
    codeLink: 'https://github-link-2',
    liveLink: 'https://page-link-2',
    screenSrc: '/images/placeholder.png',
  },
  {
    name: 'Project 3',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letrasets Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged.',
    codeLink: 'https://github-link-3',
    liveLink: 'https://page-link-3',
    screenSrc: '/images/placeholder.png',
  },
];
