#!/bin/bash

# Stop and remove containers
docker-compose down

# Remove volumes
docker volume rm periodic-mongodb_data periodic-node_modules

# Clean build artifacts
rm -rf dist/*

# Rebuild and start
docker-compose up -d

# Wait for MongoDB to start
echo "Waiting for MongoDB to start..."
sleep 10

# Initialize database
pnpm initdb

# Show logs
docker-compose logs -f api