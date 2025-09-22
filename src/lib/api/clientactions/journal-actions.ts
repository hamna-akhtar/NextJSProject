import { clientApiFetch } from "@/lib/client-api-fetch";
import { MiniUser } from "@/lib/interfaces";
import toast from "react-hot-toast";

export async function removeUserFromSharedTo(
  journal_id: number,
  user_id: number,
) {
  const journal = await clientApiFetch(`/journals/${journal_id}/`);

  const updatedSharedTo = journal.shared_to
    .map((u: MiniUser) => u.id)
    .filter((id: number) => id !== user_id);

  let access;
  if (updatedSharedTo.length === 0) {
    access = "private";
  } else {
    access = "custom";
  }

  await clientApiFetch(`/journals/${journal_id}/`, {
    method: "PATCH",
    body: JSON.stringify({ shared_to: updatedSharedTo, access: access }),
  });
}

export async function updateJournal(journal_id: number, formData: FormData) {
  try {
    const title = formData.get("title");
    const content = formData.get("content");
    const shared_to = formData.getAll("shared_to");
    const access = formData.get("access");

    const updated_journal = await clientApiFetch(`/journals/${journal_id}/`, {
      method: "PUT",
      body: JSON.stringify({
        title: title,
        content: content,
        access: access,
        shared_to: shared_to,
      }),
    });
    return updated_journal;
  } catch (err) {
    // console.error("Error updating journal:", err);
    toast(`Something went wrong: ${err}`);
    return;
  }
}

export async function createJournal(formData: FormData) {
  try {
    const title = formData.get("title");
    const content = formData.get("content");
    const shared_to = formData.getAll("shared_to");
    const access = formData.get("access");

    await clientApiFetch("journals/", {
      method: "POST",
      body: JSON.stringify({ title, content, access, shared_to }),
    });
    toast("Created!");
  } catch (err) {
    // console.error("Error creating journal:", err);
    toast(`Something went wrong: ${err}`);
  }
}

export async function deleteJournal(journal_id: number) {
  return clientApiFetch(`journals/${journal_id}/`, { method: "DELETE" });
}

export async function deleteTask(task_id: number) {
  return clientApiFetch(`tasks/${task_id}/`, { method: "DELETE" });
}
