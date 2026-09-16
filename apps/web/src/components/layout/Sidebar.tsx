import { NavLink } from "react-router-dom";
import { navigationItems } from "../../config/navigation";
import { useAuth } from "../../context/AuthContext";

export const Sidebar = () => {
  const { user } = useAuth();

  const visibleItems = navigationItems.filter(
    (item) => user && item.roles.includes(user.role),
  );

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-white md:block">
      <div className="flex h-full min-h-[calc(100vh-73px)] flex-col p-4">
        <nav className="space-y-1">
          {visibleItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};
