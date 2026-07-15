import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";

interface FaWrapperProps {
  icon: IconProp;
  size?: number;
  className?: string;
}

export default function FaWrapper({
  icon,
  size = 20,
  className = "",
}: FaWrapperProps) {
  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size, fontSize: size }}
    >
      <FontAwesomeIcon icon={icon} style={{ width: "100%", height: "100%" }} />
    </span>
  );
}
