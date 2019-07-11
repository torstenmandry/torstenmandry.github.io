---
title: "Domain Exceptions?"
layout: post
date: 2018-04-06
image: /assets/images/markdown.jpg
headerImage: false
tag:
- Domain-Driven Design
- Java
- Exceptions
blog: true
author: torstenmandry
description: Gibt es fachliche Ausnahmen und ist es sinnvoll, diese als Exceptions zu modellieren?
---

Ursprünglich veröffentlicht unter https://www.innoq.com/de/blog/domain-exceptions/


In jedem Softwaresystem kommt es zu Ausnahmesituationen. In der Regel handelt es sich um technische Ausnahmen, die in Java als Exceptions auftreten und behandelt werden. Gibt es aber auch fachliche Ausnahmen, also quasi "Domain Exceptions"? Und ist es sinnvoll, diese in Java als Exceptions zu modellieren? Einige Beispiele aus einem Kundenprojekt zeigen, dass dies häufig nicht der Fall ist.

Joshua Blooch schreibt in seinem Buch "Effective Java":

> "exceptions are, as their name implies, to be used only for exceptional conditions; they should never be used for ordinary control flow."
>
> _Joshua Blooch, Effective Java - Second Edition, Addison-Wesley, 2008, Chapter 9 "Exceptions"_

Diese Aussage soll uns als Grundlage für die Einordung der nachfolgenden Beispiele dienen. Alle Beispiele sind im Kontext einer Kundenservice-Anwendung angesiedelt, in der die Service-Mitarbeiter die Möglichkeit haben Kundenbestellungen einzusehen und zu bearbeiten (z.B. zu stornieren).

## Beispiel 1: Bestellung nicht gefunden

Um eine Bestellung in der Kundenservice-Anwendung aufzurufen, gibt der Mitarbeiter die Bestellnummer ein, die er beispielsweise vom Kunden am Telefon genannt bekommt. In der Regel wird die Bestellung vom System gefunden und angezeigt. In Ausnahmefällen kann es aber vorkommen, dass der Kunde die falsche Nummer nennt oder der Mitarbeiter sich bei der Eingabe vertippt und so keine Bestellung gefunden wird.

Ist in diesem Fall eine `OrderNotFoundException` das richtige Mittel, um die Ausnahmesituation abzufangen und zu behandeln?

Unabhängig davon, wie die Bestellung unter der Haube ermittelt wird (Datenbankabfrage, Suchindex Query, REST Call, ...), wenn eine beliebige Bestellnummer eingegeben werden kann, handelt es sich faktisch um eine Suche im Datenbestand, bei der eine leere Treffermenge ein gültiges und zu erwartendes Ergebnis ist. Anstelle einer Exception ist hier vielleicht die Verwendung eines `Optional<Order>` Rückgabewertes die bessere Alternative.

## Beispiel 2: Bestellung im Logistik-System nicht bekannt

Angenommen der Service-Mitarbeiter will eine Bestellung stornieren, ein Storno wird jedoch in einem separaten Logistik-System durchgeführt. Die Kundenservice-Anwendung leitet die Storno-Anfrage über eine synchrone Schnittstelle an das Logistik-System weiter, dieses kennt die Bestellung nicht und gibt eine Fehlermeldung zurück.

Ist eine `OrderNotFoundException` innerhalb der Kundenservice-Anwendung an dieser Stelle sinnvoll?  

Handelt es sich hier tatsächlich um eine _fachliche Ausnahme_? Schließlich existiert die Bestellung, sonst würde unsere Kundenservice-Anwendung sie nicht kennen. Inkonsistenzen zwischen einzelnen Systemen sind in der Regel kein fachliches sondern eher ein technisches Problem. Insofern wäre hier vielleicht eine technische Exception (z.B. eine `IllegalStateException`) die bessere Wahl.

## Beispiel 3: Bestellung ist nicht stornierbar

Nun kann es natürlich sein, dass die Bestellung im vorangehenden Beispiel aus einem _fachlichen Grund_ noch nicht im Logistik-System bekannt ist, zum Beispiel weil sie zunächst noch geprüft und freigegeben werden muss. Oder aber sie ist dort bekannt, kann jedoch nicht storniert werden weil sie bereits versandt wurde.

Ist dies eine gute Begründung für eine `OrderNotCancelableException`?

In diesem Fall ist eine Bestellung, die nicht storniert werden kann, keine Ausnahme, sondern ein zu erwartendes Szenario, in welchem dem Mitarbeiter die Möglichkeit zum Storno gar nicht angeboten werden sollte. Die Anwendung könnte beispielsweise den Status der Bestellung (z.B. "In Prüfung", "Freigegeben", "Versendet") vorhalten und die Storno-Funktionalität abhängig davon bereitstellen. Alternativ könnte sie zuerst das Logistik-System fragen, ob die Bestellung stornierbar ist, bevor sie dem Mitarbeiter einen entsprechenden Button oder ähnliches anzeigt.

## Beispiel 4: Bestellung wird "zeitgleich" mit Storno versendet

Was aber, wenn die Bestellung zwar in dem Moment, in dem der Mitarbeiter sie in der Anwendung öffnet, stornierbar ist, unmittelbar danach jedoch von der Logistik ausgeliefert wird. Wenn der Mitarbeiter sie nun stornieren möchte, meldet das Logistik-System erneut, dass ein Storno nicht möglich ist.

Ist dies eine _fachliche Ausnahme_, die mit einer `OrderNotCancelableException` abgebildet werden kann?

Auch in diesem Fall handelt es sich prinzipiell um ein zu erwartendes Szenario, welches sich aus der verteilten Architektur ergibt. Es kann durchaus Sinn machen, dieses Szenario als Ausnahme zu betrachten und abzubilden, zum Beispiel wenn die Eintrittswahrscheinlichkeit sehr gering ist. Es handelt sich dann aber auch in diesem Fall eher um eine technische als um eine fachliche Ausnahme. Im Kontext einer JPA Transaktion würde ein solcher Fall beispielsweise eine `OptimisticLockException` auslösen.


## Fazit

Alle in den vorangehenden Beispielen vorgestellten, potentiellen fachlichen Ausnahmen haben sich bei genauerer Betrachtung als keine oder eher technische Ausnahmen herausgestellt. Es mag sein, dass es tatsächlich fachliche Ausnahmen gibt, die sich sinnvoll als "Domain Exceptions" modellieren lassen, es scheint sich dabei aber eher um seltene Einzelfälle - Ausnahmen eben ;) - zu handeln.