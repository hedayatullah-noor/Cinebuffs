
export default function SkeletonCard() {
    return (
        <div
            className="flex flex-col w-full bg-gray-50 dark:bg-zinc-900 rounded-none overflow-hidden shadow-md border-2 border-black dark:border-white animate-pulse"
            style={{ aspectRatio: "1 / 1.75" }}
        >
            <div className="w-full h-2/3 bg-gray-200 dark:bg-zinc-800 relative" />
            <div className="flex flex-col flex-1 p-4 justify-between -mt-6 z-10 bg-white dark:bg-zinc-950 border-t-2 border-black dark:border-white">
                <div>
                    <div className="h-6 bg-gray-200 dark:bg-zinc-800 w-3/4 mb-3" />
                    <div className="h-4 bg-gray-100 dark:bg-zinc-900 w-1/4 mb-4" />
                </div>

                <div className="flex items-center gap-2 mt-auto border-t-2 border-gray-100 dark:border-zinc-800 pt-3">
                    <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-zinc-800" />
                    <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-1/3" />
                </div>
            </div>
        </div>
    );
}
