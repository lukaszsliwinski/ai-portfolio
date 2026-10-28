import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

export const LINKS = [
  { icon: faGithub, href: "https://github.com/lukaszsliwinski", title: "GitHub Profile" },
  { icon: faLinkedin, href: "https://www.linkedin.com/in/lsliwinski", title: "LinkedIn Profile" },
];

export const TECHNOLOGIES = [
  { name: "TypeScript", src: "/icons/typescript.png" },
  { name: "React", src: "/icons/react.png" },
  { name: "Next.js", src: "/icons/next.png" },
  { name: "TailwindCSS", src: "/icons/tailwind.png" },
  { name: "Animations", src: "/icons/motion.png" },
  { name: "Node.js", src: "/icons/node.png" },
  { name: "Python", src: "/icons/python.png" },
  { name: "Docker", src: "/icons/docker.png" },
  { name: "MySQL", src: "/icons/mysql.png" },
  { name: "MongoDB", src: "/icons/mongo.png" },
  { name: "AI Web Dev", src: "/icons/aiweb.png" },
];

export const LANDING_TEXT =
  "Hi! I build web apps professionally, mostly on the frontend but also on the backend and with databases. Before that, I worked as a mechanical engineer and learned to code on my own. Beyond web development, I spend my free time learning Python, machine learning and data analysis.";


export const DEFAULT_WELCOME_MESSAGE = {
  id: "welcome-msg",
  role: "assistant" as const,
  content:
    "Hi! I'm an AI assistant answering on Łukasz's behalf. Ask me about how I work, what I'm learning, my projects or how I use AI day to day.\n\nWhat would you like to know?",
};

export const CHAT_TEXT =
  "This assistant is a complete product I built on my own from scratch with the help of an AI coding agent, from the first line of code to deployment. My goal was to learn how to work with such a tool and to understand its limitations and risks. I wrote the app in Next.js and TypeScript and deployed it myself with Docker on my own VPS, while Google Gemini generates the answers based on my materials. Due to API limits, each IP address can send up to 10 messages per hour.";

export const CHAT_PRIVACY_NOTE =
  "Conversations are stored for 90 days and processed by Google Gemini, and Google may use them to improve its services. Please don't share personal data.";

export const SUGGESTED_QUESTIONS = [
  "What do you bring to a frontend team?",
  "Tell me about a project of your choice.",
  "What are you learning right now?",
  "How do you use AI in your daily work?",
];

export const PROJECTS = [
  {
    name: "Project 1",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letrasets Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged.",
    codeLink: "https://github-link-1",
    liveLink: "https://page-link-1",
    screenSrc: "/images/placeholder.png",
  },
  {
    name: "Project 2",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letrasets Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged.",
    codeLink: "https://github-link-2",
    liveLink: "https://page-link-2",
    screenSrc: "/images/placeholder.png",
  },
  {
    name: "Project 3",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letrasets Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged.",
    codeLink: "https://github-link-3",
    liveLink: "https://page-link-3",
    screenSrc: "/images/placeholder.png",
  },
];



export const PRIVACY_LINK_LABEL = "Learn more";

export const PRIVACY_POLICY = {
  title: "Privacy policy",
  sections: [
    {
      heading: "Who is responsible",
      paragraphs: [
        "Łukasz Śliwiński, lukaszsliwinski0@gmail.com.",
      ],
    },
    {
      heading: "What is collected",
      paragraphs: [
        "Only the data below, based on my legitimate interest (Art. 6(1)(f) GDPR). This site uses no cookies and no analytics.",
      ],
      items: [
        {
          label: "Chat conversations",
          text: "your questions, the answers and the time they were sent. They are used to run the assistant and to improve it. Please don't share personal data in the chat.",
        },
        {
          label: "IP address",
          text: "used only to limit the number of messages. It is kept in server memory for up to one hour and is never stored in logs.",
        },
      ],
    },
    {
      heading: "Who receives the data",
      items: [
        {
          label: "Google (Gemini API)",
          text: "generates the answers. The free tier is used, so Google may use conversations to improve its services. Data may be processed outside the EU.",
        },
        {
          label: "OVH",
          text: "hosts the site on a server in Poland.",
        },
      ],
    },
    {
      heading: "How long it is kept",
      paragraphs: [
        "Conversation logs are deleted automatically after 90 days.",
      ],
    },
    {
      heading: "Your rights",
      paragraphs: [
        "Conversations aren't linked to anyone, so I can't verify who wrote them or send copies. If you email me the approximate time and content of a conversation, I'll delete it. You can also file a complaint with the Polish data protection authority (UODO).",
      ],
    },
  ],
};
