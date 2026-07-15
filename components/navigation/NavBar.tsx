import { faHexagonNodes } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

import FaWrapper from "@/components/ui/FaWrapper";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-900/50 bg-zinc-950/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 items-center justify-between max-w-7xl">
        <div
          className="flex items-center gap-2 font-bold text-zinc-50"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-main text-white">
            <FaWrapper icon={faHexagonNodes} size={18} />
          </div>

          <span className="font-extrabold tracking-tight text-lg">
            Frontend Portfolio<span className="text-main"> Website</span>.
          </span>
        </div>

        <nav className="flex items-center gap-2">
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub Profile"
            className="flex items-center justify-center rounded-xl p-2.5 text-zinc-400 transition-colors hover:text-zinc-50"
          >
            <FaWrapper icon={faGithub} size={22} />
          </Link>

          <Link
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn Profile"
            className="flex items-center justify-center rounded-xl p-2.5 text-zinc-400 transition-colors hover:text-zinc-50"
          >
            <FaWrapper icon={faLinkedin} size={22} />
          </Link>
        </nav>
      </div>
    </header>
  );
}