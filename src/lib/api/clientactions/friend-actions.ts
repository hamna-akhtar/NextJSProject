import { clientApiFetch } from "@/lib/client-api-fetch";

// removes friend itself
export async function deleteFriendRequest(request_id: number) {
  return clientApiFetch(`friend-requests/${request_id}/`, { method: "DELETE" });
}

// adds friend itself
export async function acceptFriendRequest(request_id: number) {
  return clientApiFetch(`friend-requests/${request_id}/`, {
    method: "PUT",
    body: JSON.stringify({ accepted: true }),
  });
}
export async function createFriendRequest(request_to_id: number) {
  return clientApiFetch(`friend-requests/`, {
    method: "POST",
    body: JSON.stringify({ send_request_to: request_to_id }),
  });
}
