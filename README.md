# Laceverse - Collaborative Virtual Space

## About
Laceverse is a modern, real-time collaborative virtual space platform that enables users to interact, collaborate, and create in shared digital environments. Built with scalability and performance in mind, it offers a seamless experience across web platforms.

## Overview
Laceverse is a full-stack application consisting of:
- **Frontend**: Interactive user interface built with React and TypeScript
- **Backend**: REST API for core application logic
- **WebSocket Server**: Real-time communication layer
- **Database**: Persistent data storage with Prisma ORM
- **Shared Packages**: Reusable components and configurations

## Tech Stack
### Core Technologies
- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: Prisma ORM, PostgreSQL
- **Real-time**: WebSocket, Room-based architecture
- **Build System**: Turborepo, pnpm

### Infrastructure
- Docker
- Nginx
- CI/CD ready

## Features
- Real-time collaboration
- User authentication and authorization
- Room-based interaction system
- Customizable avatars
- Responsive UI with Tailwind CSS
- Type-safe codebase with TypeScript
- Scalable architecture

## Installation & Contribution
### Prerequisites
- Node.js (v18+)
- pnpm
- Docker
- PostgreSQL

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/laceverse.git
   cd laceverse-code
   ```

2. Install dependencies: each one by one 
   ```bash
   cd apps/fe  && npm install
   cd apps/http  && npm install
   cd apps/web_sockets  && npm install
   ```

3. Set up environment variables:
   - Create `.env` files in `apps/fe`, `apps/http`, and `apps/web_sockets`
   - Refer to `.env.example` for required variables

4. Start the development environment:
   ```bash
   docker-compose up -d
   pnpm dev
   ```

### Contribution Guidelines
1. Fork the repository
2. Create a new branch for your feature/bugfix
3. Follow the existing code style and patterns
4. Write tests for new features
5. Submit a pull request with a clear description

## Project Structure
```
laceverse-code/
├── apps/
│   ├── fe/               # Frontend application
│   ├── http/             # REST API
│   └── web_sockets/      # WebSocket server
├── packages/
│   ├── db/               # Database layer
│   ├── eslint-config/    # ESLint configurations
│   ├── typescript-config/ # TypeScript configurations
│   └── ui/               # Shared UI components
└── docker-compose.yml    # Docker configuration
```

## Acknowledgements
- Vite for fast frontend development
- Tailwind CSS for utility-first styling
- Prisma for type-safe database access
- Turborepo for monorepo management
- WebSocket for real-time communication

## License
[MIT License](LICENSE)
