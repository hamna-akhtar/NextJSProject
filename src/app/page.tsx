import { getAllJournals } from "@/lib/api/serveractions/journal-actions"; 
import Dashboard from "@/components/dashboard";


// default home page
export default async function Home() {
  const journals = await getAllJournals();


  return (
    <div className="w-full h-full bg-black/[0.96] antialiased flex flex-col">
      <div className="flex flex-col min-h-screen w-screen">
          <Dashboard journals={journals} />
      </div>
    </div>
  );
}
