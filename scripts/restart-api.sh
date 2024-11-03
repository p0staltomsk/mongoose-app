#!/bin/bash

# Stop API container
docker-compose stop api

# Remove API container
docker-compose rm -f api

# Clean dist
rm -rf dist/*

# Rebuild and start API
docker-compose up -d api

# Show logs
docker-compose logs -f api 