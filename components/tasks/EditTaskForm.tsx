"use client";

import { FormEvent, useState } from "react";
import { X, Save, LoaderCircle, AlertCircle } from "lucide-react";

type TaskStatus = "new" | "in progress" | "in testing" | "done";

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
};

type EditTaskFormProps = {
  task: Task;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditTaskForm({
  task,
  onClose,
  onSuccess,
}: EditTaskFormProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Judul tugas wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          status,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengubah tugas.");
      }

      onSuccess();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error ? error.message : "Gagal mengubah tugas.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Edit Tugas</h2>

            <p className="mt-1 text-sm text-slate-500">
              Perbarui informasi tugas Anda.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Tutup"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
              <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />

              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Judul */}
          <div>
            <label
              htmlFor="edit-title"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Judul Tugas
            </label>

            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Contoh: Membuat API Task"
              disabled={loading}
              autoFocus
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label
              htmlFor="edit-description"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Deskripsi
              <span className="ml-1 font-normal text-slate-400">
                (opsional)
              </span>
            </label>

            <textarea
              id="edit-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Jelaskan detail tugas..."
              rows={4}
              disabled={loading}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="edit-status"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Status
            </label>

            <select
              id="edit-status"
              value={status}
              onChange={(event) => setStatus(event.target.value as TaskStatus)}
              disabled={loading}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="new">Baru</option>
              <option value="in progress">Sedang Dikerjakan</option>
              <option value="in testing">Dalam Pengujian</option>
              <option value="done">Selesai</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <LoaderCircle size={17} className="animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save size={17} />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
