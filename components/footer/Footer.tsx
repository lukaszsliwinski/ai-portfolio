import moment from "moment";

export default function Footer() {
  const currentYear = moment().year();
  const yearDisplay = currentYear > 2026 ? `2026-${currentYear}` : "2026";
  
  return (
    <footer className="w-full py-6 border-t border-zinc-900/50 bg-zinc-950">
      <div className="flex items-center justify-center text-xs font-medium text-zinc-500">
        <p>© {yearDisplay} Łukasz Śliwiński</p>
      </div>
    </footer>
  );
}
