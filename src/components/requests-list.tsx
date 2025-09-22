"use client";
import React from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  acceptFriendRequestThunk,
  deleteFriendRequestThunk,
} from "@/store/slices/friends-slice";
import { clearError } from "@/store/slices/journal-slice";
import { IconX } from "@tabler/icons-react";
import { useAuth } from "@clerk/nextjs";
import { setClientToken } from "@/lib/client-api-fetch";

export function RequestsList({
  // requests,
  curr_user_id,
  type,
}: {
  // requests: FriendRequest[];
  curr_user_id: number;
  type: string;
}) {
  const { getToken } = useAuth();
  const dispatch = useAppDispatch();
  const {
    loading,
    error,
    accepted_requests,
    sent_requests,
    received_requests,
  } = useAppSelector((state) => state.friends);

  const getRequests = () => {
    switch (type) {
      case "my":
        return accepted_requests;
      case "sent":
        return sent_requests;
      case "received":
        return received_requests;
      default:
        return [];
    }
  };
  const requests = getRequests();

  async function handleRemove(request_id: number) {
    const token = await getToken();
    setClientToken(token);
    dispatch(
      deleteFriendRequestThunk({
        request_id: request_id,
        type,
        curr_user_id,
      }),
    );
  }

  async function handleAccept(request_id: number) {
    const token = await getToken();
    setClientToken(token);
    dispatch(acceptFriendRequestThunk(request_id));
  }

  const isDeleting = (request_id: number) =>
    loading.deleting.includes(request_id);
  const isAccepting = (request_id: number) =>
    loading.accepting.includes(request_id);

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
          requests.length == 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
        }`}
      >
        {requests?.map((request, i) => {
          let button;
          const requestLoading =
            isDeleting(request.id) || isAccepting(request.id);

          switch (type) {
            case "my":
              button = (
                <button
                  onClick={handleRemove.bind(null, request.id)}
                  className="btn btn-ghost hover:btn-error rounded-lg"
                  disabled={requestLoading}
                >
                  {isDeleting(request.id) ? "Removing..." : "Remove"}
                </button>
              );
              break;

            case "received":
              button = (
                <div>
                  <button
                    onClick={handleAccept.bind(null, request.id)}
                    className="btn btn-ghost rounded-lg hover:btn-accent mr-1"
                    disabled={requestLoading}
                  >
                    {isAccepting(request.id) ? "Accepting..." : "Accept"}
                  </button>

                  <button
                    onClick={handleRemove.bind(null, request.id)}
                    className="btn btn-ghost rounded-lg hover:btn-error"
                    disabled={requestLoading}
                  >
                    {isDeleting(request.id) ? "Removing..." : "Ignore"}
                  </button>
                </div>
              );
              break;

            case "sent":
              button = (
                <button
                  onClick={handleRemove.bind(null, request.id)}
                  className="btn btn-ghost rounded-lg hover:btn-error inline-flex w-auto items-center"
                  disabled={requestLoading}
                >
                  {isDeleting(request.id) ? "Deleting..." : "Delete"}
                </button>
              );
              break;

            default:
              button = null;
          }

          const user =
            request.request_from.id == curr_user_id
              ? request.request_to
              : request.request_from;

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
