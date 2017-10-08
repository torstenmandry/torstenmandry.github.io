---
title: "Dependency Inversion Principle und Hexagonale Architektur"
layout: post
date: 2017-10-08 12:10
image: /assets/images/markdown.jpg
headerImage: false
tag:
- ddd
- design
blog: true
author: torstenmandry
description:  
---

Das **Dependency Inversion Prinzip** gehört zu den wesentlichen Design Prinzipien in der objekt-orientierten Software-Entwicklung. Zusammen mit dem *Single Responsibility Prinzip*, dem *Open Closed Prinzip*, dem *Liskovschen Substitutionsprinzip* und dem *Interface Segregation Prinzip* bildet es das bekannte **[SOLID][]** Akronym.

Die gängige **[Definition][]** des Dependency Inversion Prinzips lautet:

> Module höherer Ebenen sollten nicht von Modulen niedrigerer Ebenen abhängen.

> Beide sollten von Abstraktionen abhängen.

> Abstraktionen sollten nicht von Details abhängen.

> Details sollten von Abstraktionen abhängen.

Ziel des Prinzips ist es, die Module eines Software-Systems möglichst gut voneinander zu entkoppeln.

Auch wenn das Prinzip schon etwas älter ist hat es nichts von seiner Gültigkeit und Bedeutung eingebüßt. Nach meinem Gefühl rückt es aktuell sogar gerade wieder stärker in den Fokus. Grund dafür sind Themen wie **Domain-Driven Design** und die damit oft einhergehende **[Hexagonale Architektur][]**.  

Idee bei der Hexagonalen Architektur (auch *Ports und Adapter*) ist es, seine Anwendung so zu designen, dass die Geschäftslogik über ein einheitliches API von unterschiedlichen Konsumenten (z.B. Benutzer, Fremdsysteme aber insbesondere auch automatisierte Tests) verwendet werden kann. Die Geschäftslogik bildet den Kern der Anwendung. Sie ist unabhängig von allen anderen Anwendungsteilen, d.h. sie hat keine weiteren Abhängigkeiten. Sämtliche Interaktion mit der Umgebung erfolgt über Ports und dahinter liegende Adapter, welche rund um die Geschäftslogik angeordnet sind. Alle Abhängigkeiten gehen ausschließlich von Außen (Adapter) nach Innen (Geschäftslogik). Die Adapter untereinander kennen und verwenden sich nicht.

Ein ganz konkretes und fast immer vorkommendes Beispiel für einen solchen Adapter ist die Persistierung. Natürlich sollen unsere Entitäten persistiert werden, unsere Geschäftslogik soll aber nicht von der gewählten Persistenztechnologie (z.B. Datenbank) abhängen.

Robert C. Martin (Uncle Bob) hat das in seinem [Cleancoder Blog][cleancoder] sehr unterhaltsam beschrieben.

Am **praktischen Beispiel** kann eine Lösung etwa wie folgt ausehen:

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

Der Controller muss die Bestellungen zu einem Kunden ermitteln. Zu diesem Zweck ist im Domain-Driven Design das *Repository* Pattern vorgesehen, welches mit zur Geschäftsdomäne gehört. Wir definieren also ein `BestellungRepository` mit der Methode `findAllFor(Kunde)`. *Definieren* meint in diesem Fall, wir erstellen ein `Interface` welches die aus Sicht der Domäne notwendigen Methoden eines `BestellungRepository` definiert.

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

Die Implementierung des `Interfaces` erfolgt außerhalb der Domäne in einem `Persistence` Adapter.

    package de.javandry.webshop.adapter.persistence;

    public class JpaBestellungRepository implements BestellungRepository {

        @Override
        public findAllFor(Kunde kunde) {
            // hier kommt die Persistierungslogik
        }
    }

Ein `Dependency Injection` Framework (z.B. Spring) sorgt zur Laufzeit dafür, dass der `KundenBestellungenController` eine Instanz des `JpaBestellungRepository` erhält. Zur Compile-Zeit hängt der Controller aber nur von der Domäne ab. Die Domäne hat keine Abhängigkeiten.

---

[SOLID]: https://en.wikipedia.org/wiki/SOLID_(object-oriented_design)
[Definition]: https://de.wikipedia.org/wiki/Dependency-Inversion-Prinzip
[Hexagonale Architektur]: http://alistair.cockburn.us/Hexagonal+architecture
[cleancoder]: http://blog.cleancoder.com/uncle-bob/2016/01/04/ALittleArchitecture.html
