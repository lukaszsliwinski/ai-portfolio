import Link from "next/link";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import FaWrapper from "./FaWrapper";

interface ButtonAnchorProps {
  label: string;
  href: string;
  icon?: IconProp
}

export default function ButtonAnchor({ label, href, icon }: ButtonAnchorProps) {
  return (
    <Link
      href={href}
      key={label}
      className="group flex items-center justify-center min-w-35 min-h-10 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-50 bg-zinc-900/40 hover:bg-zinc-900/80 text-zinc-300 hover:text-main border border-zinc-800/60 hover:border-zinc-800 active:opacity-90 cursor-pointer"
    >
      {icon && <FaWrapper icon={icon} size={16} className="mr-1.5 mb-px" />}
      <span className="">{label}</span>
    </Link>
  );
}