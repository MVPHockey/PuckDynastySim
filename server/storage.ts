import {
  users, leagues, teams, players, games, chatMessages, tradeOffers,
  type User, type InsertUser, type League, type InsertLeague,
  type Team, type InsertTeam, type Player, type InsertPlayer,
  type Game, type InsertGame, type ChatMessage, type InsertChatMessage,
  type TradeOffer, type InsertTradeOffer
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // League methods
  getLeague(id: number): Promise<League | undefined>;
  getLeaguesByCommissioner(commissionerId: number): Promise<League[]>;
  createLeague(league: InsertLeague): Promise<League>;
  
  // Team methods
  getTeam(id: number): Promise<Team | undefined>;
  getTeamsByLeague(leagueId: number): Promise<Team[]>;
  getTeamsByGM(gmId: number): Promise<Team[]>;
  createTeam(team: InsertTeam): Promise<Team>;
  updateTeam(id: number, updates: Partial<Team>): Promise<Team>;
  
  // Player methods
  getPlayer(id: number): Promise<Player | undefined>;
  getPlayersByTeam(teamId: number): Promise<Player[]>;
  getPlayersByLeague(leagueId: number): Promise<Player[]>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  updatePlayer(id: number, updates: Partial<Player>): Promise<Player>;
  
  // Game methods
  getGame(id: number): Promise<Game | undefined>;
  getGamesByLeague(leagueId: number): Promise<Game[]>;
  createGame(game: InsertGame): Promise<Game>;
  updateGame(id: number, updates: Partial<Game>): Promise<Game>;
  
  // Chat methods
  getChatMessagesByLeague(leagueId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Trade methods
  getTradeOffersByTeam(teamId: number): Promise<TradeOffer[]>;
  createTradeOffer(offer: InsertTradeOffer): Promise<TradeOffer>;
  updateTradeOffer(id: number, updates: Partial<TradeOffer>): Promise<TradeOffer>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private leagues: Map<number, League> = new Map();
  private teams: Map<number, Team> = new Map();
  private players: Map<number, Player> = new Map();
  private games: Map<number, Game> = new Map();
  private chatMessages: Map<number, ChatMessage> = new Map();
  private tradeOffers: Map<number, TradeOffer> = new Map();
  
  private currentUserId = 1;
  private currentLeagueId = 1;
  private currentTeamId = 1;
  private currentPlayerId = 1;
  private currentGameId = 1;
  private currentChatId = 1;
  private currentTradeId = 1;

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample commissioner
    const commissioner: User = {
      id: this.currentUserId++,
      username: "commissioner",
      password: "$2b$10$abcdefghijk", // hashed password for "password"
      role: "commissioner",
      email: "commissioner@example.com",
      createdAt: new Date(),
    };
    this.users.set(commissioner.id, commissioner);

    // Create sample GM
    const gm: User = {
      id: this.currentUserId++,
      username: "gm_john",
      password: "$2b$10$abcdefghijk", // hashed password for "password"
      role: "gm",
      email: "john@example.com",
      createdAt: new Date(),
    };
    this.users.set(gm.id, gm);

    // Create sample league
    const league: League = {
      id: this.currentLeagueId++,
      name: "Elite Hockey League",
      commissionerId: commissioner.id,
      currentSeason: 1,
      currentDay: 32,
      salaryCap: 80000000,
      isActive: true,
      createdAt: new Date(),
    };
    this.leagues.set(league.id, league);

    // Create sample teams
    const bostonBears: Team = {
      id: this.currentTeamId++,
      leagueId: league.id,
      name: "Bears",
      city: "Boston",
      gmId: gm.id,
      tier: "pro",
      wins: 18,
      losses: 12,
      overtimeLosses: 2,
      goalsFor: 104,
      goalsAgainst: 89,
      budget: 80000000,
    };
    this.teams.set(bostonBears.id, bostonBears);

    const montrealHawks: Team = {
      id: this.currentTeamId++,
      leagueId: league.id,
      name: "Hawks",
      city: "Montreal",
      gmId: null,
      tier: "pro",
      wins: 17,
      losses: 13,
      overtimeLosses: 2,
      goalsFor: 98,
      goalsAgainst: 92,
      budget: 80000000,
    };
    this.teams.set(montrealHawks.id, montrealHawks);

    const torontoEagles: Team = {
      id: this.currentTeamId++,
      leagueId: league.id,
      name: "Eagles",
      city: "Toronto",
      gmId: null,
      tier: "pro",
      wins: 16,
      losses: 12,
      overtimeLosses: 3,
      goalsFor: 94,
      goalsAgainst: 88,
      budget: 80000000,
    };
    this.teams.set(torontoEagles.id, torontoEagles);

    const chicagoStorm: Team = {
      id: this.currentTeamId++,
      leagueId: league.id,
      name: "Storm",
      city: "Chicago",
      gmId: null,
      tier: "pro",
      wins: 15,
      losses: 14,
      overtimeLosses: 3,
      goalsFor: 91,
      goalsAgainst: 95,
      budget: 80000000,
    };
    this.teams.set(chicagoStorm.id, chicagoStorm);

    // Create sample players for Boston Bears
    const players = [
      {
        firstName: "Connor", lastName: "McDavid", position: "C", age: 26, jerseyNumber: 91,
        nationality: "Canada", overall: 96, skating: 95, shooting: 93, hands: 95, checking: 75, defense: 80,
        salary: 12500000, contractLength: 8, goals: 28, assists: 42, points: 70
      },
      {
        firstName: "Leon", lastName: "Draisaitl", position: "LW", age: 27, jerseyNumber: 29,
        nationality: "Germany", overall: 93, skating: 88, shooting: 95, hands: 92, checking: 82, defense: 78,
        salary: 8500000, contractLength: 6, goals: 24, assists: 38, points: 62
      },
      {
        firstName: "Kailer", lastName: "Yamamoto", position: "RW", age: 24, jerseyNumber: 56,
        nationality: "USA", overall: 84, skating: 90, shooting: 82, hands: 87, checking: 70, defense: 72,
        salary: 3100000, contractLength: 3, goals: 15, assists: 22, points: 37
      },
      {
        firstName: "Ryan", lastName: "Nugent-Hopkins", position: "C", age: 29, jerseyNumber: 93,
        nationality: "Canada", overall: 85, skating: 86, shooting: 84, hands: 88, checking: 75, defense: 85,
        salary: 5125000, contractLength: 5, goals: 12, assists: 28, points: 40
      },
      {
        firstName: "Darnell", lastName: "Nurse", position: "D", age: 28, jerseyNumber: 25,
        nationality: "Canada", overall: 87, skating: 85, shooting: 75, hands: 78, checking: 89, defense: 90,
        salary: 9250000, contractLength: 7, goals: 8, assists: 24, points: 32
      },
      {
        firstName: "Stuart", lastName: "Skinner", position: "G", age: 24, jerseyNumber: 74,
        nationality: "Canada", overall: 82, skating: 85, shooting: 60, hands: 88, checking: 70, defense: 95,
        salary: 2600000, contractLength: 3, goals: 0, assists: 2, points: 2
      }
    ];

    players.forEach(playerData => {
      const player: Player = {
        id: this.currentPlayerId++,
        leagueId: league.id,
        teamId: bostonBears.id,
        ...playerData
      };
      this.players.set(player.id, player);
    });

    // Create sample chat messages
    const chatMessage1: ChatMessage = {
      id: this.currentChatId++,
      leagueId: league.id,
      userId: gm.id,
      message: "Anyone interested in trading for a defenseman?",
      timestamp: new Date(Date.now() - 120000), // 2 minutes ago
    };
    this.chatMessages.set(chatMessage1.id, chatMessage1);

    const chatMessage2: ChatMessage = {
      id: this.currentChatId++,
      leagueId: league.id,
      userId: commissioner.id,
      message: "Great game last night! That overtime was intense.",
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    };
    this.chatMessages.set(chatMessage2.id, chatMessage2);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.currentUserId++,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  // League methods
  async getLeague(id: number): Promise<League | undefined> {
    return this.leagues.get(id);
  }

  async getLeaguesByCommissioner(commissionerId: number): Promise<League[]> {
    return Array.from(this.leagues.values()).filter(league => league.commissionerId === commissionerId);
  }

  async createLeague(insertLeague: InsertLeague): Promise<League> {
    const league: League = {
      ...insertLeague,
      id: this.currentLeagueId++,
      createdAt: new Date(),
    };
    this.leagues.set(league.id, league);
    return league;
  }

  // Team methods
  async getTeam(id: number): Promise<Team | undefined> {
    return this.teams.get(id);
  }

  async getTeamsByLeague(leagueId: number): Promise<Team[]> {
    return Array.from(this.teams.values()).filter(team => team.leagueId === leagueId);
  }

  async getTeamsByGM(gmId: number): Promise<Team[]> {
    return Array.from(this.teams.values()).filter(team => team.gmId === gmId);
  }

  async createTeam(insertTeam: InsertTeam): Promise<Team> {
    const team: Team = {
      ...insertTeam,
      id: this.currentTeamId++,
    };
    this.teams.set(team.id, team);
    return team;
  }

  async updateTeam(id: number, updates: Partial<Team>): Promise<Team> {
    const team = this.teams.get(id);
    if (!team) throw new Error("Team not found");
    const updatedTeam = { ...team, ...updates };
    this.teams.set(id, updatedTeam);
    return updatedTeam;
  }

  // Player methods
  async getPlayer(id: number): Promise<Player | undefined> {
    return this.players.get(id);
  }

  async getPlayersByTeam(teamId: number): Promise<Player[]> {
    return Array.from(this.players.values()).filter(player => player.teamId === teamId);
  }

  async getPlayersByLeague(leagueId: number): Promise<Player[]> {
    return Array.from(this.players.values()).filter(player => player.leagueId === leagueId);
  }

  async createPlayer(insertPlayer: InsertPlayer): Promise<Player> {
    const player: Player = {
      ...insertPlayer,
      id: this.currentPlayerId++,
    };
    this.players.set(player.id, player);
    return player;
  }

  async updatePlayer(id: number, updates: Partial<Player>): Promise<Player> {
    const player = this.players.get(id);
    if (!player) throw new Error("Player not found");
    const updatedPlayer = { ...player, ...updates };
    this.players.set(id, updatedPlayer);
    return updatedPlayer;
  }

  // Game methods
  async getGame(id: number): Promise<Game | undefined> {
    return this.games.get(id);
  }

  async getGamesByLeague(leagueId: number): Promise<Game[]> {
    return Array.from(this.games.values()).filter(game => game.leagueId === leagueId);
  }

  async createGame(insertGame: InsertGame): Promise<Game> {
    const game: Game = {
      ...insertGame,
      id: this.currentGameId++,
    };
    this.games.set(game.id, game);
    return game;
  }

  async updateGame(id: number, updates: Partial<Game>): Promise<Game> {
    const game = this.games.get(id);
    if (!game) throw new Error("Game not found");
    const updatedGame = { ...game, ...updates };
    this.games.set(id, updatedGame);
    return updatedGame;
  }

  // Chat methods
  async getChatMessagesByLeague(leagueId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(message => message.leagueId === leagueId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const message: ChatMessage = {
      ...insertMessage,
      id: this.currentChatId++,
      timestamp: new Date(),
    };
    this.chatMessages.set(message.id, message);
    return message;
  }

  // Trade methods
  async getTradeOffersByTeam(teamId: number): Promise<TradeOffer[]> {
    return Array.from(this.tradeOffers.values()).filter(
      offer => offer.fromTeamId === teamId || offer.toTeamId === teamId
    );
  }

  async createTradeOffer(insertOffer: InsertTradeOffer): Promise<TradeOffer> {
    const offer: TradeOffer = {
      ...insertOffer,
      id: this.currentTradeId++,
      createdAt: new Date(),
    };
    this.tradeOffers.set(offer.id, offer);
    return offer;
  }

  async updateTradeOffer(id: number, updates: Partial<TradeOffer>): Promise<TradeOffer> {
    const offer = this.tradeOffers.get(id);
    if (!offer) throw new Error("Trade offer not found");
    const updatedOffer = { ...offer, ...updates };
    this.tradeOffers.set(id, updatedOffer);
    return updatedOffer;
  }
}

export const storage = new MemStorage();
