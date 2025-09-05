# Step 1: Build the React app
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Serve with Nginx
FROM nginx
COPY --from=build /app/build /usr/share/nginx/html/



EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
# This Dockerfile builds a React application and serves it using Nginx.
# It uses a multi-stage build to keep the final image size small.