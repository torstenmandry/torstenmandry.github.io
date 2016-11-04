---
title: "Testen von erwarteten Exceptions mit JUnit4"
layout: post
date: 2011-05-27 16:40
image: /assets/images/markdown.jpg
headerImage: false
tag:
- java
- junit
- testing
blog: true
author: torstenmandry
description: Testen von expected Exceptions in JUnit4 

---

Beim durcharbeiten einer Schulung zum Thema "Microtesting" werde ich 
gerade auf ein Feature in JUnit4 aufmerksam, welches ich bisher noch 
nicht kannte.

Wollte ich bisher testen, dass eine Methode eine Exception auslöst, so 
habe ich in etwa folgenden Test-Code geschrieben:

{% highlight java %}
@Test
public void methodCallShouldThrowNumberFormatException() {
  try {
    objectUnterTest.methodUnderTest();
    fail("Should throw NumberFormatException");
  } catch ( NumberFormatException exc ) {
    // everything is fine
  }
}
{% endhighlight %}


Das ist zum einen etwas umständlich, zum anderen kann es je nach 
verwendeten Code-Analyse Einstellungen auch zu Warnungen führen, dass 
der Catch-Block nichts tut.

Schöner und deutlich einfacher ist die Verwendung des Attributes 
"expected" der @Test Annotation.

{% highlight java %}
@Test ( expected = NumberFormatException.class )
public void methodCallShouldThrowNumberFormatException() {
  objectUnterTest.methodUnderTest();
}
{% endhighlight %}


Damit teile ich JUnit mit, dass ich bei der Durchführung dieses Tests 
erwarte dass eine NumberFormatException ausgelöst wird. Ist dies der 
Fall bewertet JUnit den Test als erfolgreich (grün). Fliegt keine oder 
eine andere Exception schlägt der Test fehl.

Als weiteres Attribut der @Test Annotation kann eine "timeout" 
Zeitspanne angegeben werden, nach welcher der Test mit einem Fehler 
abgebrochen wird. Sicherlich auch nicht falsch, das zu wissen.

Ergänzung: Ab JUnit 4.7 geht das ganze noch eleganter mit der 
ExpectedException Rule (siehe [Blog-Post von Alex Ruiz](http://alexruiz.developerblogs.com/?p=1530)). 
