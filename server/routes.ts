import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertUserSchema, insertChatMessageSchema } from "@shared/schema";
import bcrypt from "bcrypt";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket setup for real-time features
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  const clients = new Map<number, WebSocket>(); // userId -> WebSocket

  wss.on('connection', (ws) => {
    let userId: number | null = null;

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'auth') {
          userId = message.userId;
          clients.set(userId, ws);
        } else if (message.type === 'chat' && userId) {
          const chatMessage = await storage.createChatMessage({
            leagueId: message.leagueId,
            userId: userId,
            message: message.content,
          });
          
          // Broadcast to all clients in the same league
          const user = await storage.getUser(userId);
          for (const [clientUserId, clientWs] of clients) {
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({
                type: 'chat',
                message: {
                  ...chatMessage,
                  username: user?.username || 'Unknown',
                }
              }));
            }
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      if (userId) {
        clients.delete(userId);
      }
    });
  });

  // Authentication endpoints
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.json({ 
        user: { 
          id: user.id, 
          username: user.username, 
          role: user.role,
          email: user.email 
        } 
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      res.json({ 
        user: { 
          id: user.id, 
          username: user.username, 
          role: user.role,
          email: user.email 
        } 
      });
    } catch (error) {
      res.status(400).json({ message: "Registration failed" });
    }
  });

  // League endpoints
  app.get("/api/leagues", async (req, res) => {
    try {
      const { commissionerId } = req.query;
      if (commissionerId) {
        const leagues = await storage.getLeaguesByCommissioner(Number(commissionerId));
        res.json(leagues);
      } else {
        res.status(400).json({ message: "Commissioner ID required" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leagues" });
    }
  });

  app.get("/api/leagues/:id", async (req, res) => {
    try {
      const league = await storage.getLeague(Number(req.params.id));
      if (!league) {
        return res.status(404).json({ message: "League not found" });
      }
      res.json(league);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch league" });
    }
  });

  // Team endpoints
  app.get("/api/leagues/:leagueId/teams", async (req, res) => {
    try {
      const teams = await storage.getTeamsByLeague(Number(req.params.leagueId));
      res.json(teams);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch teams" });
    }
  });

  app.get("/api/teams/:id", async (req, res) => {
    try {
      const team = await storage.getTeam(Number(req.params.id));
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      res.json(team);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch team" });
    }
  });

  app.get("/api/users/:userId/teams", async (req, res) => {
    try {
      const teams = await storage.getTeamsByGM(Number(req.params.userId));
      res.json(teams);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user teams" });
    }
  });

  // Player endpoints
  app.get("/api/teams/:teamId/players", async (req, res) => {
    try {
      const players = await storage.getPlayersByTeam(Number(req.params.teamId));
      res.json(players);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch players" });
    }
  });

  // Chat endpoints
  app.get("/api/leagues/:leagueId/chat", async (req, res) => {
    try {
      const messages = await storage.getChatMessagesByLeague(Number(req.params.leagueId));
      const messagesWithUsers = await Promise.all(
        messages.map(async (message) => {
          const user = await storage.getUser(message.userId);
          return {
            ...message,
            username: user?.username || 'Unknown',
          };
        })
      );
      res.json(messagesWithUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  // Game simulation endpoints
  app.post("/api/games/simulate", async (req, res) => {
    try {
      const { homeTeamId, awayTeamId, leagueId } = req.body;
      
      // Simple game simulation
      const homeScore = Math.floor(Math.random() * 6) + 1;
      const awayScore = Math.floor(Math.random() * 6) + 1;
      
      const game = await storage.createGame({
        leagueId,
        homeTeamId,
        awayTeamId,
        homeScore,
        awayScore,
        period: 3,
        timeRemaining: "00:00",
        isFinished: true,
        scheduledDate: new Date(),
        playByPlay: [
          "Game started",
          `Goal! Home team scores: ${homeScore}-${awayScore}`,
          "Game finished"
        ],
      });

      // Update team records
      const homeTeam = await storage.getTeam(homeTeamId);
      const awayTeam = await storage.getTeam(awayTeamId);
      
      if (homeTeam && awayTeam) {
        if (homeScore > awayScore) {
          await storage.updateTeam(homeTeamId, { 
            wins: homeTeam.wins + 1,
            goalsFor: homeTeam.goalsFor + homeScore,
            goalsAgainst: homeTeam.goalsAgainst + awayScore,
          });
          await storage.updateTeam(awayTeamId, { 
            losses: awayTeam.losses + 1,
            goalsFor: awayTeam.goalsFor + awayScore,
            goalsAgainst: awayTeam.goalsAgainst + homeScore,
          });
        } else {
          await storage.updateTeam(awayTeamId, { 
            wins: awayTeam.wins + 1,
            goalsFor: awayTeam.goalsFor + awayScore,
            goalsAgainst: awayTeam.goalsAgainst + homeScore,
          });
          await storage.updateTeam(homeTeamId, { 
            losses: homeTeam.losses + 1,
            goalsFor: homeTeam.goalsFor + homeScore,
            goalsAgainst: homeTeam.goalsAgainst + awayScore,
          });
        }
      }

      res.json(game);
    } catch (error) {
      res.status(500).json({ message: "Failed to simulate game" });
    }
  });

  return httpServer;
}
