export default function Header() {
    return (
      <header className="relative w-full h-16 border-b bg-white">
        {/* Left */}
        <span className="absolute left-6 top-1/2 -translate-y-1/2 font-semibold text-lg">
          HealthPulse
        </span>
  
        {/* Center */}
        <button className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-semibold text-lg">
          Dashboard
        </button>
      </header>
    );
  }
  