import Link from "next/link";
import { notFound } from "next/navigation";

const documents: Record<string, { title: string; summary: string }> = {
  terms: { title: "Terms of Service", summary: "The agreement governing use of Junvo." },
  privacy: { title: "Privacy Policy", summary: "How Junvo expects to collect, use, retain, and protect information." },
  cookies: { title: "Cookie Notice", summary: "How essential and optional browser storage would be disclosed." },
  "acceptable-use": { title: "Acceptable Use Policy", summary: "Rules for responsible invoice and email use." },
  subprocessors: { title: "Subprocessors", summary: "The service providers Junvo may use to operate the product." },
};

export default async function LegalDocumentPage({ params }: { params: Promise<{ document: string }> }) {
  const { document } = await params;
  const content = documents[document];
  if (!content) notFound();
  return <main className="legal-page"><header className="public-header"><Link className="wordmark" href="/marketing"><span className="wordmark-mark" />Junvo</Link><Link className="subtle" href="/marketing">Back to Junvo</Link></header><article className="legal-card"><span className="draft-label">DRAFT · PENDING REVIEW</span><h1>{content.title}</h1><p className="subtle legal-summary">{content.summary}</p><div className="legal-notice"><strong>This document is not final.</strong><span>It is a product placeholder for review by the authorized business representative and qualified legal counsel before any public launch.</span></div><h2>What this document will cover</h2><p className="subtle">The finalized version will describe Junvo’s actual operating structure, data practices, vendors, retention periods, payment disclosures, support process, and user responsibilities. It will not promise protections or compliance commitments that have not been verified.</p><h2>Launch status</h2><ul><li>Operating entity and contracting representative: pending</li><li>Vendors and hosting regions: pending final decisions</li><li>Retention and deletion schedule: pending qualified review</li><li>Effective date and version history: pending approval</li></ul><Link className="button secondary" href="/marketing">Return to Junvo</Link></article></main>;
}
