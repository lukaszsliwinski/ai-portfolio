// Testy logiki i API działają w Node.js, bez uruchamiania przeglądarki lub serwera Next.js.
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    alias: {
      // Oznaczenie serwerowe sprawdza build Next.js; testy korzystają z pustego modułu.
      "server-only": fileURLToPath(
        new URL("./tests/server-only.ts", import.meta.url),
      ),
    },
  },
});
