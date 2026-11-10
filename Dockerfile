# Use Node.js as the base image
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install project dependencies
RUN npm ci --omit=dev

# Copy the remaining project files
COPY . .

# Expose application port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]