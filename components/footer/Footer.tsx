import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const yearDisplay = currentYear > 2026 ? `2026-${currentYear}` : "2026";

  return (
    <footer className="w-full border-t border-app-mid-dark bg-app-background/70 py-6 backdrop-blur-md">
      <div className="flex items-center justify-center gap-3 text-xs">
        <p>© {yearDisplay} Łukasz Śliwiński</p>
        <span aria-hidden="true">·</span>
        <Link href="/privacy" className="transition-colors hover:text-app-main">
          Privacy policy
        </Link>
      </div>
    </footer>
  );
}
