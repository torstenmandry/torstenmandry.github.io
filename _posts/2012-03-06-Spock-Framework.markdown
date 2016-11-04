---
title: "Spock Framework"
layout: post
date: 2012-03-06
image: /assets/images/markdown.jpg
headerImage: false
tag:
- grovvy
- spock
- testing
blog: true
author: torstenmandry
description:  

---

Was ist Spock?
--------------

* Groovy Testing bzw. Specification Framework
* Intuitive und Ausdrucksstarke DSL
* Das beste von verschiedenen anderen Frameworks und Sprachen 
(z.B. JUnit, JMock, RSpec, Groovy, Scala, ...)

Spock Specification
-------------------

* Groovy Test-Klasse
* Abgeleitet von `spock.lang.Specification`
* Besteht aus
    * Fields
    * Fixture-Methods
    * 1 - n Feature-Methods
    * ggf. Helper-Methods

Fields
------

* z.B. System under Specification (SUS)
* Werden standardmäßig für jede Feature-Method neu initialisiert
* @Shared Annotation

Fixture-Methods
---------------

* Zum Herstellen von Ausgangszustand bzw. Bereinigen von Endzustand
* setup und cleanup - entspricht @Before und @After in JUnit
* setupSpec und cleanupSpec - entspricht @BeforeClass und @AfterClass in JUnit

Feature-Methods
---------------

* Eigentliche "Test"-Methoden
* Beschreiben Features
* Name = String-Literal (z.B. `def "Maximum von zwei nummerischen Werten"()`)

Vier Phasen
-----------

* Setup Fixture
* Stimulus
* Expected Response
* Cleanup Fixture

Blocks
------

* Definition der Phasen
* setup oder given
    * Setup fixture
    * beliebiger Code
* when
    * Stimulus
    * beliebiger Code
* then
    * expected response
    * boolean conditions (ohne assert)
* expect
    * expected response für funktionale Methoden
    * boolean conditions
* cleanup
    * Cleanup fixture
* where
    * für data-driven feature methods
    * zur Definition von Data-Tables

Helper-Methods
--------------

* z.B. extrahieren von komplexen Conditions

Links
-----

* [Spock Homepage](http://code.google.com/p/spock/)
* [Spock Basics](http://code.google.com/p/spock/wiki/SpockBasics) - i.W. Grundlage für die kurze Einführung
* [Spock Web-Console](http://meetspock.appspot.com/?id=9001) - Online Experimentieren mit Spock
* [RheinJUG Vortrag von Igor Drobiazko](http://rheinjug.de/videos/gse.lectures.app/Talk.html#Spock)

Code-Beispiel
-------------

{% highlight groovy %}
import spock.lang.Unroll

class MathSpec extends spock.lang.Specification {

    def "Maximum von zwei nummerischen Werten etwas umständlicher"() {
        given:
        def a = 1
        def b = 5
        def c = 5

        when:
        def r = Math.max(a, b)

        then:
        r == c
    }

    def "Maximum von zwei nummerischen Werten"() {
        expect:
        Math.max(1, 5) == 5
        Math.max(2, 3) == 3
    }

    def "Arithmetic Exception is thrown when division by zero"() {
        when:
        1.0 / 0

        then:
        ArithmeticException e = thrown()
        e.message =~ "Division"
    }

    def "Maximum von zwei nummerischen Werten data-driven"() {
        expect:
        Math.max(value1, value2) == result

        where:
        value1 << [1, 2, 3]
        value2 << [5, 3, 7]
        result << [5, 3, 7]
    }

    @Unroll("Maximum von #value1 und #value2 ist #result")
    def "Maximum von zwei nummerischen Werten data-driven mit data-table"() {
        expect:
        Math.max(value1, value2) == result

        where:
        value1 | value2 | result
        1      | 5      | 5
        2      | 3      | 3
        7      | 3      | 7
    }

    def "Test mit komplexem assert"() {
        given:
        StringBuffer sbuf = new StringBuffer()

        when:
        sbuf.append("test")

        then:
        stringWurdeAngehaengt(sbuf)
    }

    def stringWurdeAngehaengt = { sbuf ->
        sbuf.length() == 4 &&
                sbuf.toString() == "test"
    }
}
{% endhighlight %}