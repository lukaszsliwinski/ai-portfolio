import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { motion } from "motion/react";
import FaWrapper from "@/components/ui/FaWrapper";
import { SUGGESTED_QUESTIONS } from "@/lib/constants";
import StaggerReveal, { childVariants } from "@/components/ui/StaggerReveal";

interface SuggestedQuestionsProps {
  onSelectQuestion: (question: string) => void;
  isDisabled: boolean;
}

export default function SuggestedQuestions({
  onSelectQuestion,
  isDisabled,
}: SuggestedQuestionsProps) {
  return (
    <div className="flex w-full flex-col gap-2.5 text-xs">
      <div className="flex items-center gap-2 px-1 font-semibold uppercase max-sm:justify-center">
        <FaWrapper icon={faCircleQuestion} size={14} />
        <span>Suggested Questions</span>
      </div>
      <StaggerReveal
        delay={0.3}
        className="grid grid-cols-1 gap-2 sm:grid-cols-2"
      >
        {SUGGESTED_QUESTIONS.map((question, idx) => (
          <motion.a
            key={idx}
            variants={childVariants}
            href="#chat-window"
            aria-disabled={isDisabled}
            onClick={(e) => {
              // aria-disabled doesn't disable a link,
              // so the jump to #chat-window is cancelled here.
              if (isDisabled) {
                e.preventDefault();
                return;
              }
              // On large screens the chat sits next to the questions,
              // so there is no need to scroll.
              if (window.innerWidth >= 1024) e.preventDefault();
              onSelectQuestion(question);
            }}
            className="mx-auto flex w-full cursor-pointer items-center rounded-md border border-app-mid-dark bg-app-mid-dark/20 px-4 py-2 text-app-foreground transition-all duration-200 hover:bg-app-mid-dark/30 hover:text-app-main active:opacity-90 aria-disabled:cursor-not-allowed aria-disabled:opacity-40 max-sm:max-w-80 max-sm:text-center"
          >
            {question}
          </motion.a>
        ))}
      </StaggerReveal>
    </div>
  );
}
