import { TasksTab } from "@/components/tasks-tab";
import { TabsSkeleton } from "@/components/ui/skeletons";
import { getMyProfile } from "@/lib/api/serveractions/user-actions";
import { Suspense } from "react";

async function TasksData() {
  const curr_user = await getMyProfile();
  const tasks = curr_user.tasks;

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
