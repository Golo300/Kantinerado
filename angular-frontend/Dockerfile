### STAGE 1:BUILD ###
FROM node:alpine AS build

WORKDIR /dist/src/app

RUN npm cache clean --force

COPY . .

RUN npm install
RUN npm run build --prod


### STAGE 2:RUN IN NGINX ###
FROM nginx:alpine AS ngi

COPY --from=build /dist/src/app/dist/angular-frontend/browser /usr/share/nginx/html
COPY /nginx.conf  /etc/nginx/conf.d/default.conf

EXPOSE 80