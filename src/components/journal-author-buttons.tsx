"use client";
import React from "react";
import Link from "next/link";
import { deleteJournal } from "@/lib/api/clientactions/journal-actions";
import { useRouter } from "next/navigation";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { useAuth } from "@clerk/nextjs";
import { setClientToken } from "@/lib/client-api-fetch";
import { toast } from "react-hot-toast";
import { Task } from "@/lib/interfaces";
import { deleteTask } from "@/lib/api/clientactions/journal-actions";

export function JournalAuthorButtons({ journal_id , journal_tasks}: { journal_id: number , journal_tasks: Task[]}) {
  
  const router = useRouter();
  const { getToken } = useAuth();

  function openModal(id: string) {
    const modal = document.getElementById(id) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  }

  async function handleDeleteJournalAndTasks() {
    try {
      journal_tasks.forEach( async (task) => {
        const token = await getToken();
        setClientToken(token);
        await deleteTask(task.id);
      });
    } catch (err) {
      console.error("Error deleting tasks for journal:", journal_id, ":", err);
      toast(`Something went wrong when deleting journal tasks`);
    }
    handleDeleteJournal();
  }

   async function handleDeleteJournal() {
    try {
      const token = await getToken();
      setClientToken(token);
      await deleteJournal(journal_id);
      // console.log("Deleted journal");
      router.push("/journals");
    } catch (err) {
      console.error("Error deleting journal:", err);
      toast(`Something went wrong`);
    }
  }

  return (
    <div className="flex flex-row gap-6 pt-10">
      {/* edit button */}
      <Link
        href={`/journals/${journal_id}/edit`}
        className="btn group btn-soft text-lg text-neutral-300 hover:text-white"
      >
        <IconPencil className="pr-0.5 group-hover:p-0 group-hover:text-green-500" />{" "}
        Edit
      </Link>

      {/* delete button w modal*/}
      <button
        className="btn group btn-soft text-lg text-neutral-300 hover:text-white"
        onClick={() => openModal("delete_journal_modal")}
      >
        <IconTrash className="pr-0.5 group-hover:p-0 group-hover:text-red-600" />{" "}
        Delete
      </button>

      <dialog id="delete_journal_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-zinc-800">
          <p className="py-4 font-bold text-xl text-neutral-300 ">
            Are you sure you want to delete this journal entry?
          </p>
          <div className="modal-action">
            <form method="dialog" className="flex flex-row ">
              <button
                onClick={() => openModal("delete_tasks_modal")}
                className="btn btn-ghost text-lg hover:btn-error rounded-lg"
              >
                Yes
              </button>
              <button className="btn btn-ghost text-lg rounded-lg">Cancel</button>
            </form>
          </div>
        </div>
      </dialog>
      
       <dialog id="delete_tasks_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-zinc-800">
          <p className="py-4 font-bold text-xl text-neutral-300 ">
          Do you also want to delete all pending tasks related to this journal?
          </p>
          <div className="modal-action">
            <form method="dialog" className="flex flex-row justify-between w-full">
              <div className="flex flex-row justify-start"> 
                <button className="btn btn-ghost text-lg rounded-lg">Cancel</button>
              </div>
              <div className="flex flex-row justify-end"> 
                <button
                  onClick={handleDeleteJournalAndTasks}
                  className="btn btn-ghost text-lg hover:btn-error rounded-lg"
                >
                  Yes
                </button>
                <button 
                  onClick={handleDeleteJournal}
                  className="btn btn-ghost text-lg rounded-lg"
                  >
                  No
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
