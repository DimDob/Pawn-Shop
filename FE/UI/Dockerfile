FROM node:18.17.0 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install -g npm@10.9.0
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM nginx:1.24.0
RUN rm -rf /etc/nginx/conf.d/*
COPY --from=build /app/dist/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
