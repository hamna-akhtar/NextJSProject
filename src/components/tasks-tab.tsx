"use client";
import { TasksList } from "@/components/tasks-list";
import { Task } from "@/lib/interfaces";
import { useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";
import { initializeTasksData } from "@/store/slices/tasks-slice";


export function TasksTab({ tasks }: { tasks: Task[] }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeTasksData({ tasks }));
  }, [tasks, dispatch]);

  return (
    <div className="relative w-screen min-h-screen flex flex-col items-center justify-center">
      <p className="mt-20 pb-15 px-10 text-5xl font-bold bg-gradient-to-b from-neutral-300 to-neutral-500 bg-clip-text text-transparent">
        Pending Tasks
      </p>

      <div className="overflow-y-auto max-h-[65vh] w-[75%] max-w-7xl rounded-2xl p-10 bg-gray-800">
        <TasksList />
      </div>
    </div>
  );
}
