import { Plus } from "lucide-react";
import { firstName } from "../../../utils/format";

type WelcomeHeaderProps = {
  userName: string;
  onAddLead: () => void;
};

export function WelcomeHeader({ userName, onAddLead }: WelcomeHeaderProps) {
  return (
    <section className="welcome-row">
      <div>
        <div className="eyebrow page-eyebrow"><span className="live-dot" /> YOUR SALES OVERVIEW</div>
        <h1>Good to see you, {firstName(userName)} <span className="wave">✳</span></h1>
        <p>Here’s what’s happening with your pipeline today.</p>
      </div>
      <button className="primary-button" onClick={onAddLead}><Plus size={18} /> Add new lead</button>
    </section>
  );
}
