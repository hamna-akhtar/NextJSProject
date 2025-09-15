"use client";
import React from "react";
import { User, AccessType } from "@/lib/interfaces";
import { useState } from "react";
import { createJournal } from "@/lib/api/clientactions/journal-actions";
import { useAuth } from "@clerk/nextjs";
import { setClientToken } from "@/lib/client-api-fetch";
import { useRouter } from "next/navigation";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function JournalCreateForm({ users }: { users: User[] }) {
  const [access, setAccess] = useState<AccessType>("private");
  const { getToken } = useAuth();
  const router = useRouter();

  async function handleCreateJournal(formData: FormData) {
    const token = await getToken();
    setClientToken(token);
    createJournal(formData);
    router.push("/journals");
  }

  return (
    <div className="w-screen min-h-screen antialiased flex items-center justify-center">
      <div className="flex flex-col w-[80%] max-w-7xl ">
        <p className="flex justify-center p-10 text-4xl font-bold bg-gradient-to-b  from-neutral-200 to-neutral-500 bg-clip-text text-transparent">
          Create Journal
        </p>

        <form action={handleCreateJournal}>
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
                placeholder="Enter title here"
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
                placeholder="Begin your journal entry here..."
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
                defaultValue={access}
                onChange={(e) =>
                  setAccess(e.target.value as "private" | "public" | "custom")
                }
                className="block w-full rounded-lg bg-black/[0.96] p-5 text-lg "
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            {/* only show if access is custom */}
            {access === "custom" && (
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
                        className="mr-4"
                      />
                      <label htmlFor={`shared_to_${user.id}`}>
                        {user.first_name} {user.last_name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="my-5 flex justify-end">
            <button
              type="submit"
              className="rounded btn btn-soft hover:btn-accent hover:text-white text-xl p-6 text-neutral-300"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
