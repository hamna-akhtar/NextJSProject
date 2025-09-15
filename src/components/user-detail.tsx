import React from "react";
import Link from "next/link";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";
import { UsersList } from "@/components/users-list";
import { getUserDetail } from "@/lib/api/serveractions/user-actions";
import { JournalsList } from "@/components/journals-list";

export async function UserDetail({ user_id }: { user_id: number }) {
  const user = await getUserDetail(user_id);

  return (
    <section className="overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth bg-black/[0.96]">
      <div
        id="profile"
        className="relative w-screen h-screen antialiased flex flex-col gap-10 justify-center items-center snap-start"
      >
        {/* heading */}
        <p className="uppercase mt-20 pb-5 px-10 text-5xl font-bold bg-gradient-to-b from-neutral-300 to-neutral-500 bg-clip-text text-transparent">
          {user.first_name} {user.last_name}&apos;s Profile
        </p>

        {/* profile */}
        <div className="flex flex-col w-[70%] max-w-5xl bg-gray-800 rounded-2xl px-10 ">
          <div className="my-auto flex flex-col p-10 px-10 space-y-4 leading-loose text-neutral-400 font-medium text-justify placeholder:text-neutral-500">
            {/* email */}
            <div className="flex flex-row justify-between items-center">
              <p className="text-3xl font-semibold">Email</p>
              <p className="text-2xl">{user.email}</p>
            </div>

            {/* firstname */}
            <div className="flex flex-row justify-between items-center">
              <p className="text-3xl font-semibold">First name</p>
              <p className="text-2xl">
                {user.first_name ? user.first_name : "-"}
              </p>
            </div>

            {/* lastname */}
            <div className="flex flex-row justify-between items-center">
              <p className="text-3xl font-semibold">Last name</p>
              <p className="text-2xl">
                {user.first_name ? user.last_name : "-"}
              </p>
            </div>
          </div>
        </div>

        {/* journals scroll down button */}
        {user.journal_entries && user.journal_entries.length > 0 ? (
          <Link
            href="#journals"
            className="absolute bottom-10 flex items-center justify-center gap-1 px-3 py-2 rounded-full bg-gray-700 hover:bg-gray-500 transition text-white text-sm"
          >
            Journals <IconArrowDown size={16} />
          </Link>
        ) : (
          user.friends &&
          user.friends.length > 0 && (
            <Link
              href="#friends"
              className="absolute bottom-10 flex items-center justify-center gap-1 px-3 py-2 rounded-full bg-gray-700 hover:bg-gray-500 transition text-white text-sm"
            >
              Friends <IconArrowDown size={16} />
            </Link>
          )
        )}
      </div>

      {user.journal_entries && user.journal_entries.length > 0 && (
        <div
          id="journals"
          className="relative w-screen h-screen antialiased flex flex-col gap-10 items-center justify-center snap-start"
        >
          {/* heading */}
          <p className="uppercase mt-20 pb-5 px-10 text-5xl font-bold bg-gradient-to-b from-neutral-300 to-neutral-500 bg-clip-text text-transparent">
            {user.first_name} {user.last_name}&apos;s Journals
          </p>

          {/* journals */}
          <div className="w-[70%] max-w-5xl overflow-auto rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gray-800">
            <div className="overflow-y-auto max-h-[53vh]">
              <JournalsList journals={user.journal_entries} />
            </div>
          </div>

          {/* friends scroll down button */}
          {user.friends && user.friends.length > 0 ? (
            <Link
              href="#friends"
              className="absolute bottom-10 flex items-center justify-center gap-1 px-3 py-2 rounded-full bg-gray-700 hover:bg-gray-500 transition text-white text-sm"
            >
              Friends <IconArrowDown size={16} />
            </Link>
          ) : (
            <Link
              href="#profile"
              className="absolute bottom-10 flex items-center justify-center gap-1 px-3 py-2 rounded-full bg-gray-700 hover:bg-gray-500 transition text-white text-sm"
            >
              Back to top <IconArrowUp size={16} />
            </Link>
          )}
        </div>
      )}

      {user.friends && user.friends.length > 0 && (
        <div
          id="friends"
          className="relative w-screen min-h-screen antialiased flex flex-col gap-10 items-center justify-center snap-start"
        >
          <p className="uppercase mt-20 pb-5 px-10 text-5xl font-bold bg-gradient-to-b from-neutral-300 to-neutral-500 bg-clip-text text-transparent">
            {user.first_name} {user.last_name}&apos;s Friends
          </p>

          {/* friends */}
          <div className="overflow-y-auto max-h-[53vh] w-[70%] max-w-5xl rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gray-800">
            <UsersList users_list={user.friends} type={""} />
          </div>

          {/* back to top button */}
          <Link
            href="#profile"
            className="absolute bottom-10 flex items-center justify-center gap-1 px-3 py-2 rounded-full bg-gray-700 hover:bg-gray-500 transition text-white text-sm"
          >
            Back to top <IconArrowUp size={16} />
          </Link>
        </div>
      )}
    </section>
  );
}
