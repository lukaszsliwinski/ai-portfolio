import { faHexagonNodes } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import FaWrapper from "@/components/ui/FaWrapper";

import { LINKS } from "@/lib/constants";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-app-mid-dark bg-app-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 items-center justify-between max-w-7xl">
        <div className="flex items-center gap-2 font-bold text-app-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-app-main">
            <FaWrapper icon={faHexagonNodes} size={18} />
          </div>

          <span className="font-extrabold tracking-tight text-lg">
            Frontend Portfolio<span className="text-app-main"> Website</span>.
          </span>
        </div>

        <nav className="flex items-center gap-2">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              title={link.title}
              className="flex items-center justify-center rounded-xl p-2.5 transition-colors hover:text-app-foreground"
            >
              <FaWrapper icon={link.icon} size={22} />
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}