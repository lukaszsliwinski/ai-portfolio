import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  main: string;
  sub?: string;
  subColored?: string;
  small?: boolean;
}

export default function SectionHeader({
  main,
  sub,
  subColored,
  small = false,
}: SectionHeaderProps) {
  return (
    <h2
      className={cn(
        small ? "text-2xl" : "text-3xl sm:text-4xl",
        "leading-tight font-extrabold text-app-foreground max-lg:text-center",
      )}
    >
      {main}
      {(sub || subColored) && (
        <>
          <br />
          <small className="tracking-widest">
            {sub} <span className="text-app-main">{subColored}</span>
          </small>
        </>
      )}
    </h2>
  );
}
