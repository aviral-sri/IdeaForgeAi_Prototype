import { IdeaForgeForm } from "@/components/idea-forge-form"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-orange-50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-center">
          <img src="/logo.png" alt="IdeaForge AI Logo" className="h-16 w-16" />
          <h1 className="ml-3 text-3xl font-bold text-blue-900">IdeaForge AI</h1>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-lg md:p-8">
          <IdeaForgeForm />
        </div>
      </div>
    </main>
  )
}
