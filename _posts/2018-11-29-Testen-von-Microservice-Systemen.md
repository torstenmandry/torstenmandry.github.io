---
title: "Testen von Microservice-Systemen"
layout: post
date: 2018-11-29
image: /assets/images/markdown.jpg
headerImage: false
tag:
- Microservice
- Testing
blog: true
author: torstenmandry
description: 
---

Ursprünglich veröffentlicht auf [www.innoq.com](https://www.innoq.com/de/blog/testen-von-microservice-systemen/)


Automatisiertes Testen ist in der Softwareentwicklung mittlerweile ein Standardvorgehen. Mit Hilfe von Unit Tests wird das korrekte Verhalten aller Einzelbausteine sichergestellt. Integrationstests prüfen das Zusammenspiel mehrerer (oder aller) Bausteine. Über End-2-End-Tests kann schließlich die gesamte Anwendung als Blackbox betrachtet und über ihre bereitgestellten Schnittstellen (UI, Rest API, Message Queue, ...) verifiziert werden.

Im Kontext eines verteilten Microservice-Systems wird üblicherweise jeder einzelne Service nach dem oben beschriebenen Muster getestet. Services sind in diesem Fall jedoch wiederum einzelne Bausteine, die zu einem Gesamtsystem kombiniert werden. So gesehen können die End-2-End-Tests eines Services als Unit-Test des Gesamtsystems betrachtet werden. Wie aber kann das Zusammenspiel der einzelnen Services getestet und sichergestellt werden. Die Idee, End-2-End-Tests des Gesamtsystems zu erstellen, ist naheliegend. Ist dies aber sinnvoll, oder gibt es andere, besser geeignete Ansätze?

### End-2-End-Tests eines Microservice-Systems

Um End-2-End-Tests des Gesamtsystems durchzuführen, müssen mehrere (oder alle) Einzelservices in einer gemeinsamen Umgebung deployt werden. In dieser Umgebung kann das Gesamtsystem dann über seine öffentlichen Schnittstellen (UI, Rest API, Feeds, ...) angesprochen und getestet werden. Das klingt bereits in dieser kurzen Zusammenfassung alles andere als trivial. Erst recht, wenn man bedenkt, aus welchen Gründen man sich üblicherweise für eine Microservice Architektur entscheidet und welche Auswirkungen diese Entscheidung mit sich bringt. 

Zentrales Merkmal von Microservices ist die Aufteilung eines Gesamtsystems in einzelne kleinere Systeme. Häufiger Grund für diese Entscheidung ist die Erkenntnis, dass das Gesamtsystem zu groß bzw. zu komplex ist, als dass es von einem Team vollständig verstanden und angemessen (weiter-) entwickelt werden könnte. In [1] beschreibt Michael Vitz eine Reihe von Prinzipien, die bei der Entwicklung einer solchen Microservice-Architektur beachtet werden sollten um deren Vorteile zu nutzen. Im Zentrum all dieser Prinzipien steht dabei die Unabhängigkeit. Die Services sollen möglichst unabhängig voneinander entwickelt, deployt und betrieben werden können. Im Extremfall wird jeder Service von einem separaten Team entwickelt, welches wiederum möglichst unabhängig von anderen Teams Entscheidungen zu Programmiersprachen, Technologien, Frameworks, usw. treffen können soll.

Werden End-2-End Tests des Gesamtsystems wie oben beschrieben in die Build und Deployment Pipeline eines einzelnen Services integriert, so ist diese auf einmal von vielen Faktoren Abhängig. Sowohl Probleme in der Test Umgebung als auch Fehler in anderen darin deployten Services können dazu führen, dass die Tests fehlschlagen und das Deployment verhindert wird. End-2-End -Tests erzeugen also genau die Abhängigkeit zu allen anderen (mitgetesteten) Services, die mit der Wahl der Microservice-Architektur verhindert werden soll. 

Wie aber kann dann sichergestellt werden, dass das Gesamtsystem jederzeit wie gewünscht funktioniert?

### Möglichst viel in den Services testen

Die Testpyramide [2] beschreibt das Ziel, möglichst viel über einfach zu schreibende Unit Tests der einzelnen Bausteine abzudecken, und nur wenige, grobe Integrationstests zu verwenden, da letztere i.d.R. schwierig zu entwickeln und pflegen, und zeitaufwändig in der Ausführung sind. Entsprechend der oben genannten Analogie im Microservice-Kontext bedeutet dies, möglichst viel der Funktionalität des Gesamtsystems in den einzelnen Services zu testen. Damit das funktioniert muss jedoch bei der Architektur genauso auf gute Testbarkeit geachtet werden, wie beim Design einer einzelnen Anwendung. Ein Beispiel für eine in diesem Sinne gut testbare Architektur sind [Self-Contained Systems][3]. Bei diesem Architektur-Ansatz werden die einzelnen Teilsysteme entlang der Bounded Contexts geschnitten und stellen neben der Geschäftslogik insbesondere auch das notwendige UI bereit. So können Features bzw. Anwendungsfälle vollständig innerhalb eines Teilsystems getestet werden. Im Gesamtsystem muss optimalerweise nur noch sichergestellt werden, dass die einzelnen Teilsysteme korrekt miteinander verlinkt sind. Im Gegensatz dazu kann ein Feature bei einem Frontend-Monolithen, also einer zentralen UI, die alle Anwendungsfälle abbildet und deren Ausführung an viele einzelne Microservices delegiert, immer nur im Gesamtsystem vollständig (inkl. UI) getestet werden.

### Consumer-driven Contracts

Auch wenn die Services gut geschnitten sind und ein Großteil der Funktionalität innerhalb der Services getestet werden kann, wird es i.d.R. Schnittstellen zwischen den Services oder zu externen Systemen geben. Neben technischen Problemen beim Zugriff auf ein angebundenes System (z.B. Netzwerkausfall, Latenz, …), kann insbesondere die Änderung der API einer Schnittstelle zu Problemen im Zusammenspiel der Services führen. Um sich hiervor zu schützen, können *Consumer-driven Contracts* [4] eingesetzt werden. Hierbei erstellt (und pflegt) der Konsument einer Schnittstelle einen Vertrag in Form von automatisiert ausführbaren Tests, die definieren, welche Teile der Schnittstelle er verwendet und welche Formate er erwartet. Diese Tests inkludiert der Anbieter der Schnittstelle in seine Build und Deployment Pipeline. Führt nun eine Änderung der Schnittstelle zu fehlschlagenden CDC Tests, muss diese Inkompatibilität erst wieder behoben werden (durch Anpassung der Schnittstelle, oder durch Anpassung der Implementierung und des CDC durch den Konsumenten), bevor die Änderung produktiv deployt wird.

### Smoke Tests nach Deployment

Spätestens beim Deployment in die Produktivumgebung müssen die einzelnen Services zu einem Gesamtsystem zusammengesteckt werden. Hier gibt es eine Reihe von möglichen Fehlerquellen, z.B. fehlerhafte URLs, fehlende oder ungültige Security Parameter (Credentials, Tokens, Zertifikate) oder falsche Netzwerkkonfigurationen. Das besondere bei dieser Art von potentiellen Fehlern ist, dass sie spezifisch für die Umgebung sind, in die ein Service deployt wird. Üblicherweise werden umgebungsspezifische Parameter innerhalb eines Services in separaten Profilen abgelegt. Beim Deployment wird dann das jeweils passende Profil für die Zielumgebung aktiviert. Das bedeutet jedoch, dass ein Service, der in einer Entwicklungs- oder Test-Umgebung korrekt funktioniert, trotzdem in einer Preproduction- oder Produktionsumgebung aufgrund eines Fehlers im entsprechenden Profil Probleme haben kann. Hier helfen keine Tests, die innerhalb des Builds oder in einer Testumgebung ausgeführt werden. Solche Probleme können nur da festgestellt werden, wo sie auftreten – insbesondere in der Produktivumgebung. Um diese Fehler dennoch so früh wie möglich zu erkennen, können unmittelbar nach dem Deployment in eine Umgebung sogenannte *Smoke Tests* [5] ausgeführt werden. Diese testen auf möglichst einfachem Weg, ob die wesentlichen Funktionalitäten des Services verfügbar sind. Im Fall eines SCS können das z.B. einfache HTTP Requests sein, welche die wichtigsten Seiten des UI aufrufen und den Response Status (z.B. 200 OK) prüfen. Inkludiert das UI Teile aus anderen Services (per SSI), so kann ähnlich einfach geprüft werden, ob diese Teile angezeigt werden. Je nach Ergebnis der Smoke Tests kann ggf. das weitere Deployment abgebochen werden.

### Monitoring an Stelle von Tests

Gerade in einem verteilten System werden Probleme nicht ausschließlich durch Builds/Deployments ausgelöst. Auch im laufenden Betrieb können Probleme auftreten. Netzwerkkomponenten können ausfallen, so dass angebundene Systeme nicht mehr erreicht werden können, oder aber auch einzelne Services oder Infrastruktur-Komponenten (z.B. Message Bus, Datenbank, …) vollständig ausfallen können. Um solche Probleme zu bemerken, muss das Produktivsystem kontinuierlich überwacht und im Fall von Auffälligkeiten das verantwortliche Team benachrichtigt werden. Darüber hinaus kann auch die Performance des Gesamtsystems über ein gutes Monitoring oft verlässlicher überwacht werden, als mit expliziten Performance-Tests.

Die Performance hängt in viele Fällen stark von der Konstellation der Daten und dem Verhalten der Benutzer/Konsumenten ab. Beides lässt sich nur schwer realistisch in einem Performance-Test nachstellen. Bei neuen Features ist es i.d.R. gar nicht möglich realistische Produktiv-Szenarien vorherzusagen, da noch nicht absehbar ist, wie diese genutzt werden. Wenn ein ausreichend enges Monitoring existiert, wird es auch Fehler feststellen und melden, die durch ein Deployment verursacht werden (z.B. fehlerhafte Konfiguration). In diesem Fall kann es akzeptabel sein, dass ein Teil dieser Fehler nicht im Rahmen des Builds/Deployments entdeckt wird und somit ggf. in Produktion landet, da diese dort schnell entdeckt und behoben werden können. 

### Deployment Risiko und Fehlerauswirkungen reduzieren

Akzeptiert man die Tatsache, dass Fehler in Produktion landen können, stellt sich die Frage, wie sich zumindest das Risiko reduzieren bzw. deren Auswirkungen minimieren lassen. Neben Maßnahmen zur frühzeitigen Fehlererkennung können auch Vorkehrungen getroffen werden, um erkannte Fehler schnell beheben zu können. Beim *Blue-Green Deployment* [6] existieren z.B. zwei parallele, möglichst identische Produktivumgebungen. Eine davon ist live, die andere offline. Ein neues Release wird jeweils in die Offline-Umgebung deployt. Dort kann es ggf. noch manuell getestet werden, bevor diese live und die andere offline geschaltet wird. Treten Probleme auf, kann im Idealfall schnell wieder zur anderen Umgebung und damit zur vorherigen Systemversion gewechselt werden.

Ähnlich ist das Vorgehen beim *Canary-Release* [7]. Auch hier wird ein neues Release parallel zum aktuellen Produktivsystem deployt. Dann werden jedoch zunächst nur einige Requests auf die neue Umgebung geleitet. Im Fall von Fehlern sind somit nicht sofort alle, sondern nur ein Teil der Nutzer/Konsumenten betroffen. Werden Probleme erkannt, kann das Routing zurückgesetzt werden, so dass wieder alle Requests auf das ursprüngliche Release geleitet werden. Andernfalls kann das neue Release nach und nach weiter ausgerollt werden, bis es schließlich alle Requests empfängt.

### Kontinuierliches Testen des Produktivsystems

Verlässt man sich zur Erkennung von potentiellen Fehlern im Gesamtsystem auf das Monitoring, so ist zu beachten, dass einige Fehler u.U. erst dann auffallen, wenn die entsprechenden Teile des Systems verwendet werden. So wird z.B. ein Problem beim Verarbeiten von API Requests erst dann im Produktivsystem auffallen, wenn das API aufgerufen wird. Um Fehler zu erkennen bevor die entsprechenden Stellen durch andere Systeme oder Benutzer aufgerufen werden, kann das Produktivsystem kontinuierlich getestet werden. So kann z.B. alle paar Minuten ein Job angestoßen werden, der, analog zu den o.g. Smoke Tests, die wesentlichen Teile des Systems aufruft. Die Tests können entdeckte Probleme entweder aktiv melden oder lediglich dazu dienen, die Fehler auszulösen, die dann vom Monitoring erkannt und gemeldet werden.

### Fazit

Neben dem korrekten Verhalten der einzelnen Services eines Microservice-Systems muss auch deren Zusammenspiel sichergestellt werden. End-2-End-Tests des Gesamtsystems (aller Microservices) innerhalb der Deployment Pipeline eines Services sind prinzipiell möglich, jedoch sehr aufwändig und fehleranfällig. Außerdem erzeugen sie eine Abhängigkeit zwischen allen Services, die man in einer solchen Architektur nicht haben möchte. Mit Hilfe einiger alternativer Ansätze, die besser zu einer Microservices-Architektur passen, kann in vielen Fällen ein ausreichender Schutz vor potentiellen Problemen erreicht werden.  


[1]: https://www.innoq.com/de/articles/2018/09/prinzipien-fuer-unabhaengige-systeme/
[2]: https://martinfowler.com/bliki/TestPyramid.html
[3]: https://scs-architecture.org/
[4]: https://www.innoq.com/de/articles/2016/09/consumer-driven-contracts/
[5]: https://en.wikipedia.org/wiki/Smoke_testing_(software)
[6]: https://martinfowler.com/bliki/BlueGreenDeployment.html
[7]: https://martinfowler.com/bliki/CanaryRelease.html