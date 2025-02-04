# Use an official Node runtime as a parent image
FROM node:20.18.1

# WORKDIR /app
# COPY . /app
# RUN npm install
# CMD ["npm", "start"]


# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all files
COPY . .

# Expose port 3000 and start the app
EXPOSE 3000
CMD ["npm", "start"]

