import { isValidStatus } from "@/lib/constants";
import { deleteTask } from "@/lib/services/tasks/delete-task";
import { updateTask } from "@/lib/services/tasks/update-task";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!id || isNaN(Number(id))) {
      return Response.json(
        {
          success: false,
          message: "Invalid task ID",
        },
        { status: 400 },
      );
    }

    const body = await request.json();

    const { title, description, status } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return Response.json(
        {
          success: false,
          message: "Title is required",
        },
        { status: 400 },
      );
    }

    if (!status || typeof status !== "string" || !isValidStatus(status)) {
      return Response.json(
        {
          success: false,
          message: "Invalid status",
        },
        { status: 400 },
      );
    }

    const task = await updateTask(id, {
      title,
      description,
      status,
    });

    if (!task) {
      return Response.json(
        {
          success: false,
          message: "Task not found",
        },
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    console.error("PUT /api/tasks/[id] error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to update task",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!id || isNaN(Number(id))) {
      return Response.json(
        {
          success: false,
          message: "Invalid task ID",
        },
        { status: 400 },
      );
    }

    const task = await deleteTask(id);

    if (!task) {
      return Response.json(
        {
          success: false,
          message: "Task not found",
        },
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/tasks/[id] error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to delete task",
      },
      { status: 500 },
    );
  }
}
