# Laceverse - Key Highlights

1. **Full-Stack Development**: Developed a scalable web application using React (TypeScript) for the frontend, Node.js for the backend, and Prisma ORM for database management.

2. **Real-Time Collaboration**: Implemented a WebSocket-based real-time communication system, enabling users to interact seamlessly in shared digital environments.

3. **Modern Architecture**: Utilized a monorepo structure with Turborepo for efficient code sharing and management across frontend, backend, and shared packages.

4. **Type-Safe Codebase**: Established a robust TypeScript ecosystem across all layers, enhancing code quality and developer experience.

<<<<<<< HEAD
5. **Efficient Development Setup**: Configured a Docker-based development environment, facilitating rapid development and deployment cycles.
=======
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
>>>>>>> c177ff5335b60a0910b9eccd0399074cf4338f34
