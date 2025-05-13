import Link from "next/link"; // Import Link for navigation

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-16">
      <Link href="/stream">
        <button className="relative group rounded-full px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-pink-600 hover:to-yellow-500 shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300">
          View Markdown Stream
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 opacity-30 blur-lg group-hover:opacity-60 group-hover:scale-125 transition-all duration-300 ease-out"></span>
          <span className="absolute bottom-0 left-0 right-0 text-center text-sm font-medium text-gray-100 group-hover:text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Click to start streaming
          </span>
        </button>
      </Link>
    </div>
  );
}
