# Use official Node.js image as the base for the build stage
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files to the container
COPY package.json package-lock.json ./

# Install dependencies including Prisma CLI
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Set the WORKDIR to src for the build process
WORKDIR /app/src

# Build the TypeScript code
RUN npm run build

# Go back to the app root for further commands
WORKDIR /app

# Run Prisma generation (from the project root where prisma folder is)
RUN npx prisma generate --schema=./prisma/schema.prisma

# Remove devDependencies for production
RUN npm prune --production

# Use a lightweight image for the final stage
FROM node:18-alpine

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set the working directory inside the container
WORKDIR /app

# Copy only the production dependencies and the built code from the previous stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

# Copy the production environment file explicitly
COPY .env.production ./

# Set ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to the non-root user
USER appuser

# Expose the port the app runs on
EXPOSE 8010

# Start the application
CMD ["node", "dist/index.js"]
