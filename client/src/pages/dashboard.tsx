import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/auth";
import { useWebSocket } from "@/hooks/use-websocket";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import RosterOverview from "@/components/roster-overview";
import StandingsTable from "@/components/standings-table";
import ChatWidget from "@/components/chat-widget";
import LiveGameModal from "@/components/live-game-modal";
import MobileNavigation from "@/components/mobile-navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, DollarSign, Target, Calendar } from "lucide-react";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const currentUser = getCurrentUser();
  const [showLiveGame, setShowLiveGame] = useState(false);
  const { isConnected, sendMessage } = useWebSocket(currentUser?.id || null);

  useEffect(() => {
    if (!currentUser) {
      setLocation("/login");
      return;
    }
    if (currentUser.role === "commissioner") {
      setLocation("/commissioner");
      return;
    }
  }, [currentUser, setLocation]);

  const { data: userTeams } = useQuery({
    queryKey: ["/api/users/" + currentUser?.id + "/teams"],
    enabled: !!currentUser,
  });

  const { data: leagueTeams } = useQuery({
    queryKey: ["/api/leagues/1/teams"],
  });

  const { data: players } = useQuery({
    queryKey: ["/api/teams/" + (userTeams?.[0]?.id || 1) + "/players"],
    enabled: !!userTeams?.[0],
  });

  if (!currentUser) {
    return null;
  }

  const currentTeam = userTeams?.[0];
  const points = currentTeam ? (currentTeam.wins * 2) + currentTeam.overtimeLosses : 0;
  const gamesPlayed = currentTeam ? currentTeam.wins + currentTeam.losses + currentTeam.overtimeLosses : 0;
  const goalDiff = currentTeam ? currentTeam.goalsFor - currentTeam.goalsAgainst : 0;

  const handleSimulateGame = () => {
    setShowLiveGame(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={currentUser} leagueName="Elite Hockey League" />
      
      <div className="flex">
        <Sidebar currentPath="/dashboard" />
        
        <main className="flex-1 p-4 lg:p-8 pb-20 lg:pb-8">
          {/* Dashboard Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">General Manager Dashboard</h1>
                <p className="text-gray-600">
                  {currentTeam ? `${currentTeam.city} ${currentTeam.name} - Professional Division` : "No team assigned"}
                </p>
              </div>
              <div className="flex space-x-3">
                <Button onClick={handleSimulateGame} className="bg-primary hover:bg-primary/90">
                  <Target className="w-4 h-4 mr-2" />
                  Simulate Next Game
                </Button>
                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Record</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {currentTeam ? `${currentTeam.wins}-${currentTeam.losses}-${currentTeam.overtimeLosses}` : "0-0-0"}
                      </p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <Trophy className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Salary Cap</p>
                      <p className="text-2xl font-bold text-gray-900 font-mono">
                        ${currentTeam ? (currentTeam.budget / 1000000).toFixed(1) : "80.0"}M
                      </p>
                      <p className="text-xs text-gray-500">$1.8M remaining</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Goals Per Game</p>
                      <p className="text-2xl font-bold text-gray-900 font-mono">
                        {currentTeam && gamesPlayed > 0 ? (currentTeam.goalsFor / gamesPlayed).toFixed(2) : "0.00"}
                      </p>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-full">
                      <Target className="h-5 w-5 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Next Game</p>
                      <p className="text-lg font-bold text-gray-900">vs Chicago</p>
                      <p className="text-xs text-gray-500">Tomorrow 7:00 PM</p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Roster Overview */}
            <div className="lg:col-span-2">
              <RosterOverview players={players || []} />
            </div>

            {/* Sidebar Widgets */}
            <div className="space-y-6">
              {/* Recent Games */}
              <Card>
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold">Recent Games</h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between py-2 border-b">
                    <div className="flex items-center space-x-3">
                      <div className="text-xs text-gray-500">Dec 15</div>
                      <div className="text-sm">
                        <span className="font-medium">Boston</span>
                        <span className="mx-2 text-gray-400">vs</span>
                        <span>Montreal</span>
                      </div>
                    </div>
                    <div className="text-sm font-mono">
                      <span className="text-green-600 font-bold">4</span>
                      <span className="mx-1 text-gray-400">-</span>
                      <span>2</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <div className="flex items-center space-x-3">
                      <div className="text-xs text-gray-500">Dec 13</div>
                      <div className="text-sm">
                        <span>Toronto</span>
                        <span className="mx-2 text-gray-400">vs</span>
                        <span className="font-medium">Boston</span>
                      </div>
                    </div>
                    <div className="text-sm font-mono">
                      <span>1</span>
                      <span className="mx-1 text-gray-400">-</span>
                      <span className="text-green-600 font-bold">3</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Chat Widget */}
              <ChatWidget 
                leagueId={1} 
                currentUser={currentUser} 
                sendMessage={sendMessage}
                isConnected={isConnected}
              />

              {/* Trade Offers */}
              <Card>
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Trade Offers</h3>
                    <span className="bg-secondary text-white text-xs px-2 py-1 rounded-full">2 New</span>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="border rounded-lg p-3 bg-orange-50 border-orange-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">From: Chicago GM</span>
                      <span className="text-xs text-gray-500">1 hour ago</span>
                    </div>
                    <div className="text-sm text-gray-700 mb-3">
                      <strong>Wants:</strong> D. Kane (C)<br />
                      <strong>Offers:</strong> M. Toews (C) + 2024 2nd
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">Accept</Button>
                      <Button size="sm" variant="destructive">Reject</Button>
                      <Button size="sm" variant="outline">Counter</Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Standings Table */}
          <div className="mt-8">
            <StandingsTable teams={leagueTeams || []} />
          </div>
        </main>
      </div>

      <MobileNavigation currentPath="/dashboard" />
      
      {showLiveGame && (
        <LiveGameModal onClose={() => setShowLiveGame(false)} />
      )}
    </div>
  );
}
