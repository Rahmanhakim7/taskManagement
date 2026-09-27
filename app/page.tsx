import TaskManagement from "@/components/tasks/TaskManagement";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl">
        <TaskManagement />
      </div>
    </main>
  );
}
