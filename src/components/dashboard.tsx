import React from "react";
import { Journal } from "@/lib/interfaces";
import { JournalsList } from "./journals-list";

export default function Dashboard({ journals }: { journals: Journal[] }) {
  return (
    <div className="flex justify-center items-center flex-col mb-10">
      <div
        id="journals"
        className="relative w-screen h-screen antialiased flex flex-col gap-10 items-center justify-center snap-start"
      >
        {/* heading */}
        <p className="mt-20 pb-5 px-10 text-5xl font-bold bg-gradient-to-b from-neutral-300 to-neutral-500 bg-clip-text text-transparent">
          All Journals
        </p>

        {/* journals */}
        <div className="w-[70vw] overflow-auto rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gray-800">
          <div className="overflow-y-auto max-h-[65vh] pt-10">
            <JournalsList journals={journals} />
          </div>
        </div>
      </div>
    </div>
  );
}
