# Verwenden Sie ein Basisimage mit Node.js, um Angular-Anwendungen zu erstellen
FROM node:20.0.0 AS build

# Setzen Sie das Arbeitsverzeichnis im Container
WORKDIR /app

# Kopieren Sie die Abhängigkeiten in das Arbeitsverzeichnis
COPY package.json package-lock.json ./

# Installieren Sie die Abhängigkeiten
RUN npm install

# Kopieren Sie den Rest der Anwendung
COPY . .

# Erstellen Sie die Angular-Anwendung
RUN npm run build

# Verwenden Sie ein schlankes Basisimage für die Bereitstellung
FROM nginx:alpine

# Kopieren Sie die erstellte Angular-Anwendung in das Nginx-Verzeichnis
COPY --from=build /app/dist/* /usr/share/nginx/html/

# Ändern Sie die Standardkonfiguration von Nginx, um Anfragen zu bedienen
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Port, auf dem Nginx läuft (Standard: 80)
EXPOSE 80

# Befehl, der beim Starten des Containers ausgeführt wird
CMD ["nginx", "-g", "daemon off;"]