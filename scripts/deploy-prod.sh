#!/bin/bash

# Build the app
pnpm build

# Copy to production
sudo cp -r dist/client/* /var/www/html/mongoose-app/dist/client/

# Fix permissions
sudo chown -R www-data:www-data /var/www/html/mongoose-app
sudo chmod -R 755 /var/www/html/mongoose-app

# Restart Nginx
sudo systemctl restart nginx

# Show status
sudo systemctl status nginx 