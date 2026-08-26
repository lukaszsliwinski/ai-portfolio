import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import FaWrapper from "@/components/ui/FaWrapper";
import { SUGGESTED_QUESTIONS } from "@/lib/constants";

interface SuggestedQuestionsProps {
  onSelectQuestion: (question: string) => void;
}

export default function SuggestedQuestions({ onSelectQuestion }: SuggestedQuestionsProps) {
  return (
    <div className="flex flex-col gap-2.5 w-full">
      <div className="flex items-center max-sm:justify-center gap-2 text-xs font-semibold uppercase tracking-wider px-1">
        <FaWrapper icon={faCircleQuestion} size={14} />
        <span>Suggested Questions</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {SUGGESTED_QUESTIONS.map((question, idx) => (
          <a
            key={idx}
            href="#chat-window"
            onClick={(e) => {
              if (window.innerWidth >= 1024) e.preventDefault();
              onSelectQuestion(question);
            }}
            className="max-sm:text-center max-sm:max-w-80 w-full mx-auto px-4 py-2 rounded-xl text-xs font-medium leading-relaxed transition-all duration-200
            text-app-foreground bg-app-mid-dark/20 hover:bg-app-mid-dark/30 hover:text-app-main border border-app-mid-dark
            active:opacity-90 cursor-pointer
            disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {question}
          </a>
        ))}
      </div>
    </div>
  );
}
