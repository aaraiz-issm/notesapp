FROM node:21

WORKDIR /app

# Copy dependency definitions
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port your app listens on (3000 internally)
EXPOSE 3000

# Start the app using your development command
CMD ["node", "server.js"]
