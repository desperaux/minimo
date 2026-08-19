import { normalizeEmailForLookup } from "@/lib/email";

export type OnboardingInput = {
  businessName: string;
  supportEmail: string;
  paymentTermsDays: 7 | 14 | 30;
  timezone: string;
};

const MAX_BUSINESS_NAME_LENGTH = 120;
const MAX_TIMEZONE_LENGTH = 64;

export function parseOnboardingInput(value: unknown): OnboardingInput {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Onboarding input is invalid.");
  const input = value as Record<string, unknown>;
  const businessName = typeof input.businessName === "string" ? input.businessName.trim() : "";
  if (typeof input.supportEmail !== "string") throw new Error("Enter a valid support email.");
  const supportEmail = normalizeEmailForLookup(input.supportEmail);
  const timezone = typeof input.timezone === "string" ? input.timezone.trim() : "";
  const paymentTermsDays = input.paymentTermsDays;

  if (!businessName || businessName.length > MAX_BUSINESS_NAME_LENGTH) throw new Error("Enter a valid business name.");
  if (!timezone || timezone.length > MAX_TIMEZONE_LENGTH || !/^[A-Za-z0-9_+./-]+$/.test(timezone)) throw new Error("Choose a valid timezone.");
  if (paymentTermsDays !== 7 && paymentTermsDays !== 14 && paymentTermsDays !== 30) throw new Error("Choose valid payment terms.");

  return { businessName, supportEmail, paymentTermsDays, timezone };
}
