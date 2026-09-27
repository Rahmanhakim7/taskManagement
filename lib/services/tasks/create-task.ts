import pool from "@/lib/db";
import type { TaskStatus } from "@/lib/constants";

type CreateTaskData = {
  title: string;
  description?: string | null;
  status?: TaskStatus;
};

export async function createTask(data: CreateTaskData) {
  const result = await pool.query(
    `
    INSERT INTO tasks (
      title,
      description,
      status
    )
    VALUES ($1, $2, $3)
    RETURNING
      id,
      title,
      description,
      status,
      created_at,
      updated_at
    `,
    [data.title.trim(), data.description?.trim() || null, data.status || "new"],
  );

  return result.rows[0];
}
