import pool from "@/lib/db";
import type { TaskStatus } from "@/lib/constants";

type UpdateTaskData = {
  title: string;
  description?: string | null;
  status: TaskStatus;
};

export async function updateTask(id: string, data: UpdateTaskData) {
  const result = await pool.query(
    `
    UPDATE tasks
    SET
      title = $1,
      description = $2,
      status = $3,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $4
    RETURNING
      id,
      title,
      description,
      status,
      created_at,
      updated_at
    `,
    [data.title.trim(), data.description?.trim() || null, data.status, id],
  );

  return result.rows[0] || null;
}
