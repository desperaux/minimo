"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <html lang="en"><body><main className="state-page"><div className="state-card"><div className="state-code">!</div><h1>minimo needs a restart</h1><p className="subtle">We couldn’t load the workspace. Try again or return to the public home.</p><div className="state-actions"><button className="button primary" onClick={() => reset()}>Try again</button><Link className="button secondary" href="/marketing">Back to minimo</Link></div></div></main></body></html>;
}
