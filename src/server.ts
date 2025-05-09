// src/server.ts
import Fastify, { FastifyInstance, RouteShorthandOptions } from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";

// Initialize Fastify with built-in Pino-based logger
// Pino is a very fast JSON logger for Node.js
const server: FastifyInstance<Server, IncomingMessage, ServerResponse> =
  Fastify({
    logger: {
      level: "info", // Default level
      // You can customize pino options here, e.g., for pretty printing during development:
      // transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
    },
  });

// Declare a route for root path
server.get("/", async (request, reply) => {
  request.log.info("Request to root path received");
  return {
    message: "Welcome to the Node.js (Fastify + TypeScript) HTTP Server!",
  };
});

// Declare a route for /hello
interface HelloQuerystring {
  name?: string;
}

server.get<{ Querystring: HelloQuerystring }>(
  "/hello",
  async (request, reply) => {
    const name = request.query.name || "World";
    const greeting = `Hello, ${name} from Node.js (Fastify + TypeScript)!`;
    request.log.info(
      { query: request.query },
      `Greeting generated: ${greeting}`
    );
    return { message: greeting };
  }
);

// A simple 404 handler
server.setNotFoundHandler((request, reply) => {
  request.log.warn({ url: request.raw.url }, "Resource not found (404)");
  reply.code(404).send({
    error: "Not Found",
    message: `Route ${request.method}:${request.url} not found`,
  });
});

// Error handler (optional, Fastify has good defaults)
server.setErrorHandler((error, request, reply) => {
  request.log.error(error, "An error occurred");
  // Send error response
  reply.status(error.statusCode || 500).send({
    error: error.name || "Internal Server Error",
    message: error.message,
    // statusCode: error.statusCode || 500, // Redundant if using reply.status()
  });
});

// Start the server
const start = async () => {
  try {
    const port = 3001; // Different from Go (8080) and Rust (3000)
    await server.listen({ port: port, host: "0.0.0.0" }); // Listen on all available interfaces
    server.log.info(`Node.js (Fastify) server listening on port ${port}`);
  } catch (err) {
    server.log.error(err, "Error starting server");
    process.exit(1);
  }
};

start();
