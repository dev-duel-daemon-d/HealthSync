# ----------------------------
# Stage 1: Build the Frontend
# ----------------------------
FROM node:20-alpine as client-build

WORKDIR /app/client

# Copy client package files and install dependencies
COPY client/package*.json ./
RUN npm install

# Copy the rest of the client code
COPY client/ ./

# Build the React application (outputs to /dist)
RUN npm run build


# ----------------------------
# Stage 2: Setup the Server
# ----------------------------
FROM node:20-alpine

WORKDIR /app

# Copy server package files and install dependencies
COPY server/package*.json ./
RUN npm install --production

# Copy the server code
COPY server/ ./

# Copy the built React app from Stage 1 into the server's 'public' folder
COPY --from=client-build /app/client/dist ./public

# Expose the port the app runs on
EXPOSE 5000

# Set production environment
ENV NODE_ENV=production

# Start the server
CMD ["node", "server.js"]