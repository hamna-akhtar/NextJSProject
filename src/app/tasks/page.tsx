import { TasksTab } from "@/components/tasks-tab";
import { TabsSkeleton } from "@/components/ui/skeletons";
import { getMyProfile } from "@/lib/api/serveractions/user-actions";
import { Task } from "@/lib/interfaces";
import { Suspense } from "react";

async function TasksData() {
  const curr_user = await getMyProfile();
  // newest to oldest
  const tasks = curr_user.tasks?.sort((a:Task, b:Task) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return <TasksTab tasks={tasks} />;
}

export default function TasksPage() {
  return (
    <div className="w-screen min-h-screen bg-black/[0.96] antialiased pb-8">
      <Suspense fallback={<TabsSkeleton />}>
        <TasksData />
      </Suspense>
    </div>
  );
}
