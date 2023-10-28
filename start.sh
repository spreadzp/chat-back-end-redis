#!/bin/sh

# Function to display usage information
usage() {
  echo "Usage: $0 [OPTIONS] [COMMAND]"
  echo "Options:"
  echo "  --help, -h            Display this help message"
  echo "  --service-name=NAME   Specify the name of the Docker service (e.g., my-app)"
  echo "  --redis-host=HOST     Specify the Redis host (e.g., redis-service)"
  echo "  --port=PORT           Specify the port for the Express.js server (e.g., 3000)"
  echo "Command: Specify the command to run"
  exit 1
}

# Default values
SERVICE_NAME="my-app"
REDIS_HOST="redis-service"
PORT="3000"

# Parse command-line arguments
while [ "$#" -gt 0 ]; do
  case "$1" in
    -h | --help)
      usage
      ;;
    --service-name=*)
      SERVICE_NAME="${1#*=}"
      ;;
    --redis-host=*)
      REDIS_HOST="${1#*=}"
      ;;
    --port=*)
      PORT="${1#*=}"
      ;;
    *)
      break
      ;;
  esac
  shift
done

# Remaining arguments are the command to run
CMD="$@"

# Display information
echo "Service Name: $SERVICE_NAME"
echo "Redis Host: $REDIS_HOST"
echo "Express.js Port: $PORT"
echo "Command to Run: $CMD"

# Start the Docker container with the specified command
docker run -it --rm -e REDIS_HOST=$REDIS_HOST -p $PORT:$PORT --name $SERVICE_NAME your-image-name $CMD
