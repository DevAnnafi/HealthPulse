import Link from "next/link";
export default function SymptomsLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <section className="min-h-screen">
        {children}
      </section>
    );
  }
  