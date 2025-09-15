export function TabsSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black/[0.96]">
      <div className="flex w-[80vw] max-w-7xl flex-col items-center justify-center gap-10 h-[75vh]">
        <div className="skeleton w-3/4 h-[10vh]" />
        <div className="skeleton w-full h-[70vh] bg-gray-800" />
      </div>
    </div>
  );
}

export function UserDetailSkeleton() {
  return (
    <section className="relative w-screen h-screen bg-black/[0.96] antialiased flex flex-col gap-10 justify-center items-center snap-start">
      {/* heading skeleton */}
      <div className="mt-20 pb-5 px-10">
        <div className="h-12 w-96 bg-gray-700/50 rounded-lg animate-pulse"></div>
      </div>

      {/* profile skeleton */}
      <div className="flex flex-col w-[70%] max-w-5xl bg-gray-800 rounded-2xl px-10">
        <div className="my-auto flex flex-col p-10 px-10 space-y-4">
          {/* email skeleton */}
          <div className="flex flex-row justify-between items-center">
            <div className="h-8 w-20 bg-gray-600/50 rounded animate-pulse"></div>
            <div className="h-6 w-48 bg-gray-600/50 rounded animate-pulse"></div>
          </div>

          {/* firstname skeleton */}
          <div className="flex flex-row justify-between items-center">
            <div className="h-8 w-28 bg-gray-600/50 rounded animate-pulse"></div>
            <div className="h-6 w-32 bg-gray-600/50 rounded animate-pulse"></div>
          </div>

          {/* lastname skeleton */}
          <div className="flex flex-row justify-between items-center">
            <div className="h-8 w-24 bg-gray-600/50 rounded animate-pulse"></div>
            <div className="h-6 w-36 bg-gray-600/50 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* loading indicator */}
      <div className="absolute bottom-10 flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gray-700/50">
        <div className="w-5 h-5 bg-gray-500/50 rounded-full animate-pulse"></div>
        <div className="h-4 w-16 bg-gray-500/50 rounded animate-pulse"></div>
      </div>
    </section>
  );
}

export function JournalDetailSkeleton() {
  return (
    <section className="relative w-screen h-screen bg-black/[0.96] antialiased overflow-auto">
      <div className="flex flex-col items-center justify-center mx-20 mt-30">
        {/* title skeleton */}
        <div className="h-[6vh] w-[50vw] bg-gray-700/50 rounded-lg animate-pulse  mb-10"></div>

        {/* author + date skeleton */}
        <div className="flex flex-col items-center justify-center gap-3 ">
          <div className="h-[3vh] w-[30vw] bg-gray-600/50 rounded animate-pulse mb-10"></div>

          <div className="flex flex-row items-center justify-center gap-5 mb-10">
            <div className="h-[3vh] w-[6vw] bg-gray-600/50 rounded animate-pulse"></div>
            <div className="h-[3vh] w-[6vw] bg-gray-600/50 rounded animate-pulse"></div>
          </div>
        </div>
        {/* content skeleton */}
        <div className=" skeleton w-[65vw] h-[50vh] bg-gray-700/50 mb-10"></div>
      </div>
    </section>
  );
}

export function JournalFormSkeleton() {
  return (
    <section className="w-screen min-h-screen antialiased flex items-center justify-center bg-black/[0.96]">
      <div className="flex flex-col w-[80%] max-w-7xl">
        {/* heading skeleton */}
        <div className="flex justify-center p-10 mt-20">
          <div className="h-[5vh] w-[20vw] bg-gray-700/50 rounded-lg animate-pulse"></div>
        </div>

        {/* form skeleton */}
        <div className="my-auto rounded-lg bg-zinc-800 p-10 space-y-6">
          {/* title input skeleton */}
          <div className="space-y-2">
            <div className="h-[3vh] w-[10vw] bg-gray-600/50 rounded animate-pulse"></div>
            <div className="h-[6vh] w-full bg-zinc-950 rounded animate-pulse"></div>
          </div>

          {/* content textarea skeleton */}
          <div className="space-y-2">
            <div className="h-[3vh] w-[10vw] bg-gray-600/50 rounded animate-pulse"></div>
            <div className="h-[20vh] w-full bg-zinc-950 rounded animate-pulse"></div>
          </div>

          {/* access select skeleton */}
          <div className="space-y-2">
            <div className="h-[3vh] w-[10vw] bg-gray-600/50 rounded animate-pulse"></div>
            <div className="h-[6vh] w-full bg-zinc-950 rounded animate-pulse"></div>
          </div>
        </div>

        {/* buttons skeleton */}
        <div className="my-5 flex justify-end">
          <div className="h-[6vh] w-[10vw] bg-gray-700/50 rounded animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
