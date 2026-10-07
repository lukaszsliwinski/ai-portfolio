// Wczytuje po stronie serwera pliki Markdown tworzące bazę wiedzy o autorze portfolio.
import fs from "fs/promises";
import path from "path";
import type { KnowledgeData } from "./types";

/**
 * Loads developer knowledge files from the local filesystem.
 * This function is intended to run only on the server.
 */
export async function loadKnowledge(): Promise<KnowledgeData> {
  const contentDir = path.join(process.cwd(), "chat", "knowledge", "data");

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
