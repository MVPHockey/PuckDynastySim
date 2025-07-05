# 🏒 Puck Dynasty Sim (PDS)

Welcome to the **Puck Dynasty Sim (PDS)**! This is a comprehensive web-based platform designed for hockey enthusiasts to create, manage, and participate in their own simulated hockey leagues. Commissioners control the league, while General Managers (GMs) lead their teams through multiple tiers of play, including Pro, Farm, and AI-managed Junior leagues. All the thrilling game action is delivered through detailed, real-time textual play-by-play.

## ✨ Core Features

* **Multi-Tier League System:** Simulate a realistic hockey ecosystem with interconnected Pro, Farm, and independent Junior leagues.
* **Commissioner Tools:** Full administrative control over league settings, user management, and season progression.
* **General Manager Dashboard:** Empower GMs to manage all aspects of their Pro and Farm teams, including rosters, lines, strategies, finances, and transactions.
* **Dynamic Player System:** Fictional player generation with realistic names, nationalities, age progression, and a detailed rating system that influences development and performance.
* **Contract & Financial System:** In-depth player contracts, salary cap management, team finances, arena upgrades, and training expenditures.
* **Automated Scheduling & Simulation:** Generate balanced schedules and run daily game simulations with detailed textual play-by-play.
* **Comprehensive Transaction System:** Robust draft (initial dispersal & annual entry), trade (players, picks, cash), and waiver systems.
* **Real-time Communication:** In-app league chat, private messages, and game-specific chat during live viewing (via WebSockets).
* **Intelligent AI Management:** AI-controlled teams for unassigned Pro teams and all Junior teams, handling roster, lines, and basic free agency.
* **Rich Public-Facing Content:** Detailed standings, player/team statistics, power rankings, injury reports, and more.
* **Per-League Data Isolation:** Each league operates on its own dedicated SQLite database file for enhanced data integrity and backup capabilities.

## 🚀 Technical Stack

* **Backend:** **Python (Django)**
    * **Django Framework:** Provides a robust MVC-like structure for handling requests, managing data models (ORM), and building complex business logic.
    * **Django REST Framework (DRF):** (Likely for API endpoints) To serve JSON data to the frontend for interactive features.
    * **Django Channels:** For real-time communication (WebSockets) for chat, notifications, and live game updates.
    * **Celery (or similar):** For asynchronous tasks like daily simulations and background processing, especially important for shared hosting.
* **Frontend:** **Vanilla JavaScript, HTML, CSS**
    * **HTML:** For structuring the web page.
    * **CSS:** For comprehensive styling and layout, including responsive design with mobile-specific layouts.
    * **Vanilla JavaScript:** For all client-side interactivity, sending requests to the Django backend (using `fetch` API), and dynamically updating the display.
    * **WebSockets API:** Used by JavaScript to connect to Django Channels for real-time features.
* **Database:** **SQLite**
    * **Main Database:** A central SQLite database (e.g., `main_auth.sqlite3`) for user registration, authentication, and top-level league information.
    * **Per-League Databases:** A separate SQLite database file is generated for *each individual league* (`league_XYZ.sqlite3`) to store its specific game data, players, teams, etc. This requires dynamic database routing in Django.
* **Hosting:** Designed for **Shared Hosting Environments**
    * Emphasis on efficient resource management, background task processing, and robust database handling for multiple SQLite files.

## ⚙️ Key Architectural & Design Considerations

* **Dynamic Database Routing:** Implementing a custom Django database router to direct queries to the correct league-specific SQLite database based on the active league context (e.g., determined by URL, session, or user's league choice).
* **Concurrency Management (SQLite):** Strategies to handle potential SQLite file locking issues during high-write operations across multiple league databases, especially during daily simulations and active GM interactions.
* **Asynchronous Tasks:** Utilizing Celery (or a similar task queue) and a scheduler (like `django-celery-beat` or a system cron job) to manage CPU-intensive tasks like daily simulations, preventing web requests from timing out and improving responsiveness.
* **File System Organization:** A robust system for creating, managing, and backing up individual league SQLite database files within the project structure.
* **Resource Optimization:** Efficient Python code, optimized database queries, and intelligent caching to stay within shared hosting CPU/memory/I/O limits.
* **Security:** Robust authentication with password hashing, role-based authorization, server-side input validation, and Django's built-in CSRF/XSS protections.
* **Scalability Path:** The architecture supports a clear migration path to more powerful hosting (e.g., VPS, dedicated server) and potentially a different database solution (like PostgreSQL/MySQL with multi-tenancy) if the user base grows significantly.

## 📁 File Structure (Conceptual - Django Project)


/hockey-league-sim/
├── manage.py
├── hockey_league_sim/       # Main Django Project Directory
│   ├── init.py
│   ├── settings.py          # Project settings (includes database router config)
│   ├── urls.py              # Main URL routing
│   ├── wsgi.py
│   └── asgi.py              # For Django Channels
├── core/                    # Django app for core features (auth, league management)
│   ├── init.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py            # User, League models (stored in main_auth.sqlite3)
│   ├── views.py             # User authentication, league creation/selection
│   ├── urls.py
│   ├── forms.py
│   └── routing.py           # Django Channels routing
├── game_engine/             # Django app for core simulation logic, players, teams
│   ├── init.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py            # Player, Team, Game, Contract, etc. (per-league DB)
│   ├── views.py             # API endpoints for GM interactions, game simulation
│   ├── urls.py
│   ├── management/
│   │   └── commands/
│   │       └── simulate_day.py # Custom management command for daily sim
│   └── sim_logic/           # Pure Python modules for game algorithms (AI, physics)
│       ├── init.py
│       ├── player_development.py
│       ├── game_simulator.py
│       └── ai_manager.py
├── transactions/            # Django app for draft, trade, waiver systems
│   ├── init.py
│   ├── models.py
│   ├── views.py
│   └── urls.py
├── finance/                 # Django app for financial system
│   ├── init.py
│   ├── models.py
│   ├── views.py
│   └── urls.py
├── communications/          # Django app for chat & notifications
│   ├── init.py
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   ├── consumers.py         # Django Channels consumers for WebSockets
│   └── routing.py
├── templates/               # HTML templates (served by Django)
│   ├── base.html
│   ├── core/
│   ├── gm/
│   ├── public/
│   └── admin/
├── static/                  # Static assets (CSS, JS, images)
│   ├── css/
│   │   ├── style.css
│   │   └── mobile.css       # Mobile-specific overrides
│   ├── js/
│   │   ├── main.js          # General interactivity, AJAX calls
│   │   ├── chat.js          # WebSocket communication for chat
│   │   └── live_game.js     # WebSocket communication for live play-by-play
│   └── img/
├── media/                   # User-uploaded media (if any, e.g., team logos)
├── data/                    # Directory to store league-specific SQLite files
│   ├── main_auth.sqlite3    # Main authentication database
│   ├── league_1.sqlite3     # Example: database for league ID 1
│   └── league_2.sqlite3     # Example: database for league ID 2
├── .env                     # Environment variables (e.g., database credentials)
├── .gitignore
├── requirements.txt         # Python dependencies
├── celery_worker.py         # Celery worker configuration
└── README.md                # This file!

## 📈 Development Phases

### Phase 1: Core Infrastructure & Admin Basics
* **Django Project Setup:** Initialize project, configure main settings (`settings.py`).
* **Database Routing:** Implement the custom Django database router to handle `main_auth.sqlite3` and dynamic league-specific SQLite files.
* **User Authentication:** Django's built-in User model, login, registration, password management.
* **League Creation:** Commissioner can create a new league, which triggers the creation of a new SQLite file for that league.
* **Basic Admin Dashboard:** Commissioner can view created leagues and assign GMs.
* **Initial Data Generation:** Simple tools within Django admin or management commands for generating initial teams, players, and coaches for a *single selected league*.

### Phase 2: Game Logic & GM Core
* **Game Models:** Define Django models for `Player`, `Team`, `Game`, `RosterEntry`, etc., ensuring they route to the correct league database.
* **Roster & Line Management:** GM interface for setting rosters, lines, and basic strategies, saving to the league DB.
* **Simulation Engine (Basic):** Core Python functions to simulate individual plays, periods, and full games with basic textual output. Integrate with Django views to trigger.
* **Schedule Generation:** Generate a basic regular season schedule.
* **Statistics Tracking:** Initial implementation of box scores and basic player/team stats models.

### Phase 3: Transactional & Financial Systems
* **Contract System:** Models and logic for player contracts, rookie contracts, and salary cap enforcement.
* **Free Agency:** Basic offseason free agency process.
* **Draft System:** Implement initial dispersal draft and annual entry draft logic and UI.
* **Team Finances:** Models and views for revenue (ticket sales), arena upgrades, training expenses.
* **Trade & Waiver Systems:** Models, views, and simple UI for real-time trade offers and waiver claims.

### Phase 4: Real-time Interaction & AI
* **Django Channels Setup:** Configure Channels for WebSockets.
* **Communication System:** Implement real-time league chat, private messages, and game chat using WebSockets.
* **AI Management:** Develop AI logic within your game engine to manage unassigned Pro teams and all Junior teams (roster moves, line setting, basic free agency).
* **Live Game Viewing:** Stream real-time play-by-play text updates via WebSockets during games.

### Phase 5: Polish, Advanced Features & Deployment
* **Advanced Statistics:** Comprehensive player and team statistics, leaderboards, hot/cold streaks.
* **Public Pages:** Fully functional standings, schedule, team/player profiles.
* **Mobile Responsiveness:** Implement detailed mobile-specific layouts and optimizations.
* **Performance Optimization:** Database indexing, query optimization, Celery task distribution.
* **Subscription System:** Integration with a payment gateway (e.g., Stripe, PayPal) for league registration fees.
* **Automated Simulation:** Implement Celery Beat (or a system cron job) to trigger daily `simulate_day` management command.
* **Deployment:** Prepare Django for shared hosting (might require specific `passenger` or `mod_wsgi` configurations and careful handling of static/media files and Celery workers).

## 🤝 Contributing

This project is an ambitious undertaking! If you're interested in contributing to the codebase, feature ideas, or documentation, please feel free to open issues or pull requests.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE). (Create a `LICENSE` file in the root directory).

## 📞 Contact

For questions, feedback, or collaboration inquiries:
* Your Name: [Your Name/Alias]
* GitHub: [Link to your GitHub Profile] 
