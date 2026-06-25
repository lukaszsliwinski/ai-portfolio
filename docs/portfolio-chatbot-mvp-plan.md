# Portfolio Chatbot MVP Plan

## Purpose

This document describes the MVP scope and product decisions for a portfolio chatbot built into a frontend developer portfolio website.

The goal is not to create a general-purpose chatbot. The goal is to build a focused, controlled, recruiter-friendly assistant that answers questions about the developer's skills, experience, interests, and completed projects.

The chatbot should demonstrate practical frontend engineering skills, good UX thinking, responsible use of LLMs, and clear control over model scope.

## Product concept

The portfolio page will have two major sections:

1. **Interactive portfolio assistant** — a chatbot that answers questions about the developer.
2. **Project showcase** — a coded, non-chat section presenting completed projects.

This MVP focuses only on the first section: the chatbot.

## Target user

The primary user is a recruiter or hiring team member reviewing the developer's portfolio.

The chatbot should help them quickly answer questions such as:

- What is the developer's main frontend stack?
- What kind of experience does the developer have?
- What projects has the developer completed?
- What are the developer's strongest skills?
- What technologies does the developer enjoy working with?
- What are the developer's interests related to software development?

## Tone and behavior

The assistant should sound:

- professional,
- concise,
- credible,
- helpful,
- slightly sales-oriented toward recruitment,
- not overly humorous,
- not overly technical unless the question requires technical detail.

The assistant speaks in the **first person**, as if speaking on behalf of the developer.

Example:

> I focus mainly on frontend development with React, Next.js, TypeScript, and modern UI tooling.

The UI must make this clear by displaying the note:

> AI assistant speaking on behalf of the developer.

## Language policy

The interface text should be in English.

The assistant should answer in the language used by the user. If the language is unclear, the assistant should ask in English which language the user prefers.

Example fallback:

> Which language would you prefer me to use?

## Scope of knowledge

The chatbot should answer only questions related to the developer, specifically:

- skills,
- experience,
- interests,
- completed projects.

The chatbot should not behave like a general ChatGPT-style assistant.

If the user asks a general technical question, the chatbot should redirect the answer back to the developer's experience.

Example:

> I can answer questions about how I have used React in my own projects, but I am not intended to be a general React tutor.

## MVP knowledge source

The MVP should not use a database.

Knowledge should be stored in repository files, using Markdown and JSON.

Recommended structure:

```txt
content/
  profile.md
  experience.md
  skills.md
  projects.md
  interests.md
  recruiter-faq.md
  meta.json
```

Markdown files should contain human-editable descriptions.

JSON should be used only for structured metadata that may be useful for the UI or content loading.

The data is expected to change rarely. Updates can happen through normal code changes and redeployment.

## Database decision

No application database is required for the MVP.

The MVP should not store chat conversations, user identities, recruiter data, analytics, or content in a database.

A lightweight technical store may be used only if needed for rate limiting. For example, Redis can be introduced as an implementation detail, but it is not part of the chatbot knowledge model.

## LLM strategy

The initial implementation should use the cheapest practical cloud LLM option available at implementation time, preferably one with a free tier.

The project should be designed so that the LLM provider can be replaced later without rewriting the whole application.

Recommended architectural direction:

```txt
Chat UI -> /api/chat -> LLM adapter -> selected provider
```

The LLM provider should be isolated behind a small server-side abstraction.

The MVP should not run a local model on the VPS, because the VPS is intended for hosting web applications and is not expected to have enough resources for a good local LLM experience.

## UI direction

The chatbot should be the main hero section of the portfolio page.

The MVP UI should include:

- a visually attractive hero section,
- a classic chat window,
- animated assistant/avatar element,
- suggested starter questions,
- message streaming effect,
- markdown rendering for assistant responses,
- session-only conversation history,
- clear chat/reset action,
- a note that the assistant speaks on behalf of the developer.

The UI should use the free package of Lightswind UI where practical.

The UI should be polished, but the MVP should avoid overbuilding interactions that do not directly support recruitment use.

## Streaming responses

The assistant should stream responses token by token if the selected provider and integration support it.

This improves perceived performance and makes the chatbot feel more responsive.

## Markdown responses

Assistant responses may use markdown for:

- short lists,
- bold emphasis,
- simple paragraphs,
- readable formatting.

Raw HTML from the model should not be rendered.

Markdown rendering must be configured safely.

## Security and abuse protection

The chatbot is public and should not require login.

This is intentional: recruiters should be able to use it immediately without friction.

The MVP should still include basic protections:

- rate limiting,
- input validation,
- maximum message length,
- maximum conversation length sent to the model,
- controlled assistant scope,
- protection against prompt-injection-style requests,
- clear fallback when the assistant lacks information,
- server-side API key usage only,
- no API keys exposed to the browser.

The implementation should assume that users may try to force the assistant to ignore instructions, reveal internal behavior, or answer unrelated questions.

## Out-of-scope for MVP

The following features are intentionally excluded from the MVP:

- user accounts,
- login,
- recruiter dashboard,
- analytics of recruiter questions,
- database-backed content management,
- admin panel,
- job-offer matching,
- salary or contract discussion,
- availability discussion,
- technical/recruiter mode toggle,
- password-protected technical mode,
- local LLM hosting,
- full RAG with vector database,
- persistent chat history.

## Handling questions about salary, availability, or contract terms

The MVP should not answer specific questions about salary, contract type, or availability unless these are later added to the knowledge files.

For now, the assistant should respond with a short contact-oriented fallback.

Example direction:

> I prefer to discuss availability, expectations, and contract details directly during a meeting or call.

The exact wording can be refined during implementation.

## Future scope

The following improvements are good candidates for later versions:

1. **Technical mode**  
   A more detailed mode for technical interview stages. It may explain architectural choices, implementation details, trade-offs, and project-specific decisions.

2. **Question analytics**  
   Anonymous logging of recruiter questions to learn what information visitors are looking for.

3. **Better knowledge retrieval**  
   If content grows, introduce chunking, embeddings, or a lightweight RAG approach.

4. **Database-backed content**  
   Add a CMS or database only if content needs to be edited without deployments.

5. **Project section integration**  
   Allow the chatbot to reference the project showcase section more directly once the second portfolio block is implemented.

6. **Feedback controls**  
   Add “Was this helpful?” feedback after responses.

7. **Provider upgrade**  
   Replace the initial low-cost/free model with a stronger model if quality becomes more important than cost.

## What this project should demonstrate

This project should demonstrate that the developer can:

- build a modern Next.js application,
- create a polished interactive UI,
- integrate an LLM into a real product flow,
- constrain model behavior to a clear domain,
- design a recruiter-friendly experience,
- think about security and abuse prevention,
- ship a Dockerized application to a VPS,
- keep MVP scope under control,
- document product and technical decisions clearly.

## MVP success criteria

The MVP is successful when:

- the portfolio opens with a polished chatbot hero section,
- the recruiter can ask questions without logging in,
- the assistant answers using only the developer knowledge files,
- the assistant refuses or redirects unrelated questions gracefully,
- responses are concise and professional,
- streaming works or degrades gracefully,
- markdown responses render safely,
- the chat can be reset,
- rate limiting and validation protect the API,
- the application can be built and run in Docker,
- future improvements are clearly separated from MVP scope.
