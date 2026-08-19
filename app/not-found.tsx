import Link from "next/link";

export default function NotFound() {
  return <main className="state-page"><div className="state-card"><div className="state-code">404</div><h1>We couldn’t find that page</h1><p className="subtle">The page may have moved, or you may not have access to it.</p><Link className="button primary" href="/" style={{ marginTop: 24 }}>Back to home</Link></div></main>;
}
