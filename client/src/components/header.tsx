import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { logout, type User } from "@/lib/auth";
import { Bell, Menu, X, LogOut } from "lucide-react";

interface HeaderProps {
  user: User;
  leagueName: string;
}

export default function Header({ user, leagueName }: HeaderProps) {
  const [, setLocation] = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <header className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <span className="text-2xl">🏒</span>
            <h1 className="text-xl font-bold">Puck Dynasty Sim</h1>
            <Badge variant="secondary" className="hidden sm:block bg-white/20 text-white">
              {leagueName}
            </Badge>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <a href="#dashboard" className="hover:text-gray-200 transition-colors">Dashboard</a>
            <a href="#teams" className="hover:text-gray-200 transition-colors">Teams</a>
            <a href="#standings" className="hover:text-gray-200 transition-colors">Standings</a>
            <a href="#schedule" className="hover:text-gray-200 transition-colors">Schedule</a>
            <a href="#transactions" className="hover:text-gray-200 transition-colors">Transactions</a>
          </nav>

          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative p-2 hover:bg-white/10 text-white"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-secondary text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Button>
            
            <div className="hidden sm:flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">{user.username[0].toUpperCase()}</span>
              </div>
              <span className="text-sm">{user.username}</span>
              <Badge variant="secondary" className="bg-secondary text-white">
                {user.role.toUpperCase()}
              </Badge>
            </div>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="hidden sm:flex hover:bg-white/10 text-white"
            >
              <LogOut className="h-4 w-4" />
            </Button>

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-white/20 py-4">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2 px-2 py-1">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">{user.username[0].toUpperCase()}</span>
                </div>
                <span className="text-sm">{user.username}</span>
                <Badge variant="secondary" className="bg-secondary text-white">
                  {user.role.toUpperCase()}
                </Badge>
              </div>
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="justify-start text-white hover:bg-white/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
