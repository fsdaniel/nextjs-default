export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-blue-900 text-gray-800 dark:text-gray-100">
      <main className="container mx-auto px-6 py-20 md:py-32 flex flex-col md:flex-row items-center justify-between">

        {/* Text Content */}
        <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4 bg-gradient-to-r from-blue-600 to-teal-400 dark:from-blue-400 dark:to-teal-300 bg-clip-text text-transparent">
            Ignite Your Ideas
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
            Create, deploy, and scale your next big project with seamless workflows and powerful tools.
          </p>
          <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1">
            Get Started
          </button>
        </div>

        {/* Image/Illustration Placeholder */}
        <div className="md:w-1/2 flex justify-center md:justify-end">
          {/* === Placeholder: Replace with your Image or SVG === */}
          <div className="w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-teal-200 to-blue-300 dark:from-teal-700 dark:to-blue-800 rounded-full flex items-center justify-center shadow-xl">
            <svg className="w-1/2 h-1/2 text-blue-700 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            {/* Example using next/image: */}
            {/* <Image src="/your-illustration.svg" alt="Inspiring illustration" width={400} height={400} /> */}
          </div>
          {/* ================================================= */}
        </div>

      </main>
      {/* Optional: Add more sections below */}
    </div>
  );
}
