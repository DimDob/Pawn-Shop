# Step 1: Use the official Node.js image to build the Angular application
FROM node:18-alpine AS build

# Step 2: Set working directory in container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the Angular application code to the container
COPY . .

# Step 6: Build the Angular app
RUN npm run build

# Step 7: Use the official NGINX image to serve the Angular app
FROM nginx:alpine

# Step 8: Copy the build output from the previous stage to the NGINX container
# Променете този ред според името на вашето приложение в angular.json
COPY --from=build /app/dist/browser /usr/share/nginx/html

# Step 9: Expose port 80 to access the application
EXPOSE 80

# Step 10: Start NGINX server
CMD ["nginx", "-g", "daemon off;"]
