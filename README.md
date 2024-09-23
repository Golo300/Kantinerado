# Kantinderado

Semester Projekt für das 3/4 Semester. Einfache Kantinen App für eine mittelständische Firma mit Benutzerverwaltung.

## Git Workflow

### Branches

* Für jede Userstorie wird ein eigener Branch angelegt.

* Branchname:`#<userstory-id>-<Beschriebung mit - getrennt>`

* Alle Branches gehen immer von 'main' aus.

### Commits

* Für jede Task sollte ein einzelner Commit erfolgen.
* Commitmessage fast die getätigten Änderungen zusammen

### Mergen

Vor jedem Merge muss ein Rebase auf auf 'main' erfolgen. Der Build und Test in der CI/CD Pipeline muss erfolgreich sein, sowie ein approvel durch ein Code Review. Das mergen in 'main' erfolgt erst nach erfolgreichem Abschluss der Userstorie. Megen erfolg über Squash-Merge.

## Definition of Done (DoD)

Intern im Team wurden die folgenden Kriterien definiert, damit eine Aufgabe als abgeschlossen gilt:

- Code-Review: Der Code wurde von einem Teammitglied überprüft. Dabei wird vorallem auf die Qualität und Edgecases Wert gelegt.

- Unit-Tests: Im Backend sind für alle implenetierten Services Unit-Test zu schrieben.

- Pipeline: Vor dem Merge eines PR muss die Pipeline mit allen Tests erflogreich laufen

- Dokumentation: Alle wichtigen Änderungen werden druch Kommentare und entsprechende Anpassung in der doc.md festgehalten.

- Akzeptanzkriterien: Alle in den Akzeptanzkriterien definierten Anforderungen sind erfüllt.

Um Sicherzustellen das die DoD den aktuellen Anforderungen enspricht muss diese ständig intern und mit dem PO hinterfragt und überarbeitet werden.

## Developer Setup

Für das Entwickeln sind folgende Tools von nöten:

* ideas-ultimate von JetBrains
* docker
* node
* Angular-cli
* Java
* gradle

Eine vollständige Entwicklungsumgebung ist auch über nix mit der beiligenden falke möglich (enthält unfreie Software). 

`nix develop`

### Datenbank

Das Projekt braucht um zu laufen eine MySQL Datenbank. Diese kann zum Entwickeln einfach über Docker gestartet werden.

`docker-compose up -d mysql`

### Frontend

Das Angular Frontend wird zum Entwickeln über das Angular-cli tool gestartet.

1. Pakete installieren

    `npm intall`

2. Frontend Starten

    `ng serve --open`

### Backend

Das Backend kann auf zwei Arten gestartet werden.

#### IDE

Für das Entwickeln sollte `ideas-ultimate` von JetBrains verwendet werden. In der IDE die Hauptapplikation starten. Dies ermöglich auch das Debuggen.

#### Docker

Das Backend kann auch aus komfort Gründen über Docker als Kontainer gestartet werden.

`docker-compose up -d spring-boot-app`

Damit die Datenbank Verindung inherlab der Docker Anwendung richtig läuft muss in der `application.properties` folgende Anpassung gemacht werden.

    spring.datasource.url=jdbc:mysql://${MYSQL_HOST:mysql}:3306/kantine
