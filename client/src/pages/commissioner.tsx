import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/auth";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Settings, Play } from "lucide-react";

export default function Commissioner() {
  const [, setLocation] = useLocation();
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!currentUser) {
      setLocation("/login");
      return;
    }
    if (currentUser.role !== "commissioner") {
      setLocation("/dashboard");
      return;
    }
  }, [currentUser, setLocation]);

  const { data: leagues } = useQuery({
    queryKey: ["/api/leagues"],
    queryFn: () => fetch(`/api/leagues?commissionerId=${currentUser?.id}`).then(r => r.json()),
    enabled: !!currentUser,
  });

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={currentUser} leagueName="Commissioner Portal" />
      
      <main className="max-w-7xl mx-auto p-4 lg:p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Commissioner Dashboard</h1>
              <p className="text-gray-600">Manage your hockey leagues and settings</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Create New League
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Leagues</p>
                  <p className="text-2xl font-bold text-gray-900">{leagues?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Play className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Simulations Today</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Settings className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total GMs</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leagues List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Leagues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leagues?.map((league: any) => (
                <div key={league.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{league.name}</h3>
                      <p className="text-sm text-gray-600">
                        Season {league.currentSeason} • Day {league.currentDay}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={league.isActive ? "default" : "secondary"}>
                        {league.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Manage
                      </Button>
                    </div>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No leagues created yet</p>
                  <p className="text-sm">Create your first league to get started</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
