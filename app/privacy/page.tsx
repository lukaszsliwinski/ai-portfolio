import type { Metadata } from "next";
import Link from "next/link";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import NavBar from "@/components/navigation/NavBar";
import Background from "@/components/background/Background";
import Footer from "@/components/footer/Footer";
import FaWrapper from "@/components/ui/FaWrapper";
import SectionHeader from "@/components/ui/SectionHeader";
import { PRIVACY_POLICY } from "@/lib/constants";

export const metadata: Metadata = {
  title: PRIVACY_POLICY.title,
  // Nothing to gain from a legal page showing up in search results.
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex flex-1 flex-col items-center px-4 leading-relaxed">
        <Background />
        <article className="flex w-full max-w-3xl flex-col gap-8 py-16">
          <Link
            href="/"
            className="flex w-fit items-center gap-2 text-sm text-app-text transition-colors hover:text-app-main"
          >
            <FaWrapper icon={faArrowLeft} size={14} />
            Back to portfolio
          </Link>

          <SectionHeader main={PRIVACY_POLICY.title} />

          {PRIVACY_POLICY.sections.map((section) => (
            <section key={section.heading} className="flex flex-col gap-3">
              <h3 className="text-lg font-semibold text-app-foreground">
                {section.heading}
              </h3>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.items && (
                <ul className="flex list-disc flex-col gap-2 pl-5">
                  {section.items.map((item) => (
                    <li key={item.text}>
                      {item.label && (
                        <strong className="font-semibold text-app-foreground">
                          {item.label}:{" "}
                        </strong>
                      )}
                      {item.text}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>
      </main>
      <Footer />
    </div>
  );
}
