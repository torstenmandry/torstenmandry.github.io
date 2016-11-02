---
title: "Java Generics - wie (typ)sicher kann ich mir sein"
layout: post
date: 2010-12-22 23:03
image: /assets/images/markdown.jpg
headerImage: false
tag:
- java
- generics
blog: true
author: torstenmandry
description: 

---

Ich habe heute mit einem Kollegen vor einem etwas kniffligen Problem 
gesessen. Beim Versuch in einer JSF-Seite auf ein Property eines 
Entities zuzugreifen bekamen wir einen Fehler, da dort anstelle des 
erwarteten Entities ein BigDecimal-Wert ankam. Es war klar, dass es sich 
dabei um einen dummen Fehler in unserem Code handeln musste, die Frage 
war nur, wo der zu suchen war. Auf den ersten und auch auf den zweiten 
Blick sah alles OK aus. Das Entity kam aus einer java.util.List die über 
Java Generics typsicher definiert war. Erst nachdem wir an einer 
passenden Stelle einen Breakpoint eingefügt haben, kamen wir so langsam 
dahinter was da schief lief.

Um die Sache einfacher erklären zu können hier ein stark vereinfachtes 
Beispiel:


{% highlight java %}
import java.util.List;

public class MyClass {
  DataProvider dataProvider;

  public MyClass() {
    dataProvider = new DataProviderImpl();
  }

  @SuppressWarnings( "unchecked" )
  public void loadData() {
    List<MyEntity> data = (List<MyEntity>) dataProvider.getData();
    // Do something with the data...
  }
}
{% endhighlight %}

Sieht auf den ersten Blick alles korrekt aus, oder? Das haben wir auch 
gedacht, aber irgendwo musste ja der Fehler stecken.

Quiz-Frage: Welchen Typ haben die Elemente in der List<MyEntity> data?

Man sollte annehmen, dass darin nur Objekte vom Typ MyEntity enthalten 
sein können, oder? Stimmt aber nicht! In unserem Fall waren darin zur 
Laufzeit BigDecimal-Werte, weil in unserem DataProvider die Methode 
fehlerhaft programmiert war. Die eigentliche Fehlerursache war 
letztendlich ziemlich unspektakulär (wir hatten vergessen bei einer 
Hibernate SQL-Query den entsprechenden Entity-Typ anzugeben). Viel 
spannender war die Frage warum wir keine ClassCastException bekommen 
hatten, die uns wahrscheinlich ziemlich schnell auf die Ursache 
aufmerksam gemacht hätte.

Um das zu verstehen muss man wissen, dass Java Generics lediglich vom 
Java Compiler - also zur Kompilierzeit - interpretiert werden. Zur 
Kompilierzeit kann der Compiler nicht wissen, ob die getData() Methode 
zur Laufzeit eine Liste mit MyEntity- oder anderen Objekten zurückgibt, 
da die Methoden-Signatur nur eine einfache List (ohne Generics-
Definition) als Rückgabe-Typ definiert. Das einzige was der Compiler tun 
kann ist uns zu warnen, dass er eine typunsichere Zuweisung gefunden 
hat. Das hat er in unserem Beispiel sogar getan, aber wir haben mit der 
@SuppressWarnings Annotation explizit gesagt "Kein Problem, wir wissen 
was wir tun" (eine fatale Selbstüberschätzung).

Beim Kompilieren - nachdem mögliche Typ-Fehler und/oder -Warnungen 
ausgewertet wurden - werden die Generics-Angaben aus dem Quell-Code 
entfernt. Das was nach dem Kompilieren - im Java Byte-Code - von der 
Zuweisung bestehen bleibt ist das Folgende:

{% highlight java %}
List data = (List) dataProvider.getData();
{% endhighlight %}

Also eine Cast-Anweisung die zur Laufzeit keine Auswirkung mehr hat. 
Daher wird hier auch keine ClassCastException ausgelöst, egal welchen 
Typ von Elementen die getData() Methode zurückgibt.

Um den gewünschten Cast-Effekt zu erhalten müssen die einzelnen Elemente 
der Liste gecastet werden.

{% highlight java %}
List data = new ArrayList();
for (Object o : dataProvider.getData()) {
  data.add((MyEntity) o);
}
{% endhighlight %}

Dann kann auch die @SuppressWarnings Annotation entfernt werden, und zur 
Laufzeit fliegt die erwartete ClassCastException, sobald dort was 
anderes ankommt als erwartet.

Fazit: Die @SuppressWarnings Annotation ist schnell eingefügt (in 
Eclipse gibt's dafür sogar extra einen Quick Fix). Trotzdem macht es 
manchmal Sinn den oben beschriebenen "Umweg" in Kauf zu nehmen um 
wirklich sicher zu sein, dass unerwartete Elemente nicht einfach 
weiterverarbeitet werden.

In diesem Sinne, frohe Weihnachten...