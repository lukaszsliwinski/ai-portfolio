// Definiuje strukturę metadanych autora oraz komplet danych składających się na bazę wiedzy chatu.
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
