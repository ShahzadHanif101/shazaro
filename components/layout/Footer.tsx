export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 px-4 py-4 md:px-6">
      <div className="flex flex-col items-center justify-between gap-2 text-xs text-slate-500 sm:flex-row">
        <span>© {new Date().getFullYear()} SHAZARO</span>

        <span>Version 1.0</span>
      </div>
    </footer>
  );
}
