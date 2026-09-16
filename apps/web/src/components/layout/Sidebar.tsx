import { NavLink } from "react-router-dom";
import { navigationItems } from "../../config/navigation";
import { useAuth } from "../../context/AuthContext";
import { useTotalUnreadMessageCount } from "../../hooks/useConversations";

export const Sidebar = () => {
  const { user } = useAuth();

  const { data: totalUnreadMessages = 0 } = useTotalUnreadMessageCount();

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
                `flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <span>{item.label}</span>

              {item.label === "Messages" && totalUnreadMessages > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1.5 text-xs font-semibold text-white">
                  {totalUnreadMessages > 99 ? "99+" : totalUnreadMessages}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};
