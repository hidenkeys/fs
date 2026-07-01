"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type ShareButtonProps = {
  url: string;
  children: React.ReactNode;
};

export function ShareButton({ url, children }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <Button onClick={handleCopy}>
      {children}
      <span className="sr-only">{url}</span>
      {copied ? <span className="ml-1 text-xs text-gold">Copied</span> : null}
    </Button>
  );
}
