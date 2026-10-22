// The knowledge base is small enough to send in full with every request,
// so there is no retrieval step.
import "server-only";
import fs from "fs/promises";
import path from "path";
import { logErrorEvent } from "./logger";

const knowledgeFiles = [
  "profile.md",
  "experience.md",
  "skills.md",
  "projects.md",
  "interests.md",
  "recruiter-faq.md",
];

export async function getKnowledge(): Promise<string> {
  const contentDir = path.join(process.cwd(), "chat", "data");

  try {
    const contents = await Promise.all(
      knowledgeFiles.map((file) =>
        fs.readFile(path.join(contentDir, file), "utf-8"),
      ),
    );

    return contents.map((content) => content.trim()).join("\n\n");
  } catch (error) {
    logErrorEvent({
      type: "knowledge_error",
      error: `Error loading knowledge content files: ${error instanceof Error ? error.message : String(error)}`,
    });
    throw new Error(
      "Failed to load developer knowledge files. Make sure all required files exist in the content directory.",
    );
  }
}
