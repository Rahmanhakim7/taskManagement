"use client";

import { useEffect, useState } from "react";
import {
  Search,
  ClipboardList,
  RotateCcw,
  Pencil,
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import EditTaskForm from "@/components/tasks/EditTaskForm";

type TaskStatus = "new" | "in progress" | "in testing" | "done";

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const statusConfig: Record<
  TaskStatus,
  {
    label: string;
    className: string;
  }
> = {
  new: {
    label: "Baru",
    className: "bg-slate-100 text-slate-700",
  },
  "in progress": {
    label: "Sedang Dikerjakan",
    className: "bg-amber-100 text-amber-700",
  },
  "in testing": {
    label: "Dalam Pengujian",
    className: "bg-violet-100 text-violet-700",
  },
  done: {
    label: "Selesai",
    className: "bg-emerald-100 text-emerald-700",
  },
};

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchTasks(
    currentSearch = search,
    currentStatus = status,
    page = 1,
  ) {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();
      if (currentSearch.trim()) {
        params.set("search", currentSearch.trim());
      }
      if (currentStatus !== "all") {
        params.set("status", currentStatus);
      }
      params.set("page", String(page));
      params.set("limit", "5");
      const response = await fetch(`/api/tasks?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Gagal mengambil data tugas");
      }
      const result = await response.json();
      setTasks(result.data);
      setPagination(result.pagination);
    } catch (error) {
      console.error(error);
      setError("Gagal memuat tugas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  function handleSearch(value: string) {
    setSearch(value);
    fetchTasks(value, status, 1);
  }

  function handleStatusChange(value: string) {
    setStatus(value);
    fetchTasks(search, value, 1);
  }

  function handleReset() {
    setSearch("");
    setStatus("all");
    fetchTasks("", "all", 1);
  }

  function handlePageChange(page: number) {
    fetchTasks(search, status, page);
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Apakah Anda yakin ingin menghapus tugas ini?",
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menghapus tugas.");
      }

      await fetchTasks(search, status, pagination?.page ?? 1);
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error ? error.message : "Gagal menghapus tugas.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            strokeWidth={2}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => handleSearch(event.target.value)}
            placeholder="Cari tugas..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
          />
        </div>

        {/* Filter Status */}
        <select
          value={status}
          onChange={(event) => handleStatusChange(event.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
        >
          <option value="all">Semua Status</option>
          <option value="new">Baru</option>
          <option value="in progress">Sedang Dikerjakan</option>
          <option value="in testing">Dalam Pengujian</option>
          <option value="done">Selesai</option>
        </select>

        {/* Reset */}
        {(search || status !== "all") && (
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <RotateCcw size={16} />
            Atur Ulang
          </button>
        )}
      </div>

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Daftar Tugas</h2>

          <p className="mt-1 text-sm text-slate-500">
            {pagination
              ? `${pagination.total} tugas ditemukan`
              : "Kelola dan pantau tugas Anda"}
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-10">
          <RefreshCw size={24} className="animate-spin text-slate-400" />

          <p className="mt-3 text-sm text-slate-500">Memuat tugas...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="text-sm text-red-600">{error}</p>

          <button
            onClick={() => fetchTasks(search, status, 1)}
            className="mt-3 flex items-center gap-2 text-sm font-medium text-red-700 transition hover:text-red-800"
          >
            <RefreshCw size={15} />
            Coba Lagi
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && tasks.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <ClipboardList size={22} />
          </div>

          <h3 className="mt-4 font-semibold text-slate-900">Tidak Ada Tugas</h3>

          <p className="mt-1 text-sm text-slate-500">
            Coba ubah pencarian atau filter Anda.
          </p>
        </div>
      )}

      {/* Daftar Tugas */}
      {!loading && !error && tasks.length > 0 && (
        <div className="space-y-3">
          {tasks.map((task) => {
            const statusInfo = statusConfig[task.status];

            return (
              <div
                key={task.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-semibold text-slate-900">
                        {task.title}
                      </h3>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${statusInfo.className}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>

                    {task.description && (
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {task.description}
                      </p>
                    )}

                    <p className="mt-4 text-xs text-slate-400">
                      Dibuat{" "}
                      {new Date(task.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Action */}
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingTask(task)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(task.id)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={15} />
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {editingTask && (
        <EditTaskForm
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSuccess={() => {
            setEditingTask(null);
            fetchTasks(search, status, pagination?.page ?? 1);
          }}
        />
      )}
      {/* Pagination */}
      {!loading && !error && pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-sm text-slate-500">
            Halaman {pagination.page} dari {pagination.totalPages}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={pagination.page === 1}
              onClick={() => handlePageChange(pagination.page - 1)}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={16} />
              Sebelumnya
            </button>

            <button
              type="button"
              disabled={pagination.page === pagination.totalPages}
              onClick={() => handlePageChange(pagination.page + 1)}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Berikutnya
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
