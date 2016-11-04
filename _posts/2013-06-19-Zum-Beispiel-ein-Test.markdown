---
title: "Zum Beispiel ein Test"
layout: post
date: 2013-06-19 21:20
image: /assets/images/markdown.jpg
headerImage: false
tag:
- testing
- java
- junit
- acceptance testing
- concordion
- jbehave
- specification by example
blog: true
author: torstenmandry
description: Beispiele helfen in der Analysephase die Kundenanforderungen zu verstehen und zu diskutieren. Später können diese dann als Basis für automatisierte Akzeptanztests verwendet werden. Klingt ganz einfach? In der Praxis kann es jedoch einige Hürden geben, insbesondere wenn es um die Erweiterung einer existierenden Anwendung geht. Im Vortrag werden Erfahrungen aus einem Kundenprojekt geschildert und unterschiedliche Möglichkeiten aufgezeigt um aus definierten Beispielen automatisierte Akzeptanztests abzuleiten. 

---

_Beispiele als Grundlage für Anforderungsanalyse, Spezifikation und 
Implementierung_

<div style="text-align: center;">
<iframe allowfullscreen="" frameborder="0" height="356" marginheight="0" marginwidth="0" mozallowfullscreen="" scrolling="no" src="http://www.slideshare.net/slideshow/embed_code/23204292" style="border-width: 1px 1px 0; border: 1px solid #CCC; margin-bottom: 5px;" webkitallowfullscreen="" width="427"> </iframe>
</div>

[Zum Beispiel ein Test][8] / [torstenmandry@slideshare][9]

Einleitung
----------

Beispiele helfen in der Analysephase die Kundenanforderungen zu 
verstehen und zu diskutieren. Später können diese dann als Basis für 
automatisierte Akzeptanztests verwendet werden. Klingt ganz einfach? 
In der Praxis kann es jedoch einige Hürden geben, insbesondere wenn es 
um die Erweiterung einer existierenden Anwendung geht. Im Vortrag werden 
Erfahrungen aus einem Kundenprojekt geschildert und unterschiedliche 
Möglichkeiten aufgezeigt um aus definierten Beispielen automatisierte 
Akzeptanztests abzuleiten.

Analyse und Spezifikation von Anforderungen
-------------------------------------------

In dem zugrundeliegenden Kundenprojekt wurde ein bestehendes 
Softwaresystem um eine Reihe von neuen Features erweitert. Grundlage für 
die Entwicklung jedes einzelnen Features war die Aufnahme und Analyse 
der Kundenanforderungen und deren Überführung in eine Spezifikation des 
zu entwickelnden Features. Dazu wurden Anforderungsworkshops durchgeführt, 
in denen der Auftraggeber seine Anforderungen präsentierte und mit dem 
Analysten diskutierte. Die Aufgabe des Analysten bestand darin die 
Ergebnisse der Diskussionen in eine „Prosa“-Spezifikation zu überführen. 
Diese wurde anschließend vom Auftraggeber geprüft, freigegeben und 
schließlich zur Umsetzung an den Entwickler übergeben.

Das Ergebnis dieser Vorgehensweise war häufig ernüchternd. Das fertige 
Feature entsprach nur zum Teil den Erwartungen des Kunden. 
Missverständnisse und Spezifikationslücken wurden oft erst im Rahmen der 
Abnahmetests des Kunden aufgedeckt.

Ursache: Auftraggeber, Analyst und Entwickler haben die Spezifikation 
jeweils nach ihren eigenen Vorstellungen interpretiert und sie „so 
verstanden, wie sie sie verstehen wollten“. Jeder hat nach bestem Wissen 
und Gewissen das spezifiziert, geprüft und entwickelt was er verstanden 
hat. Ein gemeinsames Verständnis fehlte, es fiel über diesen Weg jedoch 
nicht auf.

Beispiele
---------

Beispiele veranschaulichen und verdeutlichen Zusammenhänge und helfen 
dadurch Missverständnisse und Lücken aufzudecken. Im Gegensatz zu einer 
allgemeingültig formulierten “Prosa”-Spezifikation verlangen Beispiele 
konkrete Angaben.

Nachfolgend exemplarisch eine Spezifikation sowie ein dazu formuliertes 
Beispiel um dies zu verdeutlichen:

### Spezifikation

> Die Afa einer Investition ergibt sich 
> aus dem Investitionswert, 
> linear verteilt über den Abschreibungszeitraum, 
> beginnend mit dem Monat der Aktivierung

### Beispiel

> Wenn wir eine Investition im Wert von 600 TEUR getätigt haben, 
> die am 01.01.2012 aktiviert wurde, 
> dann folgt daraus, 
> bei einer Abschreibungsdauer von 60 Monaten, 
> eine monatliche AfA in Höhe von 10 TEUR 
> und zwar von Jan/2012 bis Dez/2016

Die Verwendung von konkreten Werten führt oft dazu, dass Fachbegriffe 
verdeutlicht und weitere Details aufgedeckt werden. So war in der 
vorliegenden Spezifikation zunächst nur von einem  „Abschreibungszeitraum“ 
die Rede. Dass es eine definierte „Abschreibungsdauer von 60 Monaten“ 
gibt wurde erst durch das Beispiel offensichtlich. Außerdem werfen 
konkrete Beispiele häufig weitere Fragen auf, wie: „Erfolgt die 
Aktivierung immer am Anfang eines Monats?“ oder „Ist auch eine andere 
Abschreibungsdauer als 60 Monate möglich?“

Im dem zugrundeliegenden Kundenprojekt wurden in Anforderungsworkshops 
bis dahin nur vereinzelt Beispiele verwendet um schwierige Sachverhalte 
zu erklären oder um als Diskussionsgrundlage zu dienen. In den meisten 
Fällen wurden sie jedoch spätestens nach der Überführung in die 
Spezifikation verworfen. Dabei können solche Beispiele im Laufe der 
Diskussion wachsen und weitere Details aufdecken. Angefangen von einem 
grundlegenden Standardfall werden schnell Spezialfälle identifiziert und 
können wiederum durch entsprechende Beispiele festgehalten werden. 
Schnell entsteht auf diesem Weg eine Sammlung von Beispielen, die ein 
Feature nachvollziehbar und überprüfbar beschreibt. Beispiele, die vom 
Kunden oder mit dem Kunden zusammen erarbeitet werden geben auch 
Aufschluss darüber, was dem Kunden wichtig ist und was er vom System 
erwartet. Damit werden neben den Details eines Features auch die 
„Akzeptanzkriterien“ deutlich die der Kunde an das System stellt.

Noch wichtiger als die resultierenden Beispiele ist die Diskussion die 
diese auslösen. Sie führt dazu dass die Teilnehmer das Feature 
wesentlich intensiver beleuchten und detaillierter verstehen als dies 
sonst der Fall wäre.

Allerdings sind Beispiele nicht immer so einfach aufzustellen, wie es 
auf den ersten Blick aussieht. Es verlangt einige Übung innerhalb einer 
Diskussion die richtigen Beispiele zu identifizieren und sich auf die 
relevanten Inhalte zu beschränken. Oft existieren umfangreiche 
Einflussfaktoren die zu einem konkreten Ergebnis führen. Es kann mühsam 
sein, all diese Einflussfaktoren zu identifizieren und mit geeigneten 
Werten zu belegen. Das Ziel sollte daher immer sein sich auf das 
Wesentliche zu beschränken.

Zusammenfassend lässt sich folgende Aussage festhalten:

> Durch die Verwendung von Beispielen 
> wird die Spezifikation eines Features nicht einfacher 
> sondern besser.

Sollen bestehende Features eines Systems geändert werden enthalten die 
entsprechenden Beispiele oft umfangreiche Teile des vorhandenen Systems. 
Werden diese innerhalb eines Anforderungsworkshops „nachspezifiziert“ 
entstehen häufig Aussagen wie „Das haben wir doch alles schon mal 
besprochen. Alles soll bleiben wie bisher, nur…“ Es hat sich in diesen 
Fällen als hilfreich erwiesen bereits im Vorfeld aus dem bestehenden 
System grundlegende Beispiele abzuleiten und diese im Workshop dem Kunden 
als Ausgangspunkt für die Spezifikation der Änderungen zu präsentieren.


Specification by Example
------------------------

In seinem Buch "[Bridging the Communication Gap][1]" beschreibt [Gojko 
Adzic] [2] unter dem Begriff "[Specification by Example][3]" die Verwendung 
von Beispielen als alleinige Spezifikation. Alle relevanten Aspekte eines 
Features werden dabei vollständig in Form von Beispielen beschrieben. 
Eine Prosa-Spezifikation ist demnach nicht mehr notwendig und entfällt.

Führt man diesen Ansatz konsequent weiter können alle definierten B
eispiele in Summe als die Kriterien festgehalten werden bei deren 
Erfüllung das entwickelte Feature als akzeptiert (= abgenommen) gilt. 
Die Entwicklung erfolgt dann von Anfang an basierend auf diesen 
„Akzeptanzkriterien“ und der Entwickler hat sehr konkrete Vorgaben was 
das neue Feature leisten muss. Man spricht in diesem Fall von 
„Acceptance-Test Driven Development“  (ATDD).

In vielen Fällen ist der Kunde jedoch eine Prosa-Spezifikation gewohnt 
und sieht sie oft sogar explizit in seinem Vorgehensmodell und 
entsprechenden Dokumentvorlagen als Artefakt vor. Darüber hinaus lassen 
sich nicht alle Sachverhalte in Form von Beispielen beschreiben. 
Insbesondere Zusammenhänge zwischen einzelnen Sachverhalten sowie 
Begründungen für das geforderte Verhalten können damit nicht ausreichend 
beschrieben werden. Insofern wurde im konkreten Projekt ein Mittelweg 
eingeschlagen bei dem die Prosa-Spezifikation umfangreich durch 
entsprechende Beispiele ergänzt wurde. Im Prosa-Teil werden dabei neben 
der Problemstellung, den Rahmenbedingungen und dem Lösungsentwurf i.W. 
die Kern-Features sowie die wichtigsten Sonderfälle beschrieben. Die 
Beispiele verdeutlichen die Prosa-Beschreibung und ergänzen weitere 
Sonder- und Randfälle.

Vom Beispiel zum Test
---------------------

Neben den bereits beschriebenen Eigenschaften von Beispielen bieten 
diese einen weiteren Vorteil:

**Beispiele können nachgestellt bzw. ausgeführt werden**

Damit sind die Beispiele aus der Analyse/Spezifikation eine optimale 
Grundlage zur Definition von Akzeptanztests.

Formuliert man das zuvor genannte Beispiel etwas um wird dies deutlich:

_Ausgangssituation/-zustand_

> Wir haben eine Investition im Wert von 600 TEUR
> aktiviert am 01.01.2012
> und eine Abschreibungsdauer von 60 Monaten

_Aktion/Ereignis_
> Wenn wir die Afa berechnen

_Erwartetes Ergebnis_
> dann folgt daraus
> eine monatliche AfA
> in Höhe von 10 TEUR
> in der Zeit von Jan/2012 bis Dez/2016	

Damit können die definierten Beispiele eines Features als „Definition of 
Done“ für die Entwicklung festgelegt werden. Wenn alle definierten 
Beispiele (= Akzeptanztests) erfolgreich durchlaufen werden ist das 
Feature vollständig umgesetzt.

Es ist nicht zwingend erforderlich diese Akzeptanztests automatisiert 
umzusetzen. Sie können auch manuell ausgeführt werden. Spätestens wenn 
zum betreffenden Feature weitere Änderungsanforderungen vom Kunden 
gemeldet werden zahlt sich eine Automatisierung jedoch aus. Darüber 
hinaus können automatisierte Akzeptanztests regelmäßig ausgeführt werden 
um sich gegen Regressionsfehler zu schützen.

Im Falle einer Java-Anwendung können die automatisierten Akzeptanztests 
entweder mit Hilfe von Spezifikationsframeworks wie z.B. [JBehave] [4], 
[Cucumber] [5] oder [Concordion] [6] oder ausschließlich auf Basis von 
[JUnit] [7] umgesetzt werden. 
In allen Fällen sollten die Tests wie eine Spezifikation 
lesbar sein Im Optimalfall entsteht dadurch eine „Lebenden Spezifikation“, 
d.h. eine Beschreibung der vollständigen Funktionalität einer Anwendung 
in Form von automatisierten Akzeptanztests.
 
[1]: http://www.acceptancetesting.info/the-book/
[2]: http://gojko.net/
[3]: http://en.wikipedia.org/wiki/Specification_by_example
[4]: http://jbehave.org/
[5]: http://cukes.info/
[6]: http://www.concordion.org/
[7]: http://junit.org/
[8]: http://www.slideshare.net/torstenmandry/vortrag-zum-beispiel-ein-test
[9]: http://www.slideshare.net/torstenmandry