"use client";
import React from "react";
import { Journal, User, AccessType } from "@/lib/interfaces";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateJournalThunk, setJournal } from "@/store/slices/journal-slice";
import { useAuth } from "@clerk/nextjs";
import { setClientToken } from "@/lib/client-api-fetch";
import toast from "react-hot-toast";

export function JournalEditForm({
  initial_journal,
  users,
}: {
  initial_journal: Journal;
  users: User[];
}) {
  const { getToken } = useAuth();
  const dispatch = useAppDispatch();

  const {
    current: journal,
    error,
    loading,
  } = useAppSelector((state) => state.journal);

  useEffect(() => {
    dispatch(setJournal(initial_journal));
  }, [dispatch, initial_journal]);

  // console.log("access!", journal?.access);

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (journal) {
        const token = await getToken();
        setClientToken(token);

        const formData = new FormData();
        formData.append("title", journal.title);
        formData.append("content", journal.content);
        formData.append("access", journal.access);

        if (journal.access === "custom" && journal.shared_to) {
          journal.shared_to.forEach((user) => {
            formData.append("shared_to", user.id.toString());
          });
        }

        await dispatch(
          updateJournalThunk({ journal_id: journal.id, formData }),
        );
        toast("Updated!");
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  }

  return (
    <div className="w-screen min-h-screen antialiased flex items-center justify-center">
      <div className="flex flex-col w-[80%] max-w-7xl mt-10">
        <p className="flex justify-center p-10 text-4xl font-bold bg-gradient-to-b  from-neutral-200 to-neutral-500 bg-clip-text text-transparent">
          Edit Journal
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleFormSubmit}>
          {/* <form> */}
          <div className="my-auto rounded-lg bg-zinc-800 p-10 space-y-6 leading-loose text-neutral-400 font-medium text-justify placeholder:text-neutral-500">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-xl mb-2">
                Title
              </label>
              <input
                id="title"
                name="title"
                // defaultValue={journal?.title}
                value={journal?.title ?? ""}
                onChange={(e) => {
                  dispatch(setJournal({ ...journal!, title: e.target.value }));
                }}
                className="block w-full rounded-lg bg-black/[0.96] p-5 text-lg "
                required
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-xl mb-2">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={journal?.content ?? ""}
                onChange={(e) => {
                  dispatch(
                    setJournal({ ...journal!, content: e.target.value }),
                  );
                }}
                rows={4}
                className="block w-full rounded-lg bg-black/[0.96] p-5 text-lg "
                required
              />
            </div>

            {/* Access type */}
            <div>
              <label htmlFor="access" className="block text-xl mb-2">
                Access
              </label>
              <select
                id="access"
                name="access"
                value={journal?.access ?? "private"}
                onChange={(e) => {
                  dispatch(
                    setJournal({
                      ...journal!,
                      access: e.target.value as AccessType,
                    }),
                  );
                }}
                className="block w-full rounded-lg bg-black/[0.96] p-5 text-lg "
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            {/* only show if access is custom */}
            {journal?.access == "custom" && (
              <div>
                <label htmlFor="access" className="block text-xl mb-2">
                  Share With
                </label>
                <div className=" block w-full rounded-lg bg-black/[0.96] p-5 text-lg max-h-30 overflow-y-auto space-y-2">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`shared_to_${user.id}`}
                        name="shared_to"
                        value={user.id}
                        checked={
                          !!journal?.shared_to?.some(
                            (u) => String(u.id) === String(user.id),
                          )
                        }
                        onChange={(e) => {
                          const isChecked = e.target.checked;

                          let updatedSharedTo = journal?.shared_to ?? [];
                          if (isChecked) {
                            updatedSharedTo = [...updatedSharedTo, user];
                          } else {
                            updatedSharedTo = updatedSharedTo.filter(
                              (u) => u.id !== user.id,
                            );
                          }
                          dispatch(
                            setJournal({
                              ...journal!,
                              shared_to: updatedSharedTo,
                            }),
                          );
                        }}
                        className="mr-4"
                      />
                      <label htmlFor={`shared_to_${user.id}`}>
                        {user.first_name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="my-5 flex justify-end ">
            <button
              type="submit"
              className="rounded btn btn-soft hover:btn-accent hover:text-white text-xl p-6 text-neutral-300"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
