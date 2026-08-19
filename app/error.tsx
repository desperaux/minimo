"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <main className="state-page"><div className="state-card"><div className="state-code">!</div><h1>We couldn’t complete that</h1><p className="subtle">Your saved work is safe. Try again, or return to your workspace.</p><div className="state-actions"><button className="button primary" onClick={() => reset()}>Try again</button><Link className="button secondary" href="/">Back to home</Link></div></div></main>;
}
