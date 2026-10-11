import { Sparkles } from "lucide-react";
import { BrandMark } from "../../../components/BrandMark";

export function AuthStory() {
  return (
    <section className="auth-story">
      <div className="brand brand-light">
        <BrandMark iconSize={21} />
      </div>
      <div className="auth-story-copy">
        <span className="eyebrow"><Sparkles size={14} /> YOUR SALES WORKSPACE</span>
        <h1>Every relationship starts with a <span>lead.</span></h1>
        <p>Bring your pipeline into focus. Organize prospects, build momentum, and turn opportunities into lasting customer relationships.</p>
        <div className="story-metrics">
          <div><strong>01</strong><span>Capture</span></div>
          <div className="metric-divider" />
          <div><strong>02</strong><span>Qualify</span></div>
          <div className="metric-divider" />
          <div><strong>03</strong><span>Convert</span></div>
        </div>
      </div>
      <div className="auth-story-footer">A clearer view of every opportunity.</div>
    </section>
  );
}
