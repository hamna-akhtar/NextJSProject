import { JournalTabs } from "@/components/journal-tabs";
import { TabsSkeleton } from "@/components/ui/skeletons";
import {
  getMyJournals,
  getPublicJournals,
  getSharedWithMe,
} from "@/lib/api/serveractions/journal-actions";
import { Suspense } from "react";

async function JournalsData() {
  const [myJournals, publicJournals, sharedWithMe] = await Promise.all([
    getMyJournals(),
    getPublicJournals(),
    getSharedWithMe(),
  ]);

  return (
    <JournalTabs
      myJournals={myJournals}
      publicJournals={publicJournals}
      sharedWithMe={sharedWithMe}
    />
  );
}

export default function JournalsPage() {
  return (
    <div className="w-screen min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] pb-8">
      <div className="max-w-6xl mx-auto px-4 py-12 mt-8">
        <Suspense fallback={<TabsSkeleton />}>
          <JournalsData />
        </Suspense>
      </div>
    </div>
  );
}
