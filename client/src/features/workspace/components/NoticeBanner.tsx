import { Check, X } from "lucide-react";

type NoticeBannerProps = {
  message: string;
  onDismiss: () => void;
};

export function NoticeBanner({ message, onDismiss }: NoticeBannerProps) {
  return (
    <div className="success-banner"><Check size={16} /> {message}<button onClick={onDismiss} aria-label="Dismiss"><X size={15} /></button></div>
  );
}
