export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-[#2C2C2C] text-white py-4 px-4">
      <p className="text-center text-sm text-gray-300">
        &copy; {currentYear} Team Secret — Jeff, Ian and Dillan
      </p>
    </footer>
  );
}
