import { faGithubAlt } from "@fortawesome/free-brands-svg-icons";
import FaWrapper from "@/components/ui/FaWrapper";

interface AssistantAvatarProps {
  showStatus?: boolean;
}

export default function AssistantAvatar({ showStatus }: AssistantAvatarProps) {
  return (
    <div className="relative">
      <div className="flex size-9 items-center justify-center rounded-full bg-app-main">
        <FaWrapper icon={faGithubAlt} size={20} />
      </div>

      {showStatus && (
        <span className="absolute -right-0.5 -bottom-0.5 flex size-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-300 opacity-75"></span>
          <span className="inline-flex size-3 rounded-full border border-app-background bg-green-400"></span>
        </span>
      )}
    </div>
  );
}
