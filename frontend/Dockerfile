FROM node:21

WORKDIR /app

# Copy dependency definitions
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the internal port (3000)
EXPOSE 3000

# Start the app (adjust the command if needed)
CMD ["npm", "run", "start"]
