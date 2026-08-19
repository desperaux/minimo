import { describe, expect, it } from "vitest";
import { getAutomaticReminderSchedule, getNextAutomaticReminder } from "./reminders";

describe("automatic reminders", () => {
  it("creates the accepted four-event schedule", () => {
    expect(getAutomaticReminderSchedule("2026-09-10")).toEqual([
      { event: "before_due_3d", date: "2026-09-07" },
      { event: "due_date", date: "2026-09-10" },
      { event: "overdue_3d", date: "2026-09-13" },
      { event: "overdue_7d", date: "2026-09-17" },
    ]);
  });

  it("returns only the next unsent due event", () => {
    expect(getNextAutomaticReminder({
      dueDate: "2026-09-10",
      today: "2026-09-14",
      status: "sent",
      balanceMinor: 100,
      remindersEnabled: true,
      sentEvents: ["before_due_3d", "due_date"],
    })).toEqual({ event: "overdue_3d", date: "2026-09-13" });
  });

  it("enforces the 72-hour interval", () => {
    expect(getNextAutomaticReminder({
      dueDate: "2026-09-10",
      today: "2026-09-13",
      status: "sent",
      balanceMinor: 100,
      remindersEnabled: true,
      lastSentAt: new Date("2026-09-12T12:00:00.000Z"),
      now: new Date("2026-09-15T11:59:59.000Z"),
    })).toBeNull();
  });

  it("stops reminders for disabled, settled, cancelled, and zero-balance invoices", () => {
    for (const input of [
      { remindersEnabled: false },
      { status: "paid" as const },
      { status: "cancelled" as const },
      { balanceMinor: 0 },
    ]) {
      expect(getNextAutomaticReminder({ dueDate: "2026-09-10", today: "2026-09-10", status: "sent", balanceMinor: 100, remindersEnabled: true, ...input })).toBeNull();
    }
  });

  it("rejects malformed dates", () => {
    expect(() => getAutomaticReminderSchedule("2026-02-30")).toThrow("valid calendar date");
    expect(() => getNextAutomaticReminder({ dueDate: "2026-09-10", today: "09/10/2026", status: "sent", balanceMinor: 100, remindersEnabled: true })).toThrow("YYYY-MM-DD");
  });
});
