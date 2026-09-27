import pool from "@/lib/db";

export async function deleteTask(id: string) {
  const result = await pool.query(
    `
    DELETE FROM tasks
    WHERE id = $1
    RETURNING id
    `,
    [id],
  );

  return result.rows[0] || null;
}
