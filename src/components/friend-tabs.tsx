"use client";
import { FriendRequest, User, MiniUser } from "@/lib/interfaces";
import { Tabs } from "./ui/tabs";
import React, { useEffect } from "react";
import { RequestsList } from "@/components/requests-list";
import { UsersList } from "@/components/users-list";
import { useAppDispatch } from "@/store/hooks";
import { initializeFriendsData } from "@/store/slices/friends-slice";

export function FriendTabs({
  accepted_requests,
  received_requests,
  sent_requests,
  discover_friends,
  curr_user_id,
}: {
  accepted_requests: FriendRequest[];
  received_requests: FriendRequest[];
  sent_requests: FriendRequest[];
  discover_friends: (User | MiniUser)[];
  curr_user_id: number;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      initializeFriendsData({
        accepted_requests,
        received_requests,
        sent_requests,
        discover_friends,
      }),
    );
  }, [
    accepted_requests,
    received_requests,
    sent_requests,
    discover_friends,
    dispatch,
  ]);

  const tabs = [
    {
      title: "My Friends",
      value: "my-friends",
      content: (
        <div className="w-full h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gray-800 flex flex-col">
          <p className="mb-5">My Friends</p>

          <div className="overflow-y-auto">
            <RequestsList
              // requests={accepted_requests}
              curr_user_id={curr_user_id}
              type={"my"}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Requests Received",
      value: "requests-received",
      content: (
        <div className="w-full h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gray-800 flex flex-col">
          <p className="mb-5">Requests Received</p>

          <div className="overflow-y-auto">
            <RequestsList
              // requests={received_requests}
              curr_user_id={curr_user_id}
              type={"received"}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Requests Sent",
      value: "requests-sent",
      content: (
        <div className="w-full h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gray-800 flex flex-col">
          <p className="mb-5">Requests Sent</p>

          <div className="overflow-y-auto">
            <RequestsList
              // requests={sent_requests}
              curr_user_id={curr_user_id}
              type={"sent"}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Discover Friends",
      value: "discover-friends",
      content: (
        <div className="w-full h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gray-800 flex flex-col">
          <p className="mb-5">Find Friends</p>
          <div className="overflow-y-auto">
            <UsersList
              // users={discover_friends}
              type={"discover"}
            />
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
