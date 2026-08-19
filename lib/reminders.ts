import type { InvoiceStatus } from "./invoice-state";

export type ReminderEvent = "before_due_3d" | "due_date" | "overdue_3d" | "overdue_7d";

export type ReminderSchedule = {
  event: ReminderEvent;
  date: string;
};

export type ReminderEligibilityInput = {
  dueDate: string;
  today: string;
  status: InvoiceStatus | "cancelled";
  balanceMinor: number;
  remindersEnabled: boolean;
  sentEvents?: readonly ReminderEvent[];
  lastSentAt?: Date;
  now?: Date;
};

const EVENT_OFFSETS: ReadonlyArray<readonly [ReminderEvent, number]> = [
  ["before_due_3d", -3],
  ["due_date", 0],
  ["overdue_3d", 3],
  ["overdue_7d", 7],
];
const MINIMUM_INTERVAL_MS = 72 * 60 * 60 * 1_000;

function parseDate(value: string, name: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error(`${name} must use YYYY-MM-DD format.`);
  const date = new Date(`${value}T00:00:00.000Z`);
  if (date.toISOString().slice(0, 10) !== value) throw new Error(`${name} must be a valid calendar date.`);
  return date;
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function getAutomaticReminderSchedule(dueDate: string): ReminderSchedule[] {
  const due = parseDate(dueDate, "Due date");
  return EVENT_OFFSETS.map(([event, offset]) => {
    const date = new Date(due);
    date.setUTCDate(date.getUTCDate() + offset);
    return { event, date: formatDate(date) };
  });
}

export function getNextAutomaticReminder(input: ReminderEligibilityInput): ReminderSchedule | null {
  const schedule = getAutomaticReminderSchedule(input.dueDate);
  parseDate(input.today, "Today");
  if (!Number.isSafeInteger(input.balanceMinor) || input.balanceMinor <= 0) return null;
  if (!input.remindersEnabled || input.status === "cancelled" || (input.status !== "sent" && input.status !== "delivery_failed")) return null;
  if (input.lastSentAt && (!Number.isFinite(input.lastSentAt.getTime()) || (input.now ?? new Date()).getTime() - input.lastSentAt.getTime() < MINIMUM_INTERVAL_MS)) return null;

  const sentEvents = new Set(input.sentEvents ?? []);
  return schedule.find(reminder => reminder.date <= input.today && !sentEvents.has(reminder.event)) ?? null;
}

export const AUTOMATIC_REMINDER_MINIMUM_INTERVAL_HOURS = 72;
