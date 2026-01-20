import { serverApiFetch } from "@/lib/server-api-fetch";

export async function getAllJournals() {
  return serverApiFetch("journals/");
}

export async function getMyJournals() {
  return serverApiFetch("journals/my-journals/");
}

export async function getSharedWithMe() {
  return serverApiFetch("journals/shared-with-me/");
}

export async function getPublicJournals() {
  return serverApiFetch("journals/public/");
}

export async function getJournalDetail(journal_id: number) {
  return serverApiFetch(`journals/${journal_id}/`);
}
