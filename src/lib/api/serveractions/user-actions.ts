import { serverApiFetch } from "@/lib/server-api-fetch";

export async function getUsersList() {
  return serverApiFetch(`users/`);
}
export async function getUserDetail(user_id: number) {
  return serverApiFetch(`users/${user_id}/`);
}
export async function getMyProfile() {
  return serverApiFetch(`users/my-profile/`);
}
export async function getDiscoverFriendsList() {
  return serverApiFetch(`users/discover/`);
}
