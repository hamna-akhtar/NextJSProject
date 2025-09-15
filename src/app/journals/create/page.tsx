import { JournalCreateForm } from "@/components/journal-create-form";
import React, { Suspense } from "react";
import {
  getUsersList,
  getMyProfile,
} from "@/lib/api/serveractions/user-actions";
import { User } from "@/lib/interfaces";
import { JournalFormSkeleton } from "@/components/ui/skeletons";

async function JournalCreateFormData() {
  const [curr_user, all_users] = await Promise.all([
    getMyProfile(),
    getUsersList(),
  ]);
  const can_share_to = all_users.filter(
    (user: User) => user.id != curr_user.id,
  );

  return (
    <div className="overflow-auto bg-black/[0.96]">
      <JournalCreateForm users={can_share_to} />
    </div>
  );
}

export default function JournalCreatePage() {
  return (
    <Suspense fallback={<JournalFormSkeleton />}>
      <JournalCreateFormData />
    </Suspense>
  );
}
