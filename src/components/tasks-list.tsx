"use client";
import { IconCheck, IconX } from "@tabler/icons-react";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearError } from "@/store/slices/journal-slice";
import { useAuth } from "@clerk/nextjs";
import { setClientToken } from "@/lib/client-api-fetch";
import { deleteTaskThunk } from "@/store/slices/tasks-slice";

export function TasksList() {
  const { getToken } = useAuth();
  const dispatch = useAppDispatch();
  const { tasks, loading, error } = useAppSelector((state) => state.tasks);

  async function handleTaskComplete(task_id: number) {
    const token = await getToken();
    setClientToken(token);
    dispatch(deleteTaskThunk({ task_id }));
  }
  const isCompleting = (task_id: number) =>
    loading.completing.includes(task_id);

  return (
    <>
      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
          <button
            onClick={() => dispatch(clearError())}
            className="btn btn-sm btn-ghost ml-auto"
          >
            <IconX />
          </button>
        </div>
      )}
      <div className="my-10 grid gap-6 grid-cols-1">
        {tasks?.map((task, i) => {
          return (
            <div
              key={i}
              className="flex flex-row rounded-lg bg-zinc-900 p-4 justify-between items-center"
            >
              <div className="flex flex-col mr-5">
                <div className="text-sm sm:text-lg font-semibold opacity-80">
                  {task.description}
                </div>
              </div>
              <button
                onClick={handleTaskComplete.bind(null, task.id)}
                className="rounded-lg btn btn-ghost btn-soft hover:btn-accent "
                disabled={isCompleting(task.id)}
              >
                {isCompleting(task.id) ? "Completing..." : <IconCheck />}
              </button>
            </div>
          );
        })}
        {tasks?.length === 0 && (
          <div className="opacity-60 flex justify-center">All Done!</div>
        )}
      </div>
    </>
  );
}
