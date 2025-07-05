import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Team {
  id: number;
  name: string;
  city: string;
  wins: number;
  losses: number;
  overtimeLosses: number;
  goalsFor: number;
  goalsAgainst: number;
}

interface StandingsTableProps {
  teams: Team[];
}

export default function StandingsTable({ teams }: StandingsTableProps) {
  // Calculate additional stats and sort by points
  const teamsWithStats = teams.map((team) => {
    const gamesPlayed = team.wins + team.losses + team.overtimeLosses;
    const points = (team.wins * 2) + team.overtimeLosses;
    const goalDiff = team.goalsFor - team.goalsAgainst;
    
    return {
      ...team,
      gamesPlayed,
      points,
      goalDiff,
    };
  }).sort((a, b) => b.points - a.points);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>League Standings</CardTitle>
          <div className="flex space-x-2">
            <Button size="sm" className="bg-primary text-white">
              Eastern
            </Button>
            <Button size="sm" variant="ghost" className="text-gray-500">
              Western
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Team
                </th>
                <th className="px-6 py-3 text-center font-medium text-gray-500 uppercase tracking-wider">
                  GP
                </th>
                <th className="px-6 py-3 text-center font-medium text-gray-500 uppercase tracking-wider">
                  W
                </th>
                <th className="px-6 py-3 text-center font-medium text-gray-500 uppercase tracking-wider">
                  L
                </th>
                <th className="px-6 py-3 text-center font-medium text-gray-500 uppercase tracking-wider">
                  OT
                </th>
                <th className="px-6 py-3 text-center font-medium text-gray-500 uppercase tracking-wider">
                  PTS
                </th>
                <th className="px-6 py-3 text-center font-medium text-gray-500 uppercase tracking-wider">
                  GF
                </th>
                <th className="px-6 py-3 text-center font-medium text-gray-500 uppercase tracking-wider">
                  GA
                </th>
                <th className="px-6 py-3 text-center font-medium text-gray-500 uppercase tracking-wider">
                  DIFF
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teamsWithStats.map((team, index) => (
                <tr 
                  key={team.id} 
                  className={cn(
                    "hover:bg-gray-50 transition-colors",
                    index === 0 && "bg-green-50"
                  )}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-900">{index + 1}.</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-primary rounded-full"></div>
                        <span className="font-medium">{team.city} {team.name}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-mono">{team.gamesPlayed}</td>
                  <td className="px-6 py-4 text-center font-mono">{team.wins}</td>
                  <td className="px-6 py-4 text-center font-mono">{team.losses}</td>
                  <td className="px-6 py-4 text-center font-mono">{team.overtimeLosses}</td>
                  <td className="px-6 py-4 text-center font-mono font-bold">{team.points}</td>
                  <td className="px-6 py-4 text-center font-mono">{team.goalsFor}</td>
                  <td className="px-6 py-4 text-center font-mono">{team.goalsAgainst}</td>
                  <td className={cn(
                    "px-6 py-4 text-center font-mono",
                    team.goalDiff > 0 ? "text-green-600" : team.goalDiff < 0 ? "text-red-600" : "text-gray-600"
                  )}>
                    {team.goalDiff > 0 ? "+" : ""}{team.goalDiff}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
