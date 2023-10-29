# Use the official Node.js image as the base
FROM node:14

# Set the working directory for your application
WORKDIR /app

# Copy package.json and package-lock.json to the image
COPY package*.json ./

# Install application dependencies
RUN npm install

# Install Redis server
RUN apt-get update && apt-get install -y redis-server

# Copy your application source code to the image
COPY . .

# Expose the ports for your application and Redis
EXPOSE 3000
EXPOSE 6379

# Command to run both your application and Redis
CMD [ "npm", "start" ]
