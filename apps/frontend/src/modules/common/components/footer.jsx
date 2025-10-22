export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-900 text-white py-8 px-4 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
            <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
          </div>
          <p className="text-center text-sm text-slate-400">
            &copy; {currentYear} Team Secret — Jeff, Ian and Dillan
          </p>
          <p className="text-center text-xs text-slate-500">
            Made with ❤️ for bingo lovers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
