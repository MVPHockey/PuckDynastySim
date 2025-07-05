import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  ArrowRightLeft, 
  DollarSign,
  Trophy,
  Calendar,
  Star,
  MessageCircle
} from "lucide-react";

interface SidebarProps {
  currentPath: string;
}

export default function Sidebar({ currentPath }: SidebarProps) {
  const navigationItems = [
    {
      section: "General Manager",
      items: [
        { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/roster", icon: Users, label: "Roster Management" },
        { href: "/stats", icon: TrendingUp, label: "Team Stats" },
        { href: "/transactions", icon: ArrowRightLeft, label: "Transactions" },
        { href: "/finances", icon: DollarSign, label: "Finances" },
      ]
    },
    {
      section: "League",
      items: [
        { href: "/standings", icon: Trophy, label: "Standings" },
        { href: "/schedule", icon: Calendar, label: "Schedule" },
        { href: "/players", icon: Star, label: "Players" },
        { href: "/chat", icon: MessageCircle, label: "League Chat" },
      ]
    }
  ];

  return (
    <aside className="hidden lg:block w-64 bg-white shadow-sm border-r">
      <div className="p-4">
        <div className="space-y-6">
          {navigationItems.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {section.section}
              </h3>
              <nav className="space-y-1">
                {section.items.map((item) => {
                  const isActive = currentPath === item.href;
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <item.icon className="mr-3 h-4 w-4" />
                      {item.label}
                    </a>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
