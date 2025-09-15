import React, { Suspense } from "react";

import { UserDetailSkeleton } from "@/components/ui/skeletons";
import { UserDetail } from "@/components/user-detail";

export default async function UserDetailPage({
  params,
}: {
  params: { id: number };
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<UserDetailSkeleton />}>
      <UserDetail user_id={id} />
    </Suspense>
  );
}
