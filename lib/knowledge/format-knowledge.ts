import { KnowledgeData } from "./load-knowledge";

/**
 * Formats structured knowledge data into a single coherent Markdown string
 * that can be appended to the LLM system prompt context.
 */
export function formatKnowledge(data: KnowledgeData): string {
  const { meta, profile, experience, skills, projects, interests, recruiterFaq } = data;

  return `
# DEVELOPER KNOWLEDGE BASE (FACTUAL CONTEXT)

## 1. General Profile Metadata
- **Name:** ${meta.displayName}
- **Role:** ${meta.role}
- **Location:** ${meta.location}
- **Primary Stack:** ${meta.mainStack.join(", ")}
- **Languages:** ${meta.languages.join(", ")}
- **GitHub:** ${meta.contact.github}
- **LinkedIn:** ${meta.contact.linkedin}
- **Email:** ${meta.contact.email}

## 2. Professional Summary
${profile.trim()}

## 3. Work Experience
${experience.trim()}

## 4. Skills & Technologies
${skills.trim()}

## 5. Projects
${projects.trim()}

## 6. Interests & Focus
${interests.trim()}

## 7. Recruiter FAQs & Wording Guidelines
${recruiterFaq.trim()}
`.trim();
}
