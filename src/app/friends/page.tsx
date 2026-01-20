import {
  getMyProfile,
  getDiscoverFriendsList,
} from "@/lib/api/serveractions/user-actions";
import {
  getFriendRequestsList,
  getSentRequestsList,
  getReceivedRequestsList,
} from "@/lib/api/serveractions/friend-actions";
import { FriendRequest } from "@/lib/interfaces";
import React, { Suspense } from "react";
import { FriendTabs } from "@/components/friend-tabs";
import { TabsSkeleton } from "@/components/ui/skeletons";

async function FriendsData() {
  const [
    curr_user,
    friend_requests,
    received_requests,
    sent_requests,
    discover_friends,
  ] = await Promise.all([
    getMyProfile(),
    getFriendRequestsList(),
    getReceivedRequestsList(),
    getSentRequestsList(),
    getDiscoverFriendsList(),
  ]);

  const accepted_requests = friend_requests.filter(
    (request: FriendRequest) => request.accepted,
  );

  return (
    <FriendTabs
      accepted_requests={accepted_requests}
      received_requests={received_requests}
      sent_requests={sent_requests}
      discover_friends={discover_friends}
      curr_user_id={curr_user.id}
    />
  );
}

export default function FriendsPage() {
  return (
    <div className="w-screen min-h-screen bg-black/[0.96] antialiased">
      <div className="max-w-6xl mx-auto px-4 py-12 mt-8">
        <Suspense fallback={<TabsSkeleton />}>
          <FriendsData />
        </Suspense>
      </div>
    </div>
  );
}
