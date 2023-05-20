FROM node:16 as build

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

FROM nginx:1.23-alpine

COPY --from=build /app/build /usr/share/nginx/html

COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
