"use client";
import React from "react";
import Link from "next/link";
import { deleteJournal } from "@/lib/api/clientactions/journal-actions";
import { useRouter } from "next/navigation";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { useAuth } from "@clerk/nextjs";
import { setClientToken } from "@/lib/client-api-fetch";
import { toast } from "react-hot-toast";

export function JournalAuthorButtons({ journal_id }: { journal_id: number }) {
  const router = useRouter();
  const { getToken } = useAuth();

  function openModal(id: string) {
    const modal = document.getElementById(id) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  }

  async function handleDeleteJournal() {
    try {
      const token = await getToken();
      setClientToken(token);
      await deleteJournal(journal_id);
      // console.log("Deleted journal");
      router.push("/journals");
    } catch (err) {
      // console.error("Error deleting journal:", err);
      toast(`Something went wrong: ${err}`);
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
        onClick={() => openModal("my_modal_5")}
      >
        <IconTrash className="pr-0.5 group-hover:p-0 group-hover:text-red-600" />{" "}
        Delete
      </button>

      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-zinc-800">
          <p className="py-4 font-bold text-xl text-neutral-300 ">
            Are you sure you want to delete this journal entry?
          </p>
          <div className="modal-action">
            <form method="dialog" className="flex flex-row ">
              <button
                onClick={handleDeleteJournal}
                className="btn btn-ghost text-lg"
              >
                Yes
              </button>
              <button className="btn btn-ghost text-lg ">Cancel</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
