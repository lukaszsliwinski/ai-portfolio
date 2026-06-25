import fs from "fs/promises";
import path from "path";

export interface DeveloperMeta {
  displayName: string;
  role: string;
  location: string;
  mainStack: string[];
  languages: string[];
  contact: {
    email: string;
    github: string;
    linkedin: string;
  };
}

export interface KnowledgeData {
  profile: string;
  experience: string;
  skills: string;
  projects: string;
  interests: string;
  recruiterFaq: string;
  meta: DeveloperMeta;
}

/**
 * Loads developer knowledge files from the local filesystem.
 * This function is intended to run only on the server.
 */
export async function loadKnowledge(): Promise<KnowledgeData> {
  const contentDir = path.join(process.cwd(), "content");

  try {
    const [
      profile,
      experience,
      skills,
      projects,
      interests,
      recruiterFaq,
      metaRaw,
    ] = await Promise.all([
      fs.readFile(path.join(contentDir, "profile.md"), "utf-8"),
      fs.readFile(path.join(contentDir, "experience.md"), "utf-8"),
      fs.readFile(path.join(contentDir, "skills.md"), "utf-8"),
      fs.readFile(path.join(contentDir, "projects.md"), "utf-8"),
      fs.readFile(path.join(contentDir, "interests.md"), "utf-8"),
      fs.readFile(path.join(contentDir, "recruiter-faq.md"), "utf-8"),
      fs.readFile(path.join(contentDir, "meta.json"), "utf-8"),
    ]);

    const meta: DeveloperMeta = JSON.parse(metaRaw);

    return {
      profile,
      experience,
      skills,
      projects,
      interests,
      recruiterFaq,
      meta,
    };
  } catch (error) {
    console.error("Error loading knowledge content files:", error);
    throw new Error("Failed to load developer knowledge files. Make sure all required files exist in the content directory.");
  }
}
