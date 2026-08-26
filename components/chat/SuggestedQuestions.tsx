import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import FaWrapper from "@/components/ui/FaWrapper";
import { SUGGESTED_QUESTIONS } from "@/lib/constants";

interface SuggestedQuestionsProps {
  onSelectQuestion: (question: string) => void;
  isDisabled?: boolean;
  className?: string;
}

export default function SuggestedQuestions({
  onSelectQuestion,
  isDisabled = false,
  className,
}: SuggestedQuestionsProps) {
  return (
    <div className={cn("flex flex-col gap-2.5 w-full", className)}>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider px-1">
        <FaWrapper icon={faCircleQuestion} size={14} />
        <span>Suggested Questions</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {SUGGESTED_QUESTIONS.map((question, idx) => (
          <button
            key={idx}
            disabled={isDisabled}
            onClick={() => onSelectQuestion(question)}
            className="group flex items-center justify-between text-left px-4 py-2 rounded-xl text-xs font-medium leading-relaxed transition-all duration-200
            text-app-foreground bg-app-mid-dark/20 hover:bg-app-mid-dark/30 hover:text-app-main border border-app-mid-dark
            active:opacity-90 cursor-pointer
            disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}
