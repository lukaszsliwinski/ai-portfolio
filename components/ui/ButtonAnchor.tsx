// Renderuje stylizowany odnośnik działający jako przycisk, z opcjonalną ikoną i obsługą linków zewnętrznych.
import Link from "next/link";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import FaWrapper from "./FaWrapper";

interface ButtonAnchorProps {
  label: string;
  href: string;
  icon?: IconProp;
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
      className="flex min-h-10 min-w-35 cursor-pointer items-center justify-center rounded-md border border-app-mid-dark bg-app-mid-dark/20 px-3 py-2 text-sm font-semibold text-app-foreground transition-all duration-50 hover:bg-app-mid-dark/30 hover:text-app-main active:opacity-90"
    >
      {icon && <FaWrapper icon={icon} size={16} className="mr-1.5 mb-px" />}
      <span>{label}</span>
    </Link>
  );
}
