#!/bin/bash

# Create dist directory if it doesn't exist
mkdir -p dist

# Set permissions for the project directory
sudo chown -R $USER:$USER .
sudo chmod -R 755 .

# Set specific permissions for dist directory
sudo chmod -R 777 dist

echo "Permissions fixed successfully!" 