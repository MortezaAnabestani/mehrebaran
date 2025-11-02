export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <h1 className="text-2xl font-bold">داشبورد</h1>
      <nav className="mt-8">
        <ul>
          <li>
            <a href="/" className="block py-2">
              صفحه اصلی
            </a>
          </li>
          <li>
            <a href="/tags" className="block py-2">
              مدیریت تگ‌ها
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
