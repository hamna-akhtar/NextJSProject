import { serverApiFetch } from "@/lib/server-api-fetch";

export async function getFriendRequestsList() {
  return serverApiFetch(`friend-requests/`);
}
export async function getSentRequestsList() {
  return serverApiFetch(`friend-requests/sent`);
}
export async function getReceivedRequestsList() {
  return serverApiFetch(`friend-requests/received`);
}
