import { Journal } from "@/lib/interfaces";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import Link from "next/link";
import React from "react";

export function JournalsList({ journals }: { journals: Journal[] }) {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 auto-rows-[15rem] sm:auto-rows-[16rem] md:grid-cols-3 h-full overflow-y-auto pb-20">
      {journals.map((journal, i) => (
        <BackgroundGradient
          key={i}
          className="flex flex-col rounded-[22px] bg-white dark:bg-zinc-900 h-full w-full"
        >
          <div className="p-4 sm:p-6 flex flex-col flex-grow">
            {/* go to journal detail page*/}
            <Link href={`/journals/${journal.id}`} className="flex-grow">
              <div className="overflow-hidden flex-grow">
                <p className="text-lg sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200 line-clamp-1">
                  {journal.title}
                </p>
              </div>
              <div className="overflow-hidden flex-grow">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-4 ">
                  {journal.content}
                </p>
              </div>
            </Link>

            <div className="flex flex-row w-full justify-between">
              <div className="rounded-full px-2 py-1 text-white flex items-center bg-black text-xs dark:bg-zinc-800">
                {journal.created_at}
              </div>

              {/*  go to author detail page*/}
              <Link
                href={`/users/${journal.author.id}`}
                className="rounded-full px-2 py-1 text-white flex items-center bg-black text-sm  dark:bg-zinc-800"
              >
                {journal.author.first_name}
              </Link>
            </div>
          </div>
        </BackgroundGradient>
      ))}
      {journals.length === 0 && (
        <div className="opacity-60">Nothing here yet</div>
      )}
    </div>
  );
}
