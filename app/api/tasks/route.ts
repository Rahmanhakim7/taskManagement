import { createTask } from "@/lib/services/tasks/create-task";
import { getTasks } from "@/lib/services/tasks/get-tasks";
import { isValidStatus, type TaskStatus } from "@/lib/constants";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const statusParam = searchParams.get("status");
    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const limit = Math.min(
      Math.max(Number(searchParams.get("limit")) || 10, 1),
      100,
    );
    if (statusParam && !isValidStatus(statusParam)) {
      return Response.json(
        {
          success: false,
          message: "Invalid status",
        },
        { status: 400 },
      );
    }
    const status: TaskStatus | undefined =
      statusParam && isValidStatus(statusParam) ? statusParam : undefined;
    const result = await getTasks({
      search,
      status,
      page,
      limit,
    });
    return Response.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("GET /api/tasks error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch tasks",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, status: statusParam } = body;
    if (!title || typeof title !== "string" || !title.trim()) {
      return Response.json(
        {
          success: false,
          message: "Title is required",
        },
        { status: 400 },
      );
    }
    if (
      statusParam !== undefined &&
      (typeof statusParam !== "string" || !isValidStatus(statusParam))
    ) {
      return Response.json(
        {
          success: false,
          message: "Invalid status",
        },
        { status: 400 },
      );
    }
    const status: TaskStatus =
      typeof statusParam === "string" && isValidStatus(statusParam)
        ? statusParam
        : "new";

    const task = await createTask({
      title,
      description,
      status,
    });

    return Response.json(
      {
        success: true,
        message: "Task created successfully",
        data: task,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/tasks error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to create task",
      },
      { status: 500 },
    );
  }
}
