---
title: "Zeilen-Spalten-Transformation"
layout: post
date: 2011-03-25
image: /assets/images/markdown.jpg
headerImage: false
tag:
- sql
- oracle rdbms
blog: true
author: torstenmandry
description:  

---


Zu Auswertungszwecken kann es sinnvoll sein, Daten die in einer Tabelle 
in Form von einzelnen Zeilen abgelegt sind in einer View in Spalten zu 
transformieren.

Beispiel:

Tabelle mit Kosten-Datensätzen

    Monat  Jahr  Kostenart  Betrag
    -----  ----  ---------  ------
    1      2010  4711       10
    2      2010  4711       20
    1      2010  0815       30
    2      2010  0815       40

Gewünschtes Ergebnis:

    Monat  Jahr  Betrag_4711  Betrag_0815
    -----  ----  -----------  -----------
    1      2010  10           30
    2      2010  20           40

SELECT-Statement:

    SELECT monat
         , jahr
         , SUM( CASE kostenart WHEN '4711' THEN betrag ELSE 0 END ) AS betrag_4711
         , SUM( CASE kostenart WHEN '0815' THEN betrag ELSE 0 END ) AS betrag_0815
      FROM tabelle
     GROUP BY monat, jahr;

