#!/bin/bash

# Set execute permissions for vite.js
chmod +x frontend/node_modules/.bin/vite
chmod +x frontend/node_modules/vite/bin/vite.js

# Run the build command
npm run build
