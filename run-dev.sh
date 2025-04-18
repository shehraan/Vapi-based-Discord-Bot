#!/bin/bash

echo "Building Discord bot..."
npm run build

echo "Starting Discord bot in debug mode..."
export LOG_LEVEL=DEBUG
node dist/index.js