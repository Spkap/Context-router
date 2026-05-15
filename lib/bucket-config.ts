import type { Bucket } from "./types";

export const BUCKET_ORDER = [
  "x_post",
  "linkedin",
  "follow_up",
  "task",
  "investor_update",
  "private",
  "leave_out",
] as const;

export const BUCKET_CONFIG = {
  x_post: {
    label: "X Post",
    empty: "No strong X post found in today's notes.",
    accent: "sky",
  },
  linkedin: {
    label: "LinkedIn",
    empty: "No strong LinkedIn post found in today's notes.",
    accent: "indigo",
  },
  follow_up: {
    label: "Follow-ups",
    empty: "No follow-up messages found.",
    accent: "amber",
  },
  task: {
    label: "Tasks",
    empty: "No concrete tasks found.",
    accent: "emerald",
  },
  investor_update: {
    label: "Investor Update",
    empty: "No investor-safe update found.",
    accent: "violet",
  },
  private: {
    label: "Private",
    empty: "No private warnings found.",
    accent: "rose",
  },
  leave_out: {
    label: "Leave Out",
    empty: "No content left out. All notes were useful and routed.",
    accent: "zinc",
  },
} satisfies Record<
  Bucket,
  {
    label: string;
    empty: string;
    accent: string;
  }
>;

export const MODE_OPTIONS = [
  { value: "founder", label: "Founder" },
  { value: "student_builder", label: "Student Builder" },
  { value: "operator", label: "Operator" },
  { value: "creator", label: "Creator" },
] as const;
