#!/bin/bash

# Check if API is running
check_api() {
  curl -s http://localhost:4567/api/elements > /dev/null
  return $?
}

# Restart API if needed
if ! check_api; then
  echo "API is not responding, restarting..."
  docker-compose restart api
  
  # Wait for API to come up
  for i in {1..30}; do
    if check_api; then
      echo "API is now running"
      exit 0
    fi
    echo "Waiting for API to start... ($i/30)"
    sleep 2
  done
  
  echo "API failed to start"
  docker-compose logs api
  exit 1
else
  echo "API is running"
fi 