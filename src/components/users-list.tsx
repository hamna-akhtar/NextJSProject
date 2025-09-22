"use client";
import type { User, MiniUser } from "@/lib/interfaces";
import { IconX } from "@tabler/icons-react";
import React from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { sendFriendRequestThunk } from "@/store/slices/friends-slice";
import { clearError } from "@/store/slices/journal-slice";
import { useAuth } from "@clerk/nextjs";
import { setClientToken } from "@/lib/client-api-fetch";

export function UsersList({
  users_list,
  type,
}: {
  users_list?: (User | MiniUser)[];
  type: string;
}) {
  const { getToken } = useAuth();
  const dispatch = useAppDispatch();
  const { loading, error, discover_friends } = useAppSelector(
    (state) => state.friends,
  );

  const getUsers = () => {
    switch (type) {
      case "discover":
        return discover_friends;
      default:
        return users_list;
    }
  };
  const users = getUsers();

  async function handleSendRequest(request_to_id: number) {
    const token = await getToken();
    setClientToken(token);
    dispatch(
      sendFriendRequestThunk({
        user_id: request_to_id,
      }),
    );
  }

  const isSending = (user_id: number) => loading.sending.includes(user_id);

  return (
    <>
      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
          <button
            onClick={() => dispatch(clearError())}
            className="btn btn-sm btn-ghost ml-auto"
          >
            <IconX />
          </button>
        </div>
      )}
      <div
        className={`my-10 grid gap-6 ${
          users?.length == 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
        }`}
      >
        {users?.map((user, i) => {
          let button;
          switch (type) {
            case "discover":
              button = (
                <button
                  onClick={handleSendRequest.bind(null, user.id)}
                  className="btn  btn-ghost rounded-lg hover:btn-accent inline-flex w-auto items-center"
                  disabled={isSending(user.id)}
                >
                  {isSending(user.id) ? "Sending..." : "Send Request"}
                </button>
              );
              break;

            default:
              button = null;
          }
          return (
            <div
              key={i}
              className="flex flex-row rounded-lg bg-zinc-900 p-4 justify-between items-center"
            >
              <Link href={`/users/${user.id}`} className="flex flex-col">
                <div className="text-lg">
                  {user.first_name} {user.last_name}
                </div>
                <div className="text-sm font-semibold opacity-60">
                  {user.email}
                </div>
              </Link>
              {button}
            </div>
          );
        })}
      </div>
    </>
  );
}
