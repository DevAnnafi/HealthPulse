import SymptomForm from "@/components/ui/forms/SymptomForm";

export default function SymptomsPage() {
  return (
    <main className="min-h-screen flex flex-col items-center mt-16 px-6">
      {/* Page Title */}
      <h1 className="text-3xl font-semibold mb-8">
        Log Your Symptoms
      </h1>

      {/* Placeholder Form */}
      <SymptomForm />
    </main>
  );
}
