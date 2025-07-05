import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pause, FastForward, BarChart3, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface LiveGameModalProps {
  onClose: () => void;
}

interface PlayByPlayEntry {
  time: string;
  period: string;
  description: string;
  type: "goal" | "shot" | "penalty" | "neutral";
}

export default function LiveGameModal({ onClose }: LiveGameModalProps) {
  const [gameState, setGameState] = useState({
    homeTeam: { name: "Boston Bears", score: 0 },
    awayTeam: { name: "Chicago Storm", score: 0 },
    period: "1st Period",
    time: "20:00",
    isLive: false,
  });
  
  const [playByPlay, setPlayByPlay] = useState<PlayByPlayEntry[]>([]);
  const queryClient = useQueryClient();

  const simulateGameMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/games/simulate", {
      homeTeamId: 1,
      awayTeamId: 4,
      leagueId: 1,
    }),
    onSuccess: async (response) => {
      const game = await response.json();
      setGameState(prev => ({
        ...prev,
        homeTeam: { ...prev.homeTeam, score: game.homeScore },
        awayTeam: { ...prev.awayTeam, score: game.awayScore },
        period: "Final",
        time: "00:00",
        isLive: false,
      }));
      
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/leagues"] });
    },
  });

  useEffect(() => {
    // Start the simulation when modal opens
    if (!gameState.isLive) {
      setGameState(prev => ({ ...prev, isLive: true }));
      
      // Simulate play-by-play events
      const events = [
        { time: "19:30", period: "1st", description: "🏒 Face-off won by Boston Bears", type: "neutral" as const },
        { time: "18:45", period: "1st", description: "🏒 Shot by Connor McDavid (Boston) - Save by Corey Crawford (Chicago)", type: "shot" as const },
        { time: "17:22", period: "1st", description: "⚡ Penalty: Slashing - Jonathan Toews (Chicago) - 2 minutes", type: "penalty" as const },
        { time: "16:58", period: "1st", description: "🥅 GOAL! Connor McDavid (18) assisted by Leon Draisaitl (24). Boston leads 1-0.", type: "goal" as const },
        { time: "15:30", period: "1st", description: "🏒 Shot by Patrick Kane (Chicago) - Save by Stuart Skinner (Boston)", type: "shot" as const },
      ];

      let eventIndex = 0;
      const interval = setInterval(() => {
        if (eventIndex < events.length) {
          setPlayByPlay(prev => [events[eventIndex], ...prev]);
          
          if (events[eventIndex].type === "goal") {
            if (events[eventIndex].description.includes("Boston")) {
              setGameState(prev => ({
                ...prev,
                homeTeam: { ...prev.homeTeam, score: prev.homeTeam.score + 1 }
              }));
            } else {
              setGameState(prev => ({
                ...prev,
                awayTeam: { ...prev.awayTeam, score: prev.awayTeam.score + 1 }
              }));
            }
          }
          
          eventIndex++;
        } else {
          clearInterval(interval);
          // Trigger final simulation
          simulateGameMutation.mutate();
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, []);

  const getPlayTypeColor = (type: string) => {
    switch (type) {
      case "goal": return "border-l-4 border-green-500 bg-green-50";
      case "penalty": return "border-l-4 border-red-500 bg-red-50";
      case "shot": return "border-l-4 border-yellow-500 bg-yellow-50";
      default: return "border-l-4 border-gray-300 bg-white";
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <DialogTitle>Live Game Simulation</DialogTitle>
              {gameState.isLive && (
                <Badge variant="destructive" className="animate-pulse">
                  LIVE
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{gameState.homeTeam.name}</div>
                <div className="text-3xl font-bold font-mono">{gameState.homeTeam.score}</div>
              </div>
              <div className="text-gray-400 text-xl">VS</div>
              <div className="text-center">
                <div className="text-2xl font-bold">{gameState.awayTeam.name}</div>
                <div className="text-3xl font-bold font-mono">{gameState.awayTeam.score}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">{gameState.period}</div>
              <div className="text-2xl font-mono">{gameState.time}</div>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 bg-gray-50 rounded-lg p-4">
          <div className="space-y-3">
            {playByPlay.map((play, index) => (
              <div key={index} className={`p-3 rounded ${getPlayTypeColor(play.type)}`}>
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium font-mono text-sm">{play.time}</span>
                  <span className="text-xs text-gray-500">{play.period}</span>
                </div>
                <p className="text-sm">{play.description}</p>
              </div>
            ))}
            {playByPlay.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <p>Game starting...</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex space-x-3 pt-4 border-t">
          <Button variant="outline" disabled={!gameState.isLive}>
            <Pause className="h-4 w-4 mr-2" />
            Pause
          </Button>
          <Button variant="outline" disabled={!gameState.isLive}>
            <FastForward className="h-4 w-4 mr-2" />
            Fast Forward
          </Button>
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Game Stats
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
