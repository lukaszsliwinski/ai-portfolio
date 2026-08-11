export default function Footer() {
  const currentYear = new Date().getFullYear();
  const yearDisplay = currentYear > 2026 ? `2026-${currentYear}` : "2026";
  
  return (
    <footer className="sticky absolute bottom-0 z-50 w-full border-b border-zinc-900/50 py-6 bg-zinc-950/70 backdrop-blur-md">
      <div className="flex items-center justify-center text-[13px] font-medium text-zinc-500">
        <p>© {yearDisplay} Łukasz Śliwiński</p>
      </div>
    </footer>
  );
}
