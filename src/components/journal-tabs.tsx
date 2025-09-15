import { Journal } from "@/lib/interfaces";
import { Tabs } from "./ui/tabs";
import Link from "next/link";
import React from "react";
import { IconPlus } from "@tabler/icons-react";
import { JournalsList } from "./journals-list";

export function JournalTabs({
  myJournals,
  publicJournals,
  sharedWithMe,
}: {
  myJournals: Journal[];
  publicJournals: Journal[];
  sharedWithMe: Journal[];
}) {
  const tabs = [
    {
      title: "My Journals",
      value: "my-journals",
      content: (
        <div className="w-full h-full flex flex-col rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gray-800">
          <div className="flex flex-row justify-between items-center">
            <p className="mb-6">My Journals</p>
            <Link
              href={"/journals/create"}
              className="mb-6 rounded-lg btn btn-active hover:btn-primary hover:text-white md:text-xl md:p-6 sm:text-md sm:p-3  text-neutral-300"
            >
              <IconPlus /> Add Journal
            </Link>
          </div>
          <div className="overflow-y-auto">
            <JournalsList journals={myJournals} />
          </div>
        </div>
      ),
    },
    {
      title: "Shared With Me",
      value: "shared-with-me",
      content: (
        <div className="w-full h-full flex flex-col rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gray-800">
          <p className="mb-8">Shared With Me</p>
          <div className="overflow-y-auto">
            <JournalsList journals={sharedWithMe} />
          </div>
        </div>
      ),
    },
    {
      title: "Public",
      value: "public",
      content: (
        <div className="w-full h-full flex flex-col rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gray-800">
          <p className="mb-8">Public</p>
          <div className="overflow-y-auto">
            <JournalsList journals={publicJournals} />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="h-[75vh] [perspective:1000px] relative flex flex-col max-w-7xl mx-auto w-full items-start justify-start my-10">
      <Tabs tabs={tabs} />
    </div>
  );
}
