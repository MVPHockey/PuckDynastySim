# Puck Dynasty Sim - Development Guide

## Overview

This is a comprehensive hockey league simulation platform built as a full-stack web application. The system allows users to create and manage simulated hockey leagues, with support for commissioners and general managers. The application features real-time communication, game simulation, player management, and a complete transaction system.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state, React hooks for local state
- **Routing**: Wouter for client-side routing
- **Real-time**: WebSocket integration for live features
- **Build Tool**: Vite for development and bundling

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **API Design**: RESTful endpoints with WebSocket support
- **Real-time**: WebSocket server for chat and live updates
- **Data Layer**: Drizzle ORM with PostgreSQL

### Database Architecture
- **Primary Database**: PostgreSQL with Drizzle ORM
- **Schema**: Centralized schema definition in `shared/schema.ts`
- **Migration**: Drizzle Kit for database migrations
- **Connection**: Neon serverless PostgreSQL adapter

## Key Components

### Authentication & Authorization
- Role-based access control (Commissioner vs General Manager)
- JWT-based session management
- Protected routes with automatic redirection
- Local storage for client-side auth state

### Real-time Features
- WebSocket connection management (`useWebSocket` hook)
- Live chat system with league-specific channels
- Real-time game updates and notifications
- Connection state management with reconnection logic

### Game Simulation
- Automated game scheduling and simulation
- Live game viewing with play-by-play updates
- Game state management and persistence
- Statistical tracking and analysis

### User Interface
- Responsive design with mobile-first approach
- Component-based architecture using shadcn/ui
- Dark/light theme support via CSS variables
- Mobile navigation with bottom tab bar
- Desktop sidebar navigation

### League Management
- Multi-league support with data isolation
- Commissioner tools for league administration
- Team and player management interfaces
- Financial tracking and salary cap management

## Data Flow

### Client-Server Communication
1. **HTTP Requests**: Standard REST API calls for CRUD operations
2. **WebSocket**: Real-time bidirectional communication for chat and live updates
3. **Query Caching**: TanStack Query manages server state with intelligent caching
4. **Optimistic Updates**: Client-side state updates for better UX

### Database Operations
1. **Schema Definition**: Centralized in `shared/schema.ts` using Drizzle ORM
2. **Query Execution**: Type-safe database queries with Drizzle
3. **Transaction Management**: ACID compliance for critical operations
4. **Data Validation**: Zod schemas for runtime type checking

### Real-time Data Flow
1. **WebSocket Connection**: Established on user login with authentication
2. **Message Broadcasting**: Server broadcasts to relevant league participants
3. **State Synchronization**: Client state updates based on real-time events
4. **Connection Recovery**: Automatic reconnection with state restoration

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React, React DOM, React Router (Wouter)
- **TypeScript**: Full type safety across frontend and backend
- **Vite**: Modern build tool with HMR and optimizations

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Headless UI components for accessibility
- **shadcn/ui**: Pre-built component library
- **Lucide React**: Icon library

### Backend Dependencies
- **Express.js**: Web application framework
- **WebSocket (ws)**: Real-time communication
- **bcrypt**: Password hashing and security
- **Drizzle ORM**: Type-safe database ORM

### Database and Infrastructure
- **PostgreSQL**: Primary database system
- **Neon**: Serverless PostgreSQL provider
- **Drizzle Kit**: Database migration and management tools

### Development Tools
- **TypeScript Compiler**: Type checking and compilation
- **ESBuild**: Fast JavaScript bundler for production
- **PostCSS**: CSS processing with Autoprefixer

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with HMR
- **Database**: Local PostgreSQL or Neon development instance
- **Environment Variables**: `.env` file for local configuration

### Production Build
- **Frontend**: Vite build process generates optimized static assets
- **Backend**: ESBuild bundles server code for Node.js deployment
- **Database**: Production PostgreSQL instance with connection pooling

### Deployment Targets
- **Replit**: Primary development and hosting platform
- **Vercel/Netlify**: Alternative static hosting for frontend
- **Railway/Render**: Backend hosting options
- **Neon**: Managed PostgreSQL hosting

### Environment Configuration
- **Database URL**: Configured via `DATABASE_URL` environment variable
- **Production Mode**: `NODE_ENV=production` for optimizations
- **Build Scripts**: Separate scripts for development and production

## Changelog

```
Changelog:
- July 05, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```