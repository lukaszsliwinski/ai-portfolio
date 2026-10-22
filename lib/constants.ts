import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

export const LINKS = [
  { icon: faGithub, href: "https://github.com", title: "GitHub Profile" },
  { icon: faLinkedin, href: "https://linkedin.com", title: "LinkedIn Profile" },
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

export const SUGGESTED_QUESTIONS = [
  "What is your main frontend stack?",
  "What kind of projects have you built?",
  "What are your strongest skills?",
  "How would you summarize your experience?",
];

export const DEFAULT_WELCOME_MESSAGE = {
  id: "welcome-msg",
  role: "assistant" as const,
  content:
    "Hi, I'm Łukasz's AI portfolio assistant! I speak in the first person on behalf of the developer. You can ask me questions about skills, work experience, projects, or interests.\n\nWhat would you like to know?",
};

export const LANDING_TEXT =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letrasets Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged.";

export const CHAT_TEXT =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letrasets Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged. <b>!opis projektu tutaj, inf. o vibe coding użytym przy chacie!";

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

export const CHAT_PRIVACY_NOTE =
  "Rozmowy są zapisywane na 90 dni i przetwarzane przez Google Gemini, a Google może je wykorzystywać do ulepszania swoich usług. Nie podawaj danych osobowych.";

export const PRIVACY_LINK_LABEL = "Więcej o prywatności";

export const PRIVACY_POLICY = {
  title: "Prywatność",
  sections: [
    {
      heading: "Administrator danych",
      paragraphs: [
        "Administratorem danych jest [imię i nazwisko], kontakt: [adres e-mail].",
      ],
    },
    {
      heading: "Jakie dane przetwarzam",
      items: [
        {
          label: "Treść rozmowy z asystentem AI",
          text: "pytania, odpowiedzi i czas wysłania. Nie musisz podawać danych osobowych, żeby korzystać z czatu. Proszę, nie wpisuj ich.",
        },
        {
          label: "Adres IP",
          text: "używany wyłącznie do ograniczenia liczby wiadomości. Przechowywany tylko w pamięci serwera, najdłużej przez godzinę, i nie jest zapisywany w logach.",
        },
        {
          text: "Strona nie używa plików cookies ani narzędzi analitycznych.",
        },
      ],
    },
    {
      heading: "Cel i podstawa prawna",
      paragraphs: [
        "Dane przetwarzam w celu działania asystenta, ochrony serwisu przed nadużyciami oraz diagnozowania błędów i ulepszania odpowiedzi. Podstawą jest mój prawnie uzasadniony interes (art. 6 ust. 1 lit. f RODO).",
      ],
    },
    {
      heading: "Odbiorcy danych",
      items: [
        {
          label: "Google (Gemini API)",
          text: "treść rozmowy jest przekazywana do Google w celu wygenerowania odpowiedzi. Asystent korzysta z bezpłatnego dostępu do Gemini API. Zgodnie z warunkami Google przesłane treści mogą być wykorzystywane do ulepszania usług Google, a w tym celu mogą je czytać osoby weryfikujące. Dane mogą być przetwarzane poza Europejskim Obszarem Gospodarczym, w tym w USA, na podstawie EU-US Data Privacy Framework lub standardowych klauzul umownych. Szczegóły: Gemini API Additional Terms of Service oraz Polityka prywatności Google.",
        },
        {
          label: "Dostawca serwera",
          text: "OVH sp. z o.o. Strona działa na serwerze w Polsce.",
        },
      ],
    },
    {
      heading: "Okres przechowywania",
      paragraphs: [
        "Logi rozmów i błędów na moim serwerze są automatycznie usuwane po 90 dniach. Okres przechowywania danych przez Google określają jego warunki.",
      ],
    },
    {
      heading: "Twoje prawa",
      paragraphs: [
        "Masz prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania oraz sprzeciwu wobec przetwarzania. Przysługuje Ci też skarga do Prezesa Urzędu Ochrony Danych Osobowych. W sprawie swoich danych napisz na [adres e-mail]. Rozmowy nie są przypisane do konkretnej osoby, więc przy zgłoszeniu podaj przybliżony czas i treść rozmowy.",
      ],
    },
  ],
  disclaimer:
    "Odpowiedzi asystenta są generowane przez AI na podstawie przygotowanych przeze mnie materiałów i mogą zawierać nieścisłości. Nie podejmuję na ich podstawie zautomatyzowanych decyzji ani nie profiluję użytkowników.",
};
