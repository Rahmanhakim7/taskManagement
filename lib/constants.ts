export const VALID_STATUSES = [
  "new",
  "in progress",
  "in testing",
  "done",
] as const;

export type TaskStatus = (typeof VALID_STATUSES)[number];

export function isValidStatus(status: string): status is TaskStatus {
  return VALID_STATUSES.includes(status as TaskStatus);
}
