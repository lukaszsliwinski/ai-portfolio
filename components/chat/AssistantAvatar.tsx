import { faGithubAlt } from "@fortawesome/free-brands-svg-icons";
import FaWrapper from "@/components/ui/FaWrapper";

interface AssistantAvatarProps {
  showStatus?: boolean;
}

export default function AssistantAvatar({ showStatus }: AssistantAvatarProps) {
  return (
    <div className="relative">
      <div className="relative w-9 h-9 rounded-full flex items-center justify-center text-white bg-linear-to-tr from-main via-main/90 to-cyan-500">
        <FaWrapper icon={faGithubAlt} size={20} />
      </div>

      {showStatus && (
        <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-zinc-950"></span>
        </span>
      )}
    </div>
  );
}
