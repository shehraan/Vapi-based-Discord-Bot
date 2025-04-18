#!/bin/bash

echo "Building Discord bot..."
npm run build

echo "Starting Discord bot..."
node dist/index.js