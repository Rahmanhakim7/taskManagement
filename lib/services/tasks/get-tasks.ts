import pool from "@/lib/db";
import type { TaskStatus } from "@/lib/constants";

type GetTasksParams = {
  search?: string;
  status?: TaskStatus;
  page?: number;
  limit?: number;
};

export async function getTasks({
  search,
  status,
  page = 1,
  limit = 10,
}: GetTasksParams = {}) {
  const offset = (page - 1) * limit;

  const conditions: string[] = [];
  const values: (string | number)[] = [];

  if (search) {
    values.push(`%${search}%`);

    conditions.push(`
      (
        title ILIKE $${values.length}
        OR description ILIKE $${values.length}
      )
    `);
  }

  if (status) {
    values.push(status);

    conditions.push(`status = $${values.length}`);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const countResult = await pool.query(
    `
    SELECT COUNT(*)::int AS total
    FROM tasks
    ${whereClause}
    `,
    values,
  );

  const total = countResult.rows[0].total;

  const dataValues = [...values, limit, offset];

  const result = await pool.query(
    `
    SELECT
      id,
      title,
      description,
      status,
      created_at,
      updated_at
    FROM tasks
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${dataValues.length - 1}
    OFFSET $${dataValues.length}
    `,
    dataValues,
  );

  return {
    data: result.rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
