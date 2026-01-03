import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full h-16 border-b bg-white">
      <div className="max-w-7xl mx-left h-full flex items-center justify-between px-6">
        {/* Far Left */}
        <span className="font-semibold text-lg">
          HealthPulse
        </span>
      </div>
    </header>
  );
}
