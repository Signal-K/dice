# Dockerfile for Next.js

# Step 1: Build the app
FROM node:18 AS build

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy the app's source code
COPY . .

# Build the Next.js app
RUN yarn build

# Step 2: Create a production image
FROM node:18

WORKDIR /app

# Install only production dependencies
COPY --from=build /app/package.json /app/yarn.lock ./
RUN yarn install --production

# Copy built assets from the build stage
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

# Expose port 3000 for Next.js
EXPOSE 3000

# Start the Next.js application
CMD ["yarn", "start"]
