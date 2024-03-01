# Verwenden Sie ein OpenJDK-Basisimage für Java 17
FROM openjdk:17-jdk-alpine AS build

# Arbeitsverzeichnis festlegen
WORKDIR /app

# Kopieren der Gradle-Build-Konfigurationen
COPY build.gradle .
COPY settings.gradle .
COPY gradlew .

# Kopieren des Gradle-Wrappers
COPY gradle ./gradle

# Kopieren des Quellcodes
COPY src ./src

# Download der Abhängigkeiten
RUN ./gradlew dependencies

# Kompilieren und bauen der Anwendung
RUN ./gradlew build

# Zweites Stage für das Ausführen der Anwendung
FROM openjdk:17-jdk-alpine

# Arbeitsverzeichnis festlegen
WORKDIR /app

# Kopieren des JARs aus der ersten Stage
COPY --from=build /app/build/libs/*.jar app.jar

# Starten der Anwendung
ENTRYPOINT ["java","-jar","app.jar"]
