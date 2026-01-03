import Link from "next/link";
import Symptoms from "@/app/symptoms/page";


export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center text-center mt-32 gap-6">
      <h1 className="text-4xl font-bold">
        Track symptoms. Understand your health.
      </h1>

      <p className="text-lg text-gray-600 max-w-xl">
        HealthPulse helps you monitor symptoms, track disease progression,
        visualize health trends, and generate reports for healthcare providers.
      </p>

      <Link
        href="/symptoms"
        className="px-6 py-3 rounded-md bg-black text-white text-base"
      >
        Log Symptoms
      </Link>
    </main>

  )
}