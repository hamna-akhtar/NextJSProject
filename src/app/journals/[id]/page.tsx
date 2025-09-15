import { Suspense } from "react";
import { JournalDetailSkeleton } from "@/components/ui/skeletons";
import { JournalDetail } from "@/components/journal-detail";

export default async function JournalDetailPage({
  params,
}: {
  params: { id: number };
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<JournalDetailSkeleton />}>
      <JournalDetail journal_id={id} />
    </Suspense>
  );
}
