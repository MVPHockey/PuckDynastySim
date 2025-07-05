import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Trophy, 
  ArrowRightLeft, 
  MessageCircle 
} from "lucide-react";

interface MobileNavigationProps {
  currentPath: string;
}

export default function MobileNavigation({ currentPath }: MobileNavigationProps) {
  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/roster", icon: Users, label: "Roster" },
    { href: "/standings", icon: Trophy, label: "Standings" },
    { href: "/transactions", icon: ArrowRightLeft, label: "Trades" },
    { href: "/chat", icon: MessageCircle, label: "Chat" },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-10">
      <div className="flex">
        {navItems.map((item) => {
          const isActive = currentPath === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "flex-1 text-center py-3 transition-colors",
                isActive ? "text-primary" : "text-gray-400"
              )}
            >
              <item.icon className="h-5 w-5 mx-auto block" />
              <span className="text-xs mt-1 block">{item.label}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
