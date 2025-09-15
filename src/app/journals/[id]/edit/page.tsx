import { JournalEditForm } from "@/components/journal-edit-form";
import React, { Suspense } from "react";
import { getUsersList } from "@/lib/api/serveractions/user-actions";
import { getJournalDetail } from "@/lib/api/serveractions/journal-actions";
import { User } from "@/lib/interfaces";
import { JournalFormSkeleton } from "@/components/ui/skeletons";

async function JournalEditData({ journal_id }: { journal_id: number }) {
  const [journal, all_users] = await Promise.all([
    getJournalDetail(journal_id),
    getUsersList(),
  ]);

  const can_share_to = all_users.filter(
    (user: User) => user.id != journal.author.id,
  );

  return (
    <div className="overflow-auto bg-black/[0.96]">
      <JournalEditForm initial_journal={journal} users={can_share_to} />
    </div>
  );
}

export default async function JournalEditPage({
  params,
}: {
  params: { id: number };
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<JournalFormSkeleton />}>
      <JournalEditData journal_id={id} />
    </Suspense>
  );
}
