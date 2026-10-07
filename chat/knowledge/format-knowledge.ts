// Zamienia ustrukturyzowane dane portfolio na tekstowy kontekst Markdown przekazywany do promptu Gemini.
import type { KnowledgeData } from "./types";

/**
 * Formats structured knowledge data into a single coherent Markdown string
 * that can be appended to the LLM system prompt context.
 */
export function formatKnowledge(data: KnowledgeData): string {
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
