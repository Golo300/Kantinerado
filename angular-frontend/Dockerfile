FROM node:alpine AS build
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm ci
RUN npx ng build

FROM nginx:latest
COPY --from=build /usr/src/app/dist/angular-frontend/browser /usr/share/nginx/html

