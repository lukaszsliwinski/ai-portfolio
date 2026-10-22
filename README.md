# Portfolio z asystentem AI

Portfolio frontend developera z prezentacją projektów i asystentem opartym na Google Gemini. Czat odpowiada na pytania o doświadczenie, umiejętności i realizacje autora, korzystając z lokalnej bazy wiedzy Markdown.

## Funkcje

- Odpowiedzi strumieniowe w języku pytania, z pogrubieniami i listami.
- Sugerowane pytania, historia bieżącej rozmowy i jej czyszczenie.
- Walidacja wiadomości, limity długości i liczby żądań oraz komunikaty błędów.
- Responsywny interfejs, animacje sekcji i tło 3D.

**Technologie:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Motion, Three.js, Google GenAI SDK i Vitest.

## Uruchomienie lokalne

Wymagane: Node.js 20 od wersji 20.19 lub Node.js 22 od wersji 22.12 oraz npm.

```bash
npm ci
```

Utwórz `.env` w katalogu projektu i wpisz klucz oraz nazwę dostępnego dla niego modelu Gemini:

```dotenv
GEMINI_API_KEY=twoj_klucz
LLM_MODEL=nazwa_modelu
```

```bash
npm run dev
```

Strona jest dostępna pod adresem [localhost:3000](http://localhost:3000). Klucz jest odczytywany wyłącznie na serwerze. Sam build nie wymaga konfiguracji Gemini.

## Kod i treści

`app/` zawiera stronę i endpoint `/api/chat`, `components/` — interfejs, a `chat/` — logikę asystenta. Wiedzę edytuje się w `chat/data/`, treści strony w `lib/constants.ts`, a limity w `chat/config.ts`. Zmiana limitów wymaga nowego buildu.

## Testy

```bash
npm test
npm run lint
```

30 testów sprawdza walidację, odczyt strumienia, rate limiter, provider Gemini i endpoint. Działają bez klucza API, sieci i zapisu logów. Tryb obserwacji zmian: `npm run test:watch`.

## Wdrożenie

Wieloetapowy `Dockerfile` buduje serwer standalone działający bez uprawnień administratora. Docker Compose korzysta z istniejącego Traefika i zewnętrznej sieci `web`; wymaga dodatkowo ustawień `DOMAIN`, `PORT` i `NODE_ENV` w `.env`. Rozmowy i błędy są zapisywane w `logs/`, montowanym z hosta.

Lokalny build produkcyjny: `npm run build`, a następnie `npm start`.

Szczegóły architektury i konfiguracji opisuje [dokumentacja techniczna](docs/portfolio-chatbot-implementation-guide.md).
