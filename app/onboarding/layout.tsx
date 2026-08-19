import type { Metadata } from "next";

export const metadata: Metadata = { title: "Set up your Junvo workspace", robots: { index: false, follow: false } };

export default function OnboardingLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
