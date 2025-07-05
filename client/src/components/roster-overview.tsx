import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Save } from "lucide-react";

interface Player {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  age: number;
  jerseyNumber: number | null;
  nationality: string;
  overall: number;
  goals: number;
  assists: number;
  points: number;
}

interface RosterOverviewProps {
  players: Player[];
}

export default function RosterOverview({ players }: RosterOverviewProps) {
  const [activeTab, setActiveTab] = useState<"forwards" | "defense" | "goalies">("forwards");

  const forwards = players.filter(p => ["C", "LW", "RW"].includes(p.position));
  const defense = players.filter(p => p.position === "D");
  const goalies = players.filter(p => p.position === "G");

  const getPositionColor = (position: string) => {
    switch (position) {
      case "C": return "bg-blue-100 text-blue-800";
      case "LW": case "RW": return "bg-green-100 text-green-800";
      case "D": return "bg-purple-100 text-purple-800";
      case "G": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const renderPlayerCard = (player: Player) => (
    <div key={player.id} className="bg-white p-3 rounded border">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
          {player.jerseyNumber || "?"}
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm">{player.firstName} {player.lastName}</p>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className={getPositionColor(player.position)}>
              {player.position}
            </Badge>
            <span className="text-xs text-gray-500 font-mono">{player.overall} OVR</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderForwardLines = () => {
    const lines = [];
    for (let i = 0; i < forwards.length; i += 3) {
      const line = forwards.slice(i, i + 3);
      if (line.length > 0) {
        lines.push(
          <div key={i} className="border rounded-lg p-4 bg-gray-50">
            <h4 className="text-sm font-medium text-gray-600 mb-3">Line {Math.floor(i / 3) + 1}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {line.map(renderPlayerCard)}
              {/* Fill empty spots */}
              {Array.from({ length: 3 - line.length }).map((_, idx) => (
                <div key={`empty-${idx}`} className="bg-gray-100 p-3 rounded border border-dashed border-gray-300">
                  <div className="text-center text-gray-400 text-sm">Empty Spot</div>
                </div>
              ))}
            </div>
          </div>
        );
      }
    }
    return lines;
  };

  const currentPlayers = activeTab === "forwards" ? forwards : activeTab === "defense" ? defense : goalies;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Roster Overview</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="bg-gray-100 text-gray-700">
              Pro Team
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-500">
              Farm Team
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            className={`flex-1 text-sm font-medium py-2 px-3 rounded-md transition-colors ${
              activeTab === "forwards" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:bg-white/50"
            }`}
            onClick={() => setActiveTab("forwards")}
          >
            Forwards
          </button>
          <button
            className={`flex-1 text-sm font-medium py-2 px-3 rounded-md transition-colors ${
              activeTab === "defense" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:bg-white/50"
            }`}
            onClick={() => setActiveTab("defense")}
          >
            Defense
          </button>
          <button
            className={`flex-1 text-sm font-medium py-2 px-3 rounded-md transition-colors ${
              activeTab === "goalies" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:bg-white/50"
            }`}
            onClick={() => setActiveTab("goalies")}
          >
            Goalies
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === "forwards" ? (
            renderForwardLines()
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentPlayers.map(renderPlayerCard)}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit Lines
          </Button>
          <Button size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save Lineup
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
