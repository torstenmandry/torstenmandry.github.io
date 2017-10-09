---
title: "Dependency Inversion Principle und Hexagonale Architektur"
layout: post
date: 2017-10-09 09:13
image: /assets/images/markdown.jpg
headerImage: false
tag:
- Architektur
- Dependency Inversion
- Decoupling
- Hexagonal
- Domain-Driven Design
blog: true
author: torstenmandry
description:  
---

Das **Dependency Inversion Prinzip** gehört zu den wesentlichen Design Prinzipien in der objekt-orientierten Software-Entwicklung. Zusammen mit dem *[Single Responsibility Prinzip][]*, dem *[Open Closed Prinzip][]*, dem *[Liskovschen Substitutionsprinzip][]* und dem *[Interface Segregation Prinzip][]* bildet es das bekannte **[SOLID][]** Akronym.

Die gängige **[Definition][]** des Dependency Inversion Prinzips lautet:

> Module höherer Ebenen sollten nicht von Modulen niedrigerer Ebenen abhängen.

> Beide sollten von Abstraktionen abhängen.

> Abstraktionen sollten nicht von Details abhängen.

> Details sollten von Abstraktionen abhängen.

Ziel des Prinzips ist es, die Module eines Software-Systems möglichst gut voneinander zu entkoppeln.

Zusammengefasst kann man sagen, anstatt

    +-----------+             +-----------+
    | <<class>> |   <<use>>   | <<class>> |
    |     A     | ----------> |     B     |
    |           |             |           |
    +-----------+             +-----------+

möchte man eher haben

    +-----------+             +---------------+                  +-----------+
    | <<class>> |   <<use>>   | <<interface>> |  <<implements>>  | <<class>> |
    |     A     | ----------> |       X       | <--------------- |     B     |
    |           |             |               |                  |           |
    +-----------+             +---------------+                  +-----------+

Auch wenn das Prinzip schon etwas älter ist hat es nichts von seiner Gültigkeit und Bedeutung eingebüßt. Nach meinem Gefühl rückt es aktuell sogar gerade wieder stärker in den Fokus. Grund dafür sind Themen wie **Domain-Driven Design** und die damit oft einhergehende **Hexagonale Architektur**.  

Die Hexagonale Architektur ist ebenfalls nicht neu. Alistair Cockburn verwendete den Begriff seit der Mitte der 90er Jahre und schrieb 2005 einen [Blog Artikel][Hexagonale Architektur] dazu. Die Idee bei der Hexagonalen Architektur (auch *Ports und Adapter*) ist, seine Anwendung so zu designen, dass sie prinzipiell auch ohne UI oder Datenbank funktioniert. Dazu wird die Geschäftslogik ins Zentrum der Anwendung gestellt. Über ein einheitliches API wird diese von unterschiedlichen Konsumenten (z.B. Benutzer, Fremdsysteme aber insbesondere auch automatisierte Tests) verwendet. Die Geschäftslogik soll dabei unabhängig von allen anderen Anwendungsteilen bleiben, d.h. keine Abhängigkeiten besitzen. Sämtliche Interaktion mit der Umgebung erfolgt über Ports und dahinter liegende Adapter, welche rund um die Geschäftslogik angeordnet sind. Alle Abhängigkeiten gehen ausschließlich von Außen (Adapter) nach Innen (Geschäftslogik). Die Adapter untereinander kennen und verwenden sich nicht.

Die folgende Darstellung aus dem [Blog Artikel von Alistair Cockburn][Hexagonale Architektur] illustriert diesen Aufbau.

<img src="../assets/images/hexagonal_architecture.gif"/>

Neben der Hexagonale Architektur gibt es diverse andere, ähnliche Architekturstile, z.B. die [Onion Architecture] von Jeffrey Palermo oder die [Clean Architecture] von Robert C. Martin (Uncle Bob). All diese Architekturstile ergänzen sich sehr gut mit der zurzeit sehr populären Domain-Driven Design Methodik, die sich i.W. auf die Modellierung bzw. das Design der Geschäftsdomäne fokussiert.

Alle Architekturprinzipien und -stile haben aus meiner Sicht eines gemeinsam: Sie klingen isoliert betrachtet total einfach und logisch. Wenn man im Projekt aber dann vor der Herausforderung steht sie anzuwenden steht man oft etwas ratlos da. Ein ganz konkretes, und fast in jedem Projekt vorkommendes, Beispiel für eine solche Situation ist das Thema Persistierung. Natürlich sollen unsere Entitäten persistiert werden. DDD sieht dafür ein *Repository* vor, welches zur Geschäftsdomäne gehört. Der naheliegendste Weg ist daher, das Repository auch innerhalb der Domäne zu implementieren. Damit würden wir unsere Domäne allerdings von der gewählten Persistenztechnologie abhängig machen.

Uncle Bob hat dieses Dilemma in seinem [Cleancoder Blog][cleancoder] sehr unterhaltsam beschrieben.

**Am konkreten Beispiel** kann die Lösung wie folgt ausehen:

In unserer Geschäftdomäne gibt es die Entitäten `Kunde` und `Bestellung`.

    package de.javandry.webshop.domain;

    public class Kunde {
        ...
    }

    public class Bestellung {
        ...
    }

In einer UI wollen wir dem Kunden alle seine Bestellungen anzeigen. Dazu definieren wir in einem `ui` Adapter einen `KundenBestellungenController`.

    package de.javandry.webshop.adapter.ui;

    public class KundenBestellungenController {
        ...
    }

Der Controller muss die Bestellungen zu einem Kunden ermitteln. Zu diesem Zweck definieren wir in unserer Domäne ein `BestellungRepository` mit der Methode `findAllFor(Kunde)`. *Definieren* meint in diesem Fall, wir erstellen ein `Interface` welches die aus Sicht der Domäne notwendigen Methoden eines `BestellungRepository` definiert.

    package de.javandry.webshop.domain;

    public interface BestellungRepository {

        findAllFor(Kunde kunde);

    }

Der `KundenBestellungenController` verwendet nun das `BestellungRepository` aus der Domäne um seine Arbeit zu verrichten.

    package de.javandry.webshop.adapter.ui;

    import de.javandry.webshop.domain.Kunde;
    import de.javandry.webshop.domain.Bestellung;
    import de.javandry.webshop.domain.BestellungRepository;

    public class KundenBestellungenController {

        private final BestellungRepository bestellungRepository;

        public KundenBestellungenController(BestellungRepository bestellungRepository) {
            this.bestellungRepository = bestellungRepository;
        }

        public String showBestellungenForKunde() {
            ...

            List<Bestellung> bestellungen = bestellungRepository.findAllFor(kunde);

            ...
        }
    }

Die Implementierung des Interfaces erfolgt außerhalb der Domäne in einem Persistence Adapter.

    package de.javandry.webshop.adapter.persistence;

    public class JpaBestellungRepository implements BestellungRepository {

        @Override
        public findAllFor(Kunde kunde) {
            // hier kommt die Persistierungslogik
        }
    }

Ein `Dependency Injection` Framework (z.B. Spring) sorgt zur Laufzeit dafür, dass der `KundenBestellungenController` eine Instanz des `JpaBestellungRepository` erhält. Zur Compile-Zeit hängen sowohl UI (`KundenBestellungenController`) als auch Persistenz (`JpaBestellungRepository`) aber nur von der Domäne ab. Die Domäne selbst hat keine Abhängigkeiten.

---

[Single Responsibility Prinzip]: https://de.wikipedia.org/wiki/Single-Responsibility-Prinzip
[Open Closed Prinzip]: https://de.wikipedia.org/wiki/Open-Closed-Prinzip
[Liskovschen Substitutionsprinzip]: https://de.wikipedia.org/wiki/Liskovsches_Substitutionsprinzip
[Interface Segregation Prinzip]: https://de.wikipedia.org/wiki/Interface-Segregation-Prinzip
[SOLID]: https://en.wikipedia.org/wiki/SOLID_(object-oriented_design)
[Definition]: https://de.wikipedia.org/wiki/Dependency-Inversion-Prinzip
[Hexagonale Architektur]: http://alistair.cockburn.us/Hexagonal+architecture
[Onion Architecture]: http://jeffreypalermo.com/blog/the-onion-architecture-part-1/
[Clean Architecture]: https://8thlight.com/blog/uncle-bob/2012/08/13/the-clean-architecture.html
[cleancoder]: http://blog.cleancoder.com/uncle-bob/2016/01/04/ALittleArchitecture.html
