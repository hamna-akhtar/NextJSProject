import { IconPointFilled } from "@tabler/icons-react";
import { UsersList } from "@/components/users-list";
import { JournalAuthorButtons } from "@/components/journal-author-buttons";
import { getJournalDetail } from "@/lib/api/serveractions/journal-actions";
import { getMyProfile } from "@/lib/api/serveractions/user-actions";

export async function JournalDetail({ journal_id }: { journal_id: number }) {
  const [journal, curr_user] = await Promise.all([
    getJournalDetail(journal_id),
    getMyProfile(),
  ]);

  const isAuthor = curr_user.id == journal.author.id;
  return (
    <div className="w-screen h-screen bg-black/[0.96] antialiased overflow-auto">
      <div className="flex flex-col items-center justify-center mx-20 mt-20">
        {/* title */}
        <p className="uppercase relative z-20 text-center bg-gradient-to-b  from-neutral-200 to-neutral-500 bg-clip-text pt-15 pb-7 text-6xl font-bold text-transparent">
          {journal.title}
        </p>

        {/* author and date */}
        <div className="pb-15 flex flex-col justify-center items-center">
          <p className="flex flex-row items-center justify-center text-3xl  text-neutral-400">
            by {journal.author.first_name} {journal.author.last_name}
            <IconPointFilled className="mx-4" size={12} />
            {journal.created_at}
            <IconPointFilled className="mx-4" size={12} />
            {journal.access == "custom" ? "shared" : journal.access}
          </p>
          {isAuthor && <JournalAuthorButtons journal_id={journal.id} />}
        </div>

        {/* content  */}
        <div className="pb-10">
          <div className="max-w-7xl md:max-w-6xl sm:max-w-3xl text-justify leading-loose text-xl text-neutral-400">
            {journal.content}
          </div>

          {/* shared to list if custom access*/}
          {journal.access === "custom" && (
            <div className="w-full overflow-hidden relative rounded-2xl p-10 max-w-6xl mx-auto  my-10 ">
              <p className=" flex justify-center mb-10 text-3xl text-neutral-400">
                Shared With
              </p>
              <UsersList users_list={journal.shared_to} type={"journal"} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
