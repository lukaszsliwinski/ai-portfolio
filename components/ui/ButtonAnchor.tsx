import Link from "next/link";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import FaWrapper from "./FaWrapper";

interface ButtonAnchorProps {
  label: string;
  href: string;
  icon?: IconProp
}

export default function ButtonAnchor({ label, href, icon }: ButtonAnchorProps) {
  const isInternal = href.startsWith("#");

  const target = isInternal ? undefined : "_blank";
  const rel = isInternal ? undefined : "noopener noreferrer";

  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      className="group flex items-center justify-center min-w-35 min-h-10 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-50 bg-zinc-900/40 hover:bg-zinc-900/80 text-zinc-300 hover:text-main border border-zinc-800/60 hover:border-zinc-800 active:opacity-90 cursor-pointer"
    >
      {icon && <FaWrapper icon={icon} size={16} className="mr-1.5 mb-px" />}
      <span>{label}</span>
    </Link>
  );
}