#!/bin/bash

# Build the Docker image
docker build -t your-image-name:your-image-tag .

# Run the Docker container
docker run -d -p 3000:3000 -p 6379:6379 --name your-container-name your-image-name:your-image-tag
