import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import FaWrapper from "@/components/ui/FaWrapper";

interface SuggestedQuestionsProps {
  onSelectQuestion: (question: string) => void;
  className?: string;
}

const QUESTIONS = [
  "What is your main frontend stack?",
  "What kind of projects have you built?",
  "What are your strongest skills?",
  "How would you summarize your experience?"
];

export default function SuggestedQuestions({
  onSelectQuestion,
  className,
}: SuggestedQuestionsProps) {
  return (
    <div className={cn("flex flex-col gap-2.5 w-full", className)}>
      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider px-1">
        <FaWrapper icon={faCircleQuestion} size={14} />
        <span>Suggested Questions</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {QUESTIONS.map((question, idx) => (
          <button
            key={idx}
            onClick={() => onSelectQuestion(question)}
            className="group flex items-center justify-between text-left px-4 py-2 rounded-xl text-[13px] font-medium leading-relaxed transition-all duration-200
              bg-zinc-900/40 hover:bg-zinc-900/80 text-zinc-300 border border-zinc-800/60 hover:border-zinc-800 hover:text-main
              active:opacity-90 focus:outline-none cursor-pointer"
          >{question}
          </button>
        ))}
      </div>
    </div>
  );
}
