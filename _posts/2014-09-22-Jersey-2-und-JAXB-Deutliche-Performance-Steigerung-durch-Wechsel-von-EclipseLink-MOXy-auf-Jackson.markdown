---
title: "Jersey 2 und JAXB - Deutliche Performance-Steigerung durch Wechsel von EclipseLink MOXy auf Jackson"
layout: post
date: 2014-09-22 23:15
image: /assets/images/markdown.jpg
headerImage: false
tag:
- java
- jackson
- jaxb
- jersey
blog: true
author: torstenmandry
description:  

---

In der vergangenen Woche haben wir ein Performance-Problem in einem 
unserer REST Services analysiert. Der Service dient einer Reihe von 
internen Applikationen als zentrales Gateway zu einem externen Provider 
von Patentinformationen. Auf Anfrage ruft er bei dem externen 
Dienstleister Patentinformationen in Form von JSON Objekten ab um diese 
dann in ein internes XML-Format umzuwandeln und an die aufrufenden 
Applikationen zurückzugeben.

Sowohl die Server-Seite für die internen Applikationen, als auch die 
Client-Seite zur Anbindung des externen Dienstleisters ist mit Jersey 2 
realisiert. Für die Umwandlung werden die vom Dienstleister abgerufenen 
JSON-Strings mit Hilfe von JAXB in ein Objektmodell überführt. Dieses 
wird anschließend in ein Zielmodell transformiert und wiederum über JAXB 
in das auszuliefernde XML-Format serialisiert. Als JAXB-Implementierung 
verwendeten wir bisher EclipseLink MOXy, die Standard-Implementierung 
bei Jersey.

Das Problem
-----------

Die grundsätzliche Verarbeitungsgeschwindigkeit unseres Services war in 
Ordnung. Er war in der Lage ein bis zwei Patent-Dokumente pro Sekunde zu 
verarbeiten, was uns nicht in Jubel verfallen lies, für unsere 
angebundenen Applikationen jedoch vermutlich ausreichend war. Während 
der abschließenden Tests fiel uns allerdings auf, dass einige der 
Anfragen z.T. mehrere Sekunden dauerten. Bei steigender Last stieg auch 
die Häufigkeit dieser lang laufenden Anfragen, sowie die Zeit die diese 
benötigten. In Ausnahmefällen konnten wir Antwortzeiten von 45 Minuten(!) 
und mehr beobachten. Außerdem war auffällig, dass die CPU-Nutzung während 
dieser lang laufenden Anfragen kontinuierlich hoch war. Bei Batch-Abfragen 
mit mehreren parallelen Threads ließ sich anhand der CPU-Auslastung 
deutlich erkennen, wieviele Threads gerade mit einer solchen lang laufenden 
Anfrage beschäftigt waren.

Die Suche nach der Ursache
--------------------------

Zunächst vermuteten wir die Ursache beim externen Dienstleister, dessen 
Service auch an anderen Stellen bereits einige Schwächen gezeigt hatte. 
Wir analysierten das System mit Hilfe von VisualVM und fanden heraus, 
dass die lang laufenden Prozesse immer an derselben Stelle hingen, 
nämlich in der `javax.ws.rs.core.Response` bei der Ausführung der Methode 
`readEntity(Class entityType)`. Das schien unseren Verdacht zunächst zu 
bestätigen. Wenn das Auslesen des Inhalts der Response lange dauert, 
liegt das vermutlich daran, dass dieser vom Server zu langsam geliefert 
wird. Zwei Punkte gab es jedoch, die uns komisch vorkamen:

1. Wir hatten in Jersey eine Timeout-Zeit von 90 Sek. konfiguriert, 
deren prinzipielles Funktionieren wir auch beobachten konnten. Warum 
griff diese in den von uns beobachteten Fällen nicht?

2. Wenn unser Service lediglich auf die Übertragung der Antwortdaten vom 
Dienstleister wartet, woher kommt dann die hohe CPU-Auslastung?

Ein genauerer Blick in die "hängenden" Threads führte uns dann auf die 
richtige Spur. Die Threads warteten nicht sondern waren eifrig damit 
beschäftigt die z.T. recht großen JSON-Strings vom Dienstleister (bis zu 
30 MB!) zu parsen. Knackpunkt war dabei eine Methode des 
`org.eclipse.persistence.internal.oxm.record.json.JSONReaders` 
([EclipseLink MOXy][1]):

`private static String string(String string)`

Neben der etwas gewöhnungsbedürftigen Signatur fiel uns vor allem der 
interne Umgang mit der übergebenen Zeichenkette auf. Zum einen wird der 
Ergebnis String per einfacher String-Konketenation (+=) zusammengebaut, 
wofür in Java extra effizientere Methoden (`StringBuffer` bzw. 
`StringBuilder`) vorhanden sind. Zum anderen arbeitet die Methode an 
einigen Stellen mit Substrings. 
Über die geänderte Implementierung der Substring-Methode ab der 
Java-Version 7 waren wir bereits an einer anderen Stelle gestolpert. Im 
Gegensatz zur Java 6 Implementierung, bei der ein Substring weiterhin 
auf dasselbe Character-Array im Speicher verwiesen und lediglich das 
relevante Fenster (Offset, Count) neu definiert hat, legt die Java 7 
Implementierung eine Kopie des Character-Arrays im Speicher an (siehe 
dazu auch [http://www.programcreek.com/2013/09/the-substring-method-in-jdk-6-and-jdk-7/][2]). 
Diese geänderte Vorgehensweise macht an vielen Stellen Sinn (wenn aus 
einem großen Strings nur einige wenige Zeichen zur weiteren Verarbeitung 
benötigt werden und der Rest verworfen werden kann). In unserem speziellen 
Fall führte sie jedoch dazu, dass die ohnehin schon speicherintensiven 
Strings noch mehrere Male kopiert wurden.

Der Wechsel zu Jackson
----------------------

Auf der Suche nach Lösungen kamen wir zu der Idee, dass der Austausch 
einer JAXB Implementierung in der Theorie doch eigentlich problemlos 
möglich sein sollte. Schließlich definiert das JDK die verwendete API 
und ich muss lediglich die Implementierung meiner Wahl hinzufügen. In 
früheren Projekten hatten wir recht gute Erfahrungen mit [Jackson][3] 
gesammelt. Wir entschieden uns es einfach zu versuchen, auch wenn wir 
nicht sicher waren, ob eine andere Implementierung unser Problem wirklich 
beheben würde. 

Im ersten Ansatz suchten wir uns die zu unserer Jersey Version 2.5.1 
passende Jackson Bridge [jersey-media-json-jackson 2.5.1][4] heraus. 
Leider mussten wir beim Aktualisieren der Dependencies feststellen, dass 
diese noch auf die Jackson Version 1.9.13 verwies. Eine Jackson 2.x 
Version hatten wir uns allerdings schon vorgestellt. Ein Versuch der 
vorhandenen Jersey Version einfach ein Jackson 2 unterzujubeln 
funktionierte erwartungsgemäß nicht. Also galt es auch Jersey zu 
aktualisieren. 

Die jersey-media-json-jackson Bridge verwendet Jackson 2 ab der Version 
2.9. Da war der Weg bis zur aktuellen Version Jersey Version 2.11 auch 
nicht mehr weit. Wir aktualisierten Jersey 2.5.1 also auf die Version 
2.11, entfernten die jersey-media-moxy Bridge sowie EclipseLink MOXy 
selbst und fügten statt dessen die jersey-media-json-jackson Bridge und 
die aktuelle Jackson Version 2.4.1 hinzu. Neben den von der Jersey-Bridge 
referenzierten Jackson-Bibliotheken fügten wir außerdem noch die 
jackson-dataformat-xml Bibliothek hinzu, um auch die Serialisierung ins 
interne XML-Format über Jackson abbilden zu können. Nach dem Update der 
Dependencies galt es dann ein paar Compiler-Fehler zu beheben.

Das bisher im Jersey Client registrierte `MoxyJsonFeature` wurde durch das 
`JacksonFeature` ersetzt. Anstelle eines custom `MoxyJsonContextResolver` 
erstellten wir einen analogen `JacksonObjectMapperContextResolver` (nach 
Vorbild der [Jersey Dokumentation][5]) und registrierten ihn ebenfalls im 
Jersey Client.

In einigen Beans unseres internen Objektmodells hatten wir einzelne 
Properties mit der MOXy-Annotation `@XmlCDATA` versehen um für diese bei 
der Serialisierung nach XML die Kapselung in einer CDATA-Sektion zu 
erzwingen. Dies ist notwendig, da die enthaltenen Textdaten HTML-Tags 
zur Formatierung enthalten, die für die Anzeige in den angebundenen 
Applikationen verwendet werden und somit nicht maskiert werden sollen. 
In Jackson gibt es keine Möglichkeit eine CDATA-Kapselung gezielt für 
einzelne Properties zu erzwingen. Als Alternativlösung erstellten wir 
einen `CDataContentHandler` ([gefunden bei stackoverflow][6]), der für 
alle serialisierten Properties angewendet wird und die Werte in eine 
CDATA-Sektion kapselt wenn es notwendig ist. Den Content Handler geben 
wir dem JAXB Marshaller in der marshal-Methode mit.

In dem Bean Package für das Objektmodell des Dienstleister-Formats hatten 
wir in einer `jaxb.properties` Datei noch die MOXy JAXBContextFactory 
registriert. Welche Context Factory hier für Jackson einzutragen ist 
haben wir nicht herausgefunden, also haben wir die Datei kurzer Hand 
gelöscht. Die anschließenden grünen Integrationstests haben uns recht 
gegeben. Der Umstieg war geschafft. Fairerweise muss gesagt werden, dass 
wir uns die hier aufgeführten Punkte mühsam zusammensuchen mussten und 
somit insgesamt gut einen Tag mit dem Umstieg zugebracht haben. Nicht 
zuletzt war das auch der Grund das alles in einem Blog-Artikel festzuhalten.

Das Resultat
------------

Nachdem alle Tests wieder grün waren blieb die spannende Frage: Was hat 
die ganze Aktion jetzt gebracht.

Wie deployten den umgestellten REST Service in unsere Testumgebung, 
ließen die ersten kleinen Lasttests dagegen laufen und beobachteten 
gebannt die CPU- und Memory-Auslastung in VisualVM bzw. der JConsole. 
Die Verbesserung war enorm, viel größer als wir sie erwartet hatten. 
Hatte unser Service zuvor unter Last im Durchschnitt zwischen 500 und 
800 MB Speicher und zwischen 40 und 60 % CPU-Last (mit Peeks bis zu 90 %) 
verursacht, so kommt er jetzt mit um die 250 - 300 MB Speicher und 
halbwegs konstant unter 10 % CPU-Last aus. Das spürt man auch an den 
Antwortzeiten und der Stabilität. Lang laufende Anfragen kommen nicht 
mehr vor. 

**Fazit**: Die umfangreiche Analyse sowie die Umstellung auf Jackson 
haben sich für uns auf jeden Fall gelohnt. Für zukünftige Projekte werden 
wir vermutlich gleich auf Jackson setzen.

[1]: http://www.eclipse.org/eclipselink/moxy.php
[2]: http://www.programcreek.com/2013/09/the-substring-method-in-jdk-6-and-jdk-7/
[3]: https://github.com/FasterXML/jackson
[4]: http://grepcode.com/snapshot/repo1.maven.org/maven2/org.glassfish.jersey.media/jersey-media-json-jackson/2.5.1
[5]: https://jersey.java.net/documentation/2.11/media.html#json.jackson
[6]: http://stackoverflow.com/questions/3136375/how-to-generate-cdata-block-using-jaxb