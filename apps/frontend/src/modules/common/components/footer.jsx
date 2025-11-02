export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-8 px-4 mt-16 border-t border-black" style={{backgroundColor: '#FEFBF3'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-gaming border border-black rounded-full"></div>
            <div className="w-2 h-2 bg-coral border border-black rounded-full"></div>
            <div className="w-2 h-2 bg-blue-gaming border border-black rounded-full"></div>
          </div>
          <p className="text-center text-sm text-black font-bold">
            &copy; {currentYear} Team Secret — Jeff, Ian and Dillan
          </p>         
        </div>
      </div>
    </footer>
  );
}
