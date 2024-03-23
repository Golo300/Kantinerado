# Kantinderado

Semester Projekt für das 3/4 Semester. Einfache Kantinen App für eine mittelständische Firma mit Benutzerverwaltung.

## Git Workflow

### Branches

Für jede Userstorie wird ein eigener Branch angelegt.

Branchname:`#<userstory-id>-<Beschriebung mit - getrennt>`

Alle Branches gehen immer von 'main' aus.

### Commits

Für jede Task sollte ein einzelner Commit erfolgen.

### Mergen

Vor jedem Merge muss ein Rebase auf auf 'main' erfolgen. Der Build und Test in der CI/CD Pipeline muss erfolgreich sein, sowie ein approvel durch ein Code Review. Das mergen in 'main' erfolgt erst nach erfolgreichem Abschluss der Userstorie

## Definition of done (Dod)

Intern im Team wurden die folgenden Kriterien definiert, damit eine Aufgabe als abgeschlossen gilt:

- Code-Review: Der Code wurde von einem Teammitglied überprüft.

- Unit-Tests: Es wird versucht neue Features so gut wie möglich mit Unit Test abzudecken

- Pipeline: Vor dem Merge eines PR muss die Pipeline mit allen Test erflogreich laufen

- Dokumentation: Alle wichtigen Änderungen werden druch Kommentare und entsprechende Anpassung in der doc.md festgehalten.

- Code-Stil: Der Code entspricht den vereinbarten Code-Standards und Best Practices.

- Performance-Überprüfung: Die Performance des Codes wurde überprüft und erfüllt die definierten Anforderungen.

- Akzeptanzkriterien: Alle in den Akzeptanzkriterien definierten Anforderungen sind erfüllt.

- Sicherheitsprüfung: Falls relevant, wurden Sicherheitsprüfungen durchgeführt und alle Sicherheitsanforderungen sind erfüllt.

- Review mit dem Product Owner: Der Product Owner hat das Ergebnis im Sprint Review überprüft und akzeptiert.

Um Sicherzustellen das die Dod den aktuellen Anforderungen enspricht muss diese ständig hinterfragt und überarbeitet werden.