# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json & package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build project
RUN npm run build

# Expose port backend (sama dengan docker-compose)
EXPOSE 2000

# Run app
CMD ["node", "dist/main.js"]