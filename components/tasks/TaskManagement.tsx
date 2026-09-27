"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import TaskForm from "@/components/tasks/TaskForm";
import TaskList from "@/components/tasks/TaskList";

export default function TaskManagement() {
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  function handleTaskCreated() {
    setShowForm(false);
    setRefreshKey((current) => current + 1);
  }

  return (
    <>
      {/* Header */}
      <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold tracking-widest text-emerald-600">
            MANAJEMEN TUGAS
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Kelola Tugas Anda
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Atur dan pantau pekerjaan Anda dalam satu tempat.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          <Plus size={18} />
          Tambah Tugas
        </button>
      </header>
      <TaskList key={refreshKey} />
      {showForm && (
        <TaskForm
          onClose={() => setShowForm(false)}
          onSuccess={handleTaskCreated}
        />
      )}
    </>
  );
}
