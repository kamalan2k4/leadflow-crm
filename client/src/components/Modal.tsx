import type { ReactNode } from "react";
import { X } from "lucide-react";

type ModalProps = {
  titleId: string;
  eyebrow: string;
  title: string;
  description: string;
  onClose: () => void;
  className?: string;
  children: ReactNode;
};

export function Modal({
  titleId,
  eyebrow,
  title,
  description,
  onClose,
  className,
  children,
}: ModalProps) {
  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className={className ? `lead-modal ${className}` : "lead-modal"} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="modal-heading">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h2 id={titleId}>{title}</h2>
            <p>{description}</p>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={19} /></button>
        </div>
        {children}
      </section>
    </div>
  );
}
