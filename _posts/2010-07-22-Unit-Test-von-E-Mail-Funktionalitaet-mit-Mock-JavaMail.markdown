---
title: "Unit-Test von E-Mail Funktionalität mit Mock JavaMail"
layout: post
date: 2010-07-22 22:30
image: /assets/images/markdown.jpg
headerImage: false
tag:
- java
- javamail
- mocking
- testing
blog: true
author: torstenmandry
description: Automatisiertes Testen des Versands von E-Mails mit Mock JavaMail 

---

Automatisiertes Testen von Java-Code ist meist nicht so einfach. Selbst 
wenn die erste Hürde genommen ist und man weiß was man testen will, 
bleibt man oft recht schnell an der Frage hängen, wie das zu tun ist. 
Richtig schwierig wird es, wenn die zu testende Funktionalität von 
externen Diensten abhängt. Der Versand von E-Mails fällt in diese 
Kategorie.

Vor kurzem stand ich im Rahmen eines Projektes vor dem Problem den 
Versand von E-Mails zu testen. Nach kurzer Recherche bin ich auf das 
Mock JavaMail Projekt (https://mock-javamail.dev.java.net/) gestoßen.

Die Verwendung von Mock JavaMail ist so einfach wie genial. Es muss 
lediglich das JAR-Archiv in den Classpath des JUnit-Tests aufgenommen 
werden und schon ersetzt die Mock-Implementierung den echten Mail-
Server. Eine Anpassung der JavaMail-Konfiguration ist nicht notwendig. 
Im einfachsten Fall kann der fest verdrahtete Mail-Server in der Java-
Klasse stehen.

Auf die gesendete E-Mail zugreifen kann man über eine Mailbox-Klasse, 
über welche zu einer E-Mail-Adresse eine Liste der empfangenen 
Nachrichten abgerufen werden kann.

{% highlight java %}
@Test
public void testSendMail() {
    String subject = "Test E-Mail";
    String message = "Dies ist eine Test E-Mail";
    String recipientEmail = "test@mail.de";
    String senderEmail = "noreply@mail.de";

    mailSender.sendMail(subject, message, recipientEmail, senderEmail);

    try {
      List inbox = Mailbox.get(recipientEmail);

      assertEquals("Mailbox enthält falsche Anzahl E-Mails", 1, inbox.size());

      Message mail = inbox.get(0);

      assertEquals("Empfangene E-Mail hat falschen Betreff", subject,
          mail.getSubject());
      assertTrue("Empfangene E-Mail hat falschen Absender", mail.getFrom()[0]
          .toString().contains(senderEmail));

    } catch (AddressException exc) {
      fail(exc.toString());
    } catch (MessagingException exc) {
      fail(exc.toString());
    }
}
{% endhighlight %}

Neben dem Abfangen und Testen von gesendeten E-Mails kann mit Mock 
JavaMail auch eine Mailbox simuliert (gemockt) werden, um das Abrufen 
von E-Mails (z.B. über POP3) zu testen.

Schließlich kann das Framework dazu verwendet werden Fehler beim Senden 
von E-Mails zu provozieren um so das Fehler-Handling der eigenen 
Applikation zu testen.

{% highlight java %}
@Test
public void testSendMailError() {
    String subject = "Test E-Mail";
    String message = "Dies ist eine Test E-Mail";
    String recipientEmail = "test@mail.de";
    String senderEmail = "noreply@mail.de";

    try {
      Mailbox.get(recipientEmail).setError(true);

      try {
        mailSender.sendMail(subject, message, recipientEmail, senderEmail);
        fail("Fehler beim E-Mail-Versand löst keine RuntimeException aus");
      } catch (RuntimeException exc) {
        // Success
      }

    } catch (AddressException exc) {
      fail(exc.toString());
    }
}
{% endhighlight %}

Ein sehr hilfreiches Test-Framework das man kennen sollte. 