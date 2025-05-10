# Node.js Hello World HTTP Server (Fastify + TypeScript, Dockerized)

A simple "Hello, World!" HTTP server built with Node.js, the Fastify web framework, and TypeScript. This project is containerized with Docker for consistent deployment and demonstrates:

- Basic HTTP server setup using Fastify.
- Type safety and modern JavaScript features with TypeScript.
- Routes for `/` and `/hello` (which accepts a `name` query parameter).
- Structured JSON logging via Fastify's built-in Pino logger.
- Containerization with Docker.
- Serving via a reverse proxy (Caddy) with automatic HTTPS on a VPS.

## Key Technologies

- Node.js (Targeting v22.x, or your chosen version)
- Fastify (v5.x.x)
- TypeScript (v5.x.x)
- Docker & Docker Compose
- Caddy (as the reverse proxy on the host VPS)
- npm (for dependency management)

## Deployed Application (Target)

Once deployed to the VPS, the application will be accessible at a URL similar to:

➡️ **[https://node.skatebit.app](https://node.skatebit.app)**

### Endpoints (Target Live URL)

- `GET https://node.skatebit.app/`
  - Displays: `{"message":"Welcome to the Node.js (Fastify + TypeScript) HTTP Server!"}`
- `GET https://node.skatebit.app/hello`
  - Responds with: `{"message":"Hello, World from Node.js (Fastify + TypeScript)!"}`
- `GET https://node.skatebit.app/hello?name=User`
  - Responds with: `{"message":"Hello, User from Node.js (Fastify + TypeScript)!"}`

## Running for Local Development (Using Docker)

This is the recommended way to run the application locally for development and testing to ensure consistency with the deployed environment.

### Prerequisites (Local Development)

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for Windows/macOS) or Docker Engine (for Linux) installed.
- Git (for cloning the repository).

### Steps

1.  **Clone the repository (if you haven't already):**

    ```bash
    git clone [https://github.com/ShawnEdgell/http-node.git](https://github.com/ShawnEdgell/http-node.git)
    cd http-node
    ```

2.  **Build the Docker image:**
    From the project's root directory (where the `Dockerfile` is):

    ```bash
    docker build -t http-node-app-local .
    ```

3.  **Run the Docker container:**
    This command maps port `3002` on your local machine to port `3001` in the container (as the Node.js app listens on 3001).

    ```bash
    docker run -d -p 3002:3001 --name my-node-test-container http-node-app-local
    ```

    - `-d`: Run in detached mode (background).
    - `-p 3002:3001`: Map host port to container port.
    - `--name my-node-test-container`: Give the container a name.

4.  **Access locally:**
    Open your browser and go to:

    - `http://localhost:3002`
    - `http://localhost:3002/hello`
    - `http://localhost:3002/hello?name=Test`

5.  **To view logs:**

    ```bash
    docker logs my-node-test-container
    ```

6.  **To stop and remove the local test container:**
    ```bash
    docker stop my-node-test-container
    docker rm my-node-test-container
    ```

## Native Local Development (Alternative for Quick Iteration)

You can also run the application natively for rapid development iteration before building the Docker image:

1.  Ensure Node.js and npm are installed locally.
2.  Install dependencies: `npm install`
3.  Run the development server (uses `nodemon` and `ts-node` for auto-rebuild on changes):
    ```bash
    npm run dev
    ```
    The server will typically start on `http://localhost:3001`.

## Deployment Overview (on VPS)

This application is deployed on a Virtual Private Server (VPS) using:

- **Docker:** The Node.js/TypeScript application is containerized using the `Dockerfile` in this project.
- **Docker Compose:** The application is run as a service defined in a centralized `docker-compose.yml` file (typically located in `~/projects/` on the VPS), which manages all deployed application containers.
- **Caddy:** Acts as a reverse proxy on the VPS, routing traffic from `https://node.skatebit.app` (or your chosen subdomain) to the running Docker container and automatically handling SSL/TLS certificates.

## Project Structure (This Repository)

- `src/server.ts`: Main application code where the Fastify server is defined and routes are registered.
- `package.json`: Defines project metadata, dependencies, and npm scripts.
- `package-lock.json`: Records exact versions of dependencies for reproducible `npm ci` installs.
- `tsconfig.json`: Configuration file for the TypeScript compiler.
- `Dockerfile`: Instructions to build the Docker image for this specific application.
- `.dockerignore`: Specifies files to exclude from the Docker build context.
- `.gitignore`: Specifies intentionally untracked files that Git should ignore.
- `README.md`: This file.

---
