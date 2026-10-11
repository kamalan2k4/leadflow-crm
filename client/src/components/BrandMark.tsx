import { Command } from "lucide-react";

type BrandMarkProps = {
  iconSize: number;
};

export function BrandMark({ iconSize }: BrandMarkProps) {
  return (
    <>
      <div className="brand-symbol"><Command size={iconSize} /></div>
      <span>leadflow<span className="brand-dot">.</span></span>
    </>
  );
}
