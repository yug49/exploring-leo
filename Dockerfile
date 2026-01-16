# Use Ubuntu as base for Leo CLI support
FROM ubuntu:22.04

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    build-essential \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install Leo from pre-built release
RUN curl -L https://github.com/ProvableHQ/leo/releases/download/v2.3.0/leo-v2.3.0-x86_64-unknown-linux-gnu.zip -o leo.zip \
    && unzip leo.zip -d /usr/local/bin \
    && chmod +x /usr/local/bin/leo \
    && rm leo.zip

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Set working directory
WORKDIR /app

# Copy package files from server folder
COPY server/package*.json ./

# Install dependencies
RUN npm install

# Copy source code from server folder
COPY server/ .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3001

# Start the server
CMD ["node", "dist/index.js"]
