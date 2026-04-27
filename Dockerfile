# Step 1: Build the React app
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Serve with Nginx
FROM nginx:alpine

# Since your logs show 'react-scripts build', the output is in 'build'
COPY --from=build /app/build /usr/share/nginx/html/

# Copy your custom nginx.conf to handle MP4 MIME types and Range requests
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]