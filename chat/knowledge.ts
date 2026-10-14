// Wczytuje po stronie serwera pliki Markdown tworzące bazę wiedzy o autorze portfolio.
import fs from "fs/promises";
import path from "path";

interface KnowledgeData {
  profile: string;
  experience: string;
  skills: string;
  projects: string;
  interests: string;
  recruiterFaq: string;
}

// Zamienia ustrukturyzowane dane portfolio na tekstowy kontekst Markdown przekazywany do promptu Gemini.
/**
 * Formats structured knowledge data into a single coherent Markdown string
 * that can be appended to the LLM system prompt context.
 */
function formatKnowledge(data: KnowledgeData): string {
  const {
    profile,
    experience,
    skills,
    projects,
    interests,
    recruiterFaq,
  } = data;

  return `
# DEVELOPER KNOWLEDGE BASE (FACTUAL CONTEXT)

## 1. Professional Profile
${profile.trim()}

## 2. Work Experience
${experience.trim()}

## 3. Skills & Technologies
${skills.trim()}

## 4. Projects
${projects.trim()}

## 5. Interests & Focus
${interests.trim()}

## 6. Recruiter FAQs & Wording Guidelines
${recruiterFaq.trim()}
`.trim();
}




/**
 * Loads developer knowledge files from the local filesystem.
 * This function is intended to run only on the server.
 */
async function loadKnowledge(): Promise<KnowledgeData> {
  const contentDir = path.join(process.cwd(), "chat", "data");

  try {
    const [
      profile,
      experience,
      skills,
      projects,
      interests,
      recruiterFaq,
    ] = await Promise.all([
      fs.readFile(path.join(contentDir, "profile.md"), "utf-8"),
      fs.readFile(path.join(contentDir, "experience.md"), "utf-8"),
      fs.readFile(path.join(contentDir, "skills.md"), "utf-8"),
      fs.readFile(path.join(contentDir, "projects.md"), "utf-8"),
      fs.readFile(path.join(contentDir, "interests.md"), "utf-8"),
      fs.readFile(path.join(contentDir, "recruiter-faq.md"), "utf-8"),
    ]);

    return {
      profile,
      experience,
      skills,
      projects,
      interests,
      recruiterFaq,
    };
  } catch (error) {
    console.error("Error loading knowledge content files:", error);
    throw new Error(
      "Failed to load developer knowledge files. Make sure all required files exist in the content directory.",
    );
  }
}


// Jedna funkcja do wczytywania i formatowania wiedzy, wystawiona na zewnątrz.
export async function getKnowledge(): Promise<string> {
  return formatKnowledge(await loadKnowledge());
}







