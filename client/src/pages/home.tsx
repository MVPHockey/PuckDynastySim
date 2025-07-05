import { useEffect } from "react";
import { useLocation } from "wouter";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const [, setLocation] = useLocation();
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === "commissioner") {
        setLocation("/commissioner");
      } else {
        setLocation("/dashboard");
      }
    }
  }, [currentUser, setLocation]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">🏒</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Puck Dynasty Sim</CardTitle>
          <CardDescription>
            Comprehensive hockey league management platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 text-center">
            Manage your hockey teams, simulate games, and build your dynasty!
          </p>
          <div className="space-y-2">
            <Button 
              className="w-full" 
              onClick={() => setLocation("/login")}
            >
              Get Started
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
